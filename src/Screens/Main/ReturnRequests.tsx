import classes from "./main.module.css";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetToken } from "../../Shared/StoreData";
import useLoaderHook from "../../Shared/UpdateLoader";
import {
  ConvertDatetime,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../Shared/Methods";
import {
  ChangeStatusReturnRequestService,
  ListReturnRequestService,
  UserDropdownService,
} from "../../Service/ApiMethods";
import { TableOptionsType } from "../../@Types/CommonComponentTypes";
import ScreenHeader from "../../Components/UIComponents/ScreenHeader";
import FiltersAccordion from "../../Components/UIComponents/FilterAccordion";
import CommonSelect from "../../Components/FormFields/CommonSelect";
import SubmitResetBlock from "../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../Components/UIComponents/GlobalTable";
import CommonPaginaion from "../../Components/UIComponents/CommonPagination";
import { ApprovalStatus, ReturnRequestStatus } from "../../Shared/Constants";
import GlobalModal from "../../Modals/GlobalModal";
import RewardRequestStatusModal from "../../Modals/ModifyModals/RewardRequestStatusModal";
import CommonDatetimePicker from "../../Components/FormFields/DataTimeBox";
import ConfirmationModal from "../../Modals/ConfirmationModal";
import { AccessPermissionObject } from "../../@Types/accesspermission";

export default function ReturnRequests() {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  const [showFilter, setshowFilter] = useState(false);
  const [changeStatus, setChangeStatus] = useState({
    show: false,
    return_request_id: null,
    approval_status: null,
    return_action: null,
    status_name: "",
  });

  const [statusModal, setStatusModal] = useState({
    request_id: 0,
    request_status: 0,
    show: false,
  });
  const [userList, setUserList] = useState([]);
  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const { items, page, size, total } = DataList;
  const { values, initialValues, setFieldValue, handleSubmit, resetForm } =
    useFormik({
      initialValues: {
        user_id: null,
        approval_status: null,
        from_date: null,
        to_date: null,
      },
      onSubmit(values) {
        setFilters(values);
        GetListReturnRequestList(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListReturnRequestList = (
    page = 1,
    size = 10,
    values?: { user_id: number | null }
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      return_type: 1,
      token: token,
    });
    ListReturnRequestService(page, size, finalObj)
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
  // Table Options
  const Options: TableOptionsType[] = [
    {
      lable: "S.No",
      render: (text, _, index) => getTableSNO(page, size, index),
      key: "sno",
    },
    {
      lable: "Date",
      render: (text) => (text ? ConvertDatetime(text, "DATE") : "-"),
      key: "created_at",
      className: classes.NameBox,
    },

    {
      lable: "Name",
      render: (text) => text ?? "-",
      key: "first_name",
      className: classes.NameBox,
    },
    {
      lable: "Email",
      render: (text) => text ?? "-",
      key: "email_id",
      className: classes.NameBox,
    },
    {
      lable: "Parcel Opened",
      render: (text) => (text === 1 ? "Opened" : "Not Opened"),
      key: "opened",
      className: classes.NameBox,
    },
    {
      lable: "Order No",
      render: (text, _, index) => text ?? "-",
      key: "order_no",
    },

    {
      lable: "Product",
      render: (text) => text,
      key: "product_name",
    },
    {
      lable: "Quantity",
      render: (text) => text,
      key: "quantity",
    },
    {
      lable: "Approval Status",
      key: "approval_status",
      render: (text, data) =>
        permissons?.return_request?.return_request_edit ? (
          text !== 1 ? (
            <span style={{ color: text === 2 ? "green" : "red" }}>
              {data.approval_status_name}
            </span>
          ) : (
            <CommonSelect
              placeholder="Change Order Status"
              value={text}
              optionName={data.approval_status}
              styles={{ width: "130px" }}
              options={ApprovalStatus}
              disabled={text !== 1}
              onChange={(value, opt) => {
                setChangeStatus({
                  show: true,
                  return_request_id: data?.id,
                  status_name: opt.label,
                  approval_status: value,
                  return_action: null,
                });
              }}
            />
          )
        ) : (
          data?.approval_status_name
        ),
    },
    {
      lable: "Return Action",
      key: "return_action",
      render: (text, data) =>
        permissons?.return_request?.return_action_edit ? (
          data?.approval_status === 2 ? (
            text === 2 ? (
              <span style={{ color: "green" }}>Refunded</span>
            ) : (
              <CommonSelect
                placeholder="Change Return Action"
                value={text}
                optionName={data.return_action}
                styles={{ width: "170px" }}
                options={ReturnRequestStatus}
                disabled={text === 2}
                onChange={(value, opt) => {
                  setChangeStatus({
                    show: true,
                    return_request_id: data?.id,
                    status_name: opt.label,

                    approval_status: null,
                    return_action: value,
                  });
                }}
              />
            )
          ) : (
            "-"
          )
        ) : (
          data?.return_action_name
        ),
    },
    {
      lable: "Reason",
      render: (text) => text,
      key: "return_reason_name",
    },
  ];

  const getUserDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    // formData.append("user_type", 5);
    formData.append("is_exeAndCus", 1);

    UserDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response?.data?.data?.map((ele: any) => ({
            label: `${ele?.first_name} (${ele?.email ?? ele?.phone})`,
            value: ele?.id,
          }));
          setUserList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token) {
      GetListReturnRequestList(page, size, values);
      getUserDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChangeStatus = () => {
    isLoading(true);
    let finalObj = {
      token,
      return_request_id: changeStatus?.return_request_id,
      approval_status: changeStatus?.approval_status,
      return_action: changeStatus?.return_action,
    };
    ChangeStatusReturnRequestService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.msg);
          GetListReturnRequestList();
          setChangeStatus({
            show: false,
            return_request_id: null,
            approval_status: null,
            return_action: null,
            status_name: "",
          });
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  const getConfirmationText = () => {
    return (
      <>
        Are you sure want to change this{" "}
        {changeStatus?.approval_status ? "Approval Status" : "Return Action"} as
        <span style={{ color: "crimson" }}> {changeStatus.status_name}</span>?
      </>
    );
  };

  return (
    <>
      {statusModal && (
        <GlobalModal
          size={500}
          title="Change Request Status"
          Visible={statusModal?.show}
          OnClose={() => {
            setStatusModal({ request_id: 0, request_status: 0, show: false });
          }}
        >
          <RewardRequestStatusModal
            request_id={statusModal?.request_id}
            request_status={statusModal?.request_status}
            OnClose={() => {
              setStatusModal({ request_id: 0, request_status: 0, show: false });
              GetListReturnRequestList(page, size, filters);
            }}
          />
        </GlobalModal>
      )}
      {changeStatus?.show && (
        <GlobalModal
          size={450}
          Visible={changeStatus?.show}
          OnClose={() => {
            setChangeStatus({
              show: false,
              return_request_id: null,
              approval_status: null,
              return_action: null,
              status_name: "",
            });
          }}
        >
          <ConfirmationModal
            type="confirmation"
            msg={getConfirmationText()}
            OkButton="Change"
            cancelButton="Cancel"
            onClickOkButton={() => {
              handleChangeStatus();
            }}
            onClickcancelButton={() => {
              setChangeStatus({
                show: false,
                return_request_id: null,
                approval_status: null,
                return_action: null,
                status_name: "",
              });
            }}
          />
        </GlobalModal>
      )}
      {/* Screen Header */}
      <ScreenHeader
        name={`Return Requests`}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
      />

      <div className={classes.bgContainer}>
        {/* Filters */}
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                lable="User"
                options={userList}
                placeholder="Select User"
                value={values.user_id}
                onChange={(data) => {
                  setFieldValue("user_id", data);
                }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                lable="Approval Status"
                options={ApprovalStatus}
                placeholder="Select Approval Status"
                value={values.approval_status}
                onChange={(data) => {
                  setFieldValue("approval_status", data);
                }}
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonDatetimePicker
                lable="From Date"
                placeholder="Enter From Date"
                value={values.from_date}
                onChange={(data) => {
                  setFieldValue(
                    "from_date",
                    data ? ConvertDatetime(data, "START") : null
                  );
                }}
                allowClear={true}
                fromtodate={true}
                endDate={values?.to_date}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonDatetimePicker
                lable="To Date"
                placeholder="Enter To Date"
                value={values.to_date}
                onChange={(data) => {
                  setFieldValue(
                    "to_date",
                    data ? ConvertDatetime(data, "END") : null
                  );
                }}
                allowClear={true}
                fromtodate={true}
                startDate={values?.from_date}
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

        {/* Table Container */}
        <div className={classes.tablecontainer}>
          <GlobalTable items={items} Options={Options} total={total} />
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetListReturnRequestList}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
