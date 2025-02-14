import { Col, Row } from "antd";
import { useFormik } from "formik";
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
  ChangeStatusReviewService,
  ListReviewService,
} from "../../../Service/ApiMethods";
import {
  CheckfiltersAvailable,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import { ShowBigContent } from "../../../Shared/Components";
import ViewReview from "../../../Modals/ViewModals/ViewReview";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Reviews() {
  const navigate = useNavigate();
  const token = GetToken();
  const [showFilter, setshowFilter] = useState(false);
  const { isLoading } = useLoaderHook();
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });
  const tableFilters = GetTableFilters();
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
      GetListReview(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  // List Homesales Product Service

  const GetListReview = (
    page = 1,
    size = 10,
    values?: HomepageProductsFilterProps
  ) => {
    isLoading(true);
    let finalObj = {
      ...values,
      token: token,
    };
    ListReviewService(page, size, ConvertJSONtoFormData(finalObj))
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

  // Status change api for home sales product
  const handleChangeReviewStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      review_id: id,
      status: status,
    };

    ChangeStatusReviewService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListReview(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
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
      lable: "Ratings",
      render: (text) => text,
      key: "ratings",
    },
    {
      lable: "content",
      render: (text) => ShowBigContent(text),
      key: "content",
      showTooltip: true,
    },

    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          disabled={!permissons?.masters?.review?.change_status ? true : false}
          onChange={() => {
            handleChangeReviewStatus(data.review_id, text === 1 ? 0 : 1);
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
            permissionData={permissons?.masters?.review}
            onClickViewIcon={() => {
              setViewModal({
                show: true,
                data: data,
              });
            }}
            onClickEditIcon={() => {
              navigate("/manage_masters/modify_review", {
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
                id: data.review_id,
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  useEffect(() => {
    if (token) {
      let finalFilters = tableFilters?.filters || values;
      GetListReview(
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
      {/* View Modal */}

      {viewModal.show && (
        <GlobalModal
          OnClose={() => {
            setViewModal({ show: false, data: null });
          }}
          title="View"
          Visible={viewModal.show}
          size={1000}
        >
          <ViewReview UpdateData={viewModal.data} />
        </GlobalModal>
      )}

      {/* delete modal */}
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name="Review"
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleChangeReviewStatus(deleteModal.id, -1);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name="Testimonials"
        permissionData={permissons?.masters?.review}
        OnClickAdd={() => {
          navigate("/manage_masters/modify_review", {
            state: { type: "Create", filters: { page, size, filters } },
          });
        }}
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
            handleListapi={GetListReview}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
