import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { HomeBannerFiltersType } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeStatusFooterAddressService,
  ListFooterAddressService,
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

export default function FooterAddress() {
  const navigate = useNavigate();
  const token = GetToken();
  const tableFilters = GetTableFilters();
  const [showFilter, setshowFilter] = useState(false);
  const { isLoading } = useLoaderHook();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
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
    setValues,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit(values) {
      setFilters(values);
      GetListFooterAddress(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListFooterAddress = (
    page = 1,
    size = 10,
    values?: HomeBannerFiltersType
  ) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };
    ListFooterAddressService(page, size, ConvertJSONtoFormData(finalObj))
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
      key: "title",
      render: (text) => ShowBigContent(text),
      showTooltip: true,
    },
    {
      lable: "Phone Number",
      render: (text) => text ?? "-",
      key: "phone",
      className: classes.NameBox,
    },

    {
      lable: "Email",
      render: (text) => ShowBigContent(text),
      showTooltip: true,
      key: "emailId",
    },

    {
      lable: "Sort Order",
      render: (text) => text ?? "-",
      key: "sortOrder",
      className: classes.NameBox,
    },
    {
      lable: "City",
      render: (text) => ShowBigContent(text),
      showTooltip: true,
      key: "city",
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
          disabled={
            !permissons?.cms?.footer_address?.change_status ? true : false
          }
          checked={text === 1 ? true : false}
          onChange={() => {
            handleChangeFooterAddress(
              data.footerAdddressid,
              text === 1 ? 0 : 1
            );
          }}
        />
      ),
      key: "status",
    },
    {
      lable: "Action",
      render: (_, data) => {
        return (
          <TableActionBlock
            permissionData={permissons?.cms?.footer_address}
            onClickEditIcon={() => {
              navigate("/cms/modify_footer_address", {
                state: {
                  type: "Update",
                  UpdateData: data,
                  filters: { page, size, filters },
                },
              });
            }}
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.footerAdddressid,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  const handleChangeFooterAddress = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      footer_id: id,
      status: status,
    };

    ChangeStatusFooterAddressService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListFooterAddress(page, size, filters);
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
      GetListFooterAddress(
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
            name="Footer Address"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeFooterAddress(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Footer Address"
        OnClickAdd={() => {
          navigate("/cms/modify_footer_address", {
            state: { type: "Create", filters: { page, size, filters } },
          });
        }}
        permissionData={permissons?.cms?.footer_address}
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
            handleListapi={GetListFooterAddress}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
