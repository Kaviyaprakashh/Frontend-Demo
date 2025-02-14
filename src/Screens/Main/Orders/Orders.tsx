import classes from "../main.module.css";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import { OrderFiltersType } from "../../../@Types/FiltersTypes";
import { FilterReducetypes } from "../../../@Types/ComponentProps";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import {
  INPUT_LENGTHS,
  OrderTypeList,
  PaymentStatusOptions,
  ReturnRequestStatus,
} from "../../../Shared/Constants";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangePaymentStatusService,
  ChangeStatusOrderService,
  ChangeStatusReturnRequestService,
  ListOrderService,
  OrderStatusDropdownService,
  UserDropdownService,
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
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import CommonDatetimePicker from "../../../Components/FormFields/DataTimeBox";
import CommonSelect from "../../../Components/FormFields/CommonSelect";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import GlobalModal from "../../../Modals/GlobalModal";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function Orders() {
  const navigate = useNavigate();
  const token = GetToken();
  const { pathname } = useLocation();
  const { isLoading } = useLoaderHook();
  const TableFilters: FilterReducetypes = GetTableFilters();
  const [userList, setUserList] = useState([]);
  const [showFilter, setshowFilter] = useState(false);
  const { status_id } = useParams();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [changeStatus, setChangeStatus] = useState({
    show: false,
    return_request_id: null,
    return_action: null,
    status_name: "",
  });
  const [StatusConfirmation, setStatusconfirmation] = useState({
    order_id: 0,
    order_status_id: 0,
    show: false,
    status: "",
    current: "",
  });
  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
  const [orderStatusList, setOrderstatusList] = useState([]);
  const { items, page, size, total } = DataList;
  const {
    values,
    setValues,
    initialValues,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      order_no: "",
      from_date: "",
      to_date: "",
      user_id: null,
      order_status_id:
        status_id && status_id !== "all" ? parseInt(status_id) : null,
      order_type: null,
    },
    onSubmit(values) {
      setFilters(values);
      GetListOrders(1, 10, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  // List Orders Service

  const GetListOrders = (page = 1, size = 10, values?: OrderFiltersType) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListOrderService(page, size, finalObj)
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
      lable: "Order No",
      render: (text) => text ?? "-",
      key: "order_no",
      className: classes.NameBox,
    },
    {
      lable: "Name",
      render: (text) => text ?? "-",
      key: "first_name",
      className: classes.NameBox,
    },
    {
      lable: "Executive Name",
      render: (text) => text ?? "-",
      key: "created_by_name",
      className: classes.NameBox,
    },
    {
      lable: "Invoice No",
      render: (text) => text ?? "-",
      key: "invoice_no",
      className: classes.NameBox,
    },

    {
      lable: "Awb No",
      render: (text) => text ?? "-",
      key: "awbno",
      className: classes.NameBox,
      showTooltip: true,
    },

    {
      lable: "Amount ( ₹ )",
      render: (text) => text ?? "-",
      key: "total",
      className: classes.NameBox,
    },
    {
      lable: "Payment Type",
      render: (text, data) => text ?? "-",
      key: "payment_type_name",
      className: classes.NameBox,
    },
    {
      lable: "Payment Status",
      render: (text, data) =>
        text ? (
          data?.payment_type === 1 || data?.payment_status === 1 ? (
            text
          ) : (
            <CommonSelect
              placeholder="Payment Status"
              options={PaymentStatusOptions}
              value={data?.payment_status}
              onChange={(value) => {
                handleChangePaymentStatus(value, data?.id);
              }}
            />
          )
        ) : (
          "-"
        ),
      key: "payment_status_name",
      className: classes.NameBox,
    },

    {
      lable: "Order Status",
      render: (text, data) => (
        <>
          {permissons?.orders?.change_status &&
          !handleDisableOrderStatus(text) ? (
            <CommonSelect
              placeholder="Change Order Status"
              value={text}
              disabled={handleDisableOrderStatus(text)}
              optionName={data.order_status}
              styles={{ width: "130px" }}
              options={orderStatusList}
              onChange={(value, opt) => {
                setStatusconfirmation({
                  show: true,
                  order_id: data?.id,
                  order_status_id: value,
                  status: data?.order_status,
                  current: opt.label,
                });
              }}
            />
          ) : (
            <span style={{ color: data?.colour_code || "#fff" }}>
              {data?.order_status}
            </span>
          )}
        </>
      ),
      key: "order_status_id",
    },
    {
      lable: "Cancel Status",

      render: (text, data) =>
        permissons?.orders?.return_action_edit &&
        data?.payment_status === 1 &&
        data?.order_status_id === 4 &&
        text !== 2 ? (
          <CommonSelect
            placeholder="Change Cancel Status"
            value={text}
            optionName={data.return_action_name}
            styles={{ width: "130px" }}
            options={ReturnRequestStatus}
            onChange={(value, opt) => {
              setChangeStatus({
                show: true,
                return_request_id: data?.cancel_req_id,
                status_name: opt.label,
                return_action: value,
              });
            }}
          />
        ) : (
          <span style={{ color: text === 2 ? "green" : "black" }}>
            {data?.return_action_name}
          </span>
        ),
      key: "return_action",
    },
    {
      lable: "Order From",
      render: (text) => (text == 1 || text == 4 ? "Web" : "App"),
      key: "device_flag",
      className: classes.NameBox,
    },
    {
      lable: "Action",
      render: (_, data) => {
        return (
          <TableActionBlock
            permissionData={permissons?.orders}
            onClickViewIcon={() => {
              navigate(`/view_orders/${status_id}`, {
                state: {
                  id: data?.id,
                  filters: { page, size, filters },
                },
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

  const handleChangePaymentStatus = (
    payment_status: number,
    orderId: number
  ) => {
    isLoading(true);
    let finalObj = { token, payment_status, orderId };
    ChangePaymentStatusService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.msg);
          GetListOrders(1, 10, filters);
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => {
        isLoading(false);
      });
  };

  const handleChangeStatus = () => {
    isLoading(true);
    let finalObj = {
      token,
      return_request_id: changeStatus?.return_request_id,
      return_action: changeStatus?.return_action,
    };
    ChangeStatusReturnRequestService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response?.data?.status === 1) {
          toast.success(response?.data?.msg);
          GetListOrders(1, 10, filters);
          setChangeStatus({
            show: false,
            return_request_id: null,

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
  const HandleChangeOrderStatus = (
    order_id: number,
    order_status_id: number
  ) => {
    isLoading(true);
    let finalObj = {
      token,
      order_status_id,
      order_id,
    };
    ChangeStatusOrderService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          GetListOrders(page, size, filters);
          setStatusconfirmation({
            show: false,
            order_id: 0,
            order_status_id: 0,
            status: "",
            current: "",
          });
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  const getOrderStatusDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    OrderStatusDropdownService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let finalList = response?.data?.data?.map((ele: any) => ({
            label: ele?.name,
            value: ele?.id,
          }));
          setOrderstatusList(finalList);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  const getUserDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
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
      let finalFilters = TableFilters?.filters ?? initialValues;
      finalFilters = {
        ...finalFilters,
        order_status_id:
          status_id && status_id !== "all" ? parseInt(status_id) : null,
      };

      GetListOrders(
        TableFilters?.page || 1,
        TableFilters?.size || 10,
        finalFilters
      );
      setValues(finalFilters);
      setFilters(finalFilters);
      setshowFilter(CheckfiltersAvailable(finalFilters));
      getOrderStatusDropdown();
      getUserDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, pathname]);

  const handleDisableOrderStatus = (status_id: number) => {
    if (
      status_id === 3 ||
      status_id === 4
      // status_id === 5 ||
      // status_id === 6
    ) {
      return true;
    } else return false;
  };

  return (
    <>
      {changeStatus?.show && (
        <GlobalModal
          size={450}
          Visible={changeStatus?.show}
          OnClose={() => {
            setChangeStatus({
              show: false,
              return_request_id: null,
              return_action: null,
              status_name: "",
            });
          }}
        >
          <ConfirmationModal
            type="confirmation"
            msg={
              <>
                Are you sure want to change this Return Action as
                <span style={{ color: "crimson" }}>
                  {changeStatus.status_name}
                </span>
                ?
              </>
            }
            OkButton="Change"
            cancelButton="Cancel"
            onClickOkButton={() => {
              handleChangeStatus();
            }}
            onClickcancelButton={() => {
              setChangeStatus({
                show: false,
                return_request_id: null,
                return_action: null,
                status_name: "",
              });
            }}
          />
        </GlobalModal>
      )}
      {StatusConfirmation.show && (
        <GlobalModal Visible={StatusConfirmation.show} size={400}>
          <ConfirmationModal
            OkButton="Change"
            cancelButton="Cancel"
            msg={
              <>
                Are you sure want to change this Orders Status&nbsp;
                <span style={{ color: "crimson" }}>
                  {StatusConfirmation.status}
                </span>
                &nbsp;to&nbsp;
                <span style={{ color: "green" }}>
                  {StatusConfirmation.current}
                </span>
                ?
              </>
            }
            onClickOkButton={() => {
              HandleChangeOrderStatus(
                StatusConfirmation?.order_id,
                StatusConfirmation?.order_status_id
              );
            }}
            type="confirmation"
            onClickcancelButton={() => {
              setStatusconfirmation({
                show: false,
                order_id: 0,
                order_status_id: 0,
                status: "",
                current: "",
              });
            }}
          />
        </GlobalModal>
      )}
      {/* Screen Header */}
      <ScreenHeader
        name={`Orders`}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
      />

      <div className={classes.bgContainer}>
        {/* Filters */}
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonInput
                lable="Order No"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Order No"
                value={values.order_no}
                onChange={(data) => {
                  setFieldValue("order_no", data);
                }}
                handleSubmit={handleSubmit}
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
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                lable="Name"
                options={userList}
                placeholder="Select Name"
                value={values.user_id}
                onChange={(data) => {
                  setFieldValue("user_id", data);
                }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                lable="Order Status"
                options={orderStatusList}
                placeholder="Select Order Status"
                disabled={status_id !== "all" ? true : false}
                value={values.order_status_id}
                onChange={(data) => {
                  setFieldValue("order_status_id", data);
                }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <CommonSelect
                lable="Order Type"
                options={OrderTypeList}
                placeholder="Select Order Type"
                value={values.order_type}
                onChange={(data) => {
                  setFieldValue("order_type", data);
                }}
                allowClear
              />
            </Col>
            <Col>
              <SubmitResetBlock
                handleClickReset={() => {
                  let finalObj = {
                    ...initialValues,
                    order_status_id:
                      status_id && status_id !== "all"
                        ? parseInt(status_id)
                        : null,
                  };
                  setValues(finalObj);
                  setFilters(finalObj);
                  GetListOrders(1, 10, finalObj);
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
            handleListapi={GetListOrders}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
