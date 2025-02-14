import { useFormik } from "formik";
import { Col, Row } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { HomepageProductsFilterProps } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";

import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusFaqService,
  ListFaqCategoryService,
} from "../../../Service/ApiMethods";
import {
  CheckfiltersAvailable,
  ConvertDatetime,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { ShowBigContent } from "../../../Shared/Components";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Faq() {
  const navigate = useNavigate();
  const token = GetToken();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [showFilter, setshowFilter] = useState(false);
  const tableFilters = GetTableFilters();
  const { isLoading } = useLoaderHook();
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { items, page, size, total } = DataList;
  const {
    values,
    initialValues,
    setFieldValue,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit(values) {
      setFilters(values);
      GetListFaq(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListFaq = (
    page = 1,
    size = 10,
    values?: HomepageProductsFilterProps
  ) => {
    isLoading(true);

    let finalObj = {
      ...values,
      token: token,
    };
    ListFaqCategoryService(page, size, ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          setDataList(response.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => {
        getCatchMsg(err);
      })
      .finally(() => {
        isLoading(false);
      });
  };

  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => getTableSNO(page, size, index),
      key: "sno",
    },

    {
      lable: "Title",
      render: (text) => ShowBigContent(text),
      key: "title",
      showTooltip: true,
    },

    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sortOrder",
      className: classes.NameBox,
    },
    {
      lable: "Created At",
      className: classes.NameBox,
      render: (text) => (text ? ConvertDatetime(text, "DATE_TIME") : "-"),
      key: "created_at",
    },

    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          disabled={!permissons?.cms?.faq?.change_status ? true : false}
          checked={text === 1 ? true : false}
          onChange={() => {
            handleChangeFaqStatus(data.faqCategoryId, text === 1 ? 0 : 1);
          }}
        />
      ),
      key: "status",
    },
    {
      lable: "Action",
      render: (text, data) => {
        return (
          <TableActionBlock
            permissionData={permissons?.cms?.faq}
            onClickEditIcon={() => {
              navigate("/cms/modify_faq", {
                state: {
                  type: "Update",
                  UpdateData: data,
                  filters: {
                    page,
                    size,
                    filters,
                  },
                },
              });
            }}
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.faqCategoryId,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  const handleChangeFaqStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      faqCategoryId: id,
      status: status,
    };

    ChangeStatusFaqService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListFaq(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      let finalFilters = tableFilters?.filters || values;
      GetListFaq(
        tableFilters?.page || 1,
        tableFilters?.size || 10,
        finalFilters
      );
      setValues(finalFilters);
      setFilters(finalFilters);
      setshowFilter(CheckfiltersAvailable(finalFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <>
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="FAQ"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeFaqStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="FAQ"
        OnClickAdd={() => {
          navigate("/cms/modify_faq", {
            state: {
              type: "Create",
              filters: {
                page,
                size,
                filters,
              },
            },
          });
        }}
        permissionData={permissons?.cms?.faq}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
      />
      <div className={classes.bgContainer}>
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Title"
                maxLength={INPUT_LENGTHS.title}
                placeholder="Enter Title"
                value={values.title}
                onChange={(data) => {
                  setFieldValue("title", data);
                }}
                handleSubmit={handleSubmit}
              />
            </Col>

            <Col>
              <SubmitResetBlock
                handleClickReset={() => {
                  resetForm();
                  handleSubmit();
                }}
                handleClickSubmit={() => handleSubmit()}
              />
            </Col>
          </Row>
        </FiltersAccordion>
        <div className={classes.tablecontainer}>
          <GlobalTable items={items} Options={Options} total={total} />
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetListFaq}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
