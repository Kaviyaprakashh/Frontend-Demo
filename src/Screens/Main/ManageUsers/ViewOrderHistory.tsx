import classes from "../main.module.css";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { OrderFiltersType } from "../../../@Types/FiltersTypes";
import { FilterReducetypes } from "../../../@Types/ComponentProps";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";

import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS, OrderTypeList } from "../../../Shared/Constants";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import { GetSecondaryFilters, GetToken } from "../../../Shared/StoreData";
import {
  ListOrderService,
  OrderStatusDropdownService,
} from "../../../Service/ApiMethods";
import {
  CheckfiltersAvailable,
  ConvertDatetime,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
  getUserHeaderName,
} from "../../../Shared/Methods";
import useLoaderHook from "../../../Shared/UpdateLoader";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import CommonDatetimePicker from "../../../Components/FormFields/DataTimeBox";
import CommonSelect from "../../../Components/FormFields/CommonSelect";

import { UpdateTableFilters } from "../../../Store/Rudux/Reducer/MainReducer";
import { useAppDispatch } from "../../../Store/Rudux/Config/Hooks";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function ViewOrderHistory() {
  const navigate = useNavigate();
  const token = GetToken();
  const { state, pathname } = useLocation();
  const { isLoading } = useLoaderHook();
  let dispatch = useAppDispatch();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const SecondaryFilters: FilterReducetypes = GetSecondaryFilters();
  const [showFilter, setshowFilter] = useState(false);
  const [DataList, setDataList] = useState({
    page: 1,
    size: 0,
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
      order_status_id: null,
      order_type: null,
    },
    onSubmit(values) {
      setFilters(values);
      GetListOrders(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  // List Orders Service

  const GetListOrders = (page = 1, size = 10, values?: OrderFiltersType) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      user_id: state?.id,
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
      lable: "Amount",
      render: (text) => text ?? "-",
      key: "total",
      className: classes.NameBox,
      showTooltip: true,
    },
    {
      lable: "Payment Status",
      render: (text) => text ?? "-",
      key: "payment_status_name",
      className: classes.NameBox,
    },

    {
      lable: "Order Status",
      render: (text, data) => text ?? "-",
      key: "order_status",
    },
    {
      lable: "Order From",
      render: (text) =>
        text ? OrderTypeList.find((ele) => ele.value === text)?.label : "-",
      key: "user_order_type",
      className: classes.NameBox,
    },
    {
      lable: "Action",
      render: (_, data) => {
        return (
          <TableActionBlock
            permissionData={
              //@ts-ignore
              permissons?.manage_user?.[getUserHeaderName(pathname)?.key]
                ?.order_history
            }
            onClickViewIcon={() => {
              navigate(`/view_order/${state?.prev_pathname}`, {
                state: {
                  history: true,
                  id: data?.id,
                  Secondaryfilters: { page, size, filters },
                  filters: state?.filters ?? null,
                },
              });
            }}
          />
        );
      },
      key: "",
    },
  ];

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

  useEffect(() => {
    if (token) {
      let finalFilters = SecondaryFilters?.filters || values;
      GetListOrders(
        SecondaryFilters?.page || 1,
        SecondaryFilters?.size || 10,
        finalFilters
      );

      setValues(finalFilters);
      setFilters(finalFilters);
      setshowFilter(CheckfiltersAvailable(finalFilters));
      getOrderStatusDropdown();
      if (state?.filters) {
        dispatch(UpdateTableFilters(state?.filters));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* Screen Header */}
      <ScreenHeader
        name={`Order History (${state?.UpdateData?.first_name})`}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
        onClickBackBtn={() => {
          navigate(-1);
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
                lable="Order Status"
                options={orderStatusList}
                placeholder="Select Order Status"
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
            handleListapi={GetListOrders}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
