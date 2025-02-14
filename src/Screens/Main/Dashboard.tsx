import { Col, Row } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { GetToken } from "../../Shared/StoreData";
import ScreenHeader from "../../Components/UIComponents/ScreenHeader";
import {
  dashboardService,
  MonthwiseOrderService,
  MonthwiseOrderValueService,
} from "../../Service/ApiMethods";
import {
  CheckAllvalues,
  ConvertDatetime,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  StartEndDates,
} from "../../Shared/Methods";
import useLoaderHook from "../../Shared/UpdateLoader";
import classes from "./main.module.css";
import CommonAreaChart from "../../Components/Charts/CommonAreaChart";
import { Images } from "../../Shared/ImageExport";
import CommonDatetimePicker from "../../Components/FormFields/DataTimeBox";
import { UpdateTableFilters } from "../../Store/Rudux/Reducer/MainReducer";
import { useAppDispatch } from "../../Store/Rudux/Config/Hooks";
import { useFormik } from "formik";
import SubmitResetBlock from "../../Components/UIComponents/SubmitResetBlock";
import FiltersAccordion from "../../Components/UIComponents/FilterAccordion";
import CommonSelect from "../../Components/FormFields/CommonSelect";
import { DateOptions, PerMissionData } from "../../Shared/Constants";
import { AccessPermissionObject } from "../../@Types/accesspermission";

export default function Dashboard() {
  let navigate = useNavigate();
  const token = GetToken();
  let dispatch = useAppDispatch();
  const permission: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [showFilter, setshowFilter] = useState(false);
  const { isLoading } = useLoaderHook();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [OrderChart, setOrderChart] = useState([]);
  const [OrderValueChart, setOrderValueChart] = useState([]);
  const [orderYear, setOrderYear] = useState(
    ConvertDatetime(new Date(), "YEAR")
  );
  const [orderValueYear, setOrderValueYear] = useState(
    ConvertDatetime(new Date(), "YEAR")
  );

  const { values, initialValues, setValues, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        from_date: "",
        to_date: "",
        dateType: null,
      },
      onSubmit: (values) => {
        getViewDashBoardData(values);
      },
    });
  const getViewDashBoardData = (values: any) => {
    isLoading(true);
    let finalData = ConvertJSONtoFormData({
      token,
      ...values,
    });
    dashboardService(finalData)
      .then((response) => {
        if (response.data.status === 1) {
          setDashboardData(response.data?.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => {
        isLoading(false);
      });
  };

  // Order Chart
  const getMothwiseOrder = (year?: string) => {
    isLoading(true);
    let finalData = ConvertJSONtoFormData({
      token,
      year: year ?? orderYear,
    });
    MonthwiseOrderService(finalData)
      .then((response) => {
        if (response.data.status === 1) {
          setOrderChart(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => {
        isLoading(false);
      });
  };
  // Order Amount Chart
  const getMothwiseOrderValue = (year?: string) => {
    isLoading(true);
    let finalData = ConvertJSONtoFormData({
      token,
      year: year ?? orderValueYear,
    });
    MonthwiseOrderValueService(finalData)
      .then((response) => {
        if (response.data.status === 1) {
          setOrderValueChart(response.data.data);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((err) => getCatchMsg(err))
      .finally(() => {
        isLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      getViewDashBoardData(values);
      getMothwiseOrder();
      getMothwiseOrderValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <ScreenHeader
        name="Dashboard"
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
      />
      {!CheckAllvalues(permission?.dashboard) && (
        <>
          <FiltersAccordion showFilter={showFilter}>
            <Row
              gutter={[16, 16]}
              style={{ marginBottom: "10px" }}
              className={classes.filterContainer}
            >
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <CommonSelect
                  lable="Date"
                  options={DateOptions}
                  placeholder="Select Date"
                  value={values?.dateType}
                  onChange={(data, options) => {
                    if (data === 5 || !data) {
                      setValues((pre) => ({
                        ...pre,
                        from_date: "",
                        to_date: "",
                        dateType: data,
                      }));
                    } else {
                      let date: any = StartEndDates(options.dateType);
                      setValues((pre) => ({
                        ...pre,
                        from_date: date?.from_date,
                        to_date: date?.to_date,
                        dateType: data,
                      }));
                    }
                  }}
                />
              </Col>
              {values?.dateType === 5 && (
                <>
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
                </>
              )}
              <Col>
                <SubmitResetBlock
                  handleClickReset={() => {
                    let finalValues =
                      values?.dateType === 5
                        ? { ...values, from_date: "", to_date: "" }
                        : initialValues;
                    setValues(finalValues);
                    getViewDashBoardData(finalValues);
                  }}
                  handleClickSubmit={() => handleSubmit()}
                />
              </Col>
            </Row>
          </FiltersAccordion>

          <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
            {permission?.dashboard?.total_orders ? (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
                <div
                  className={classes.dashboardCard}
                  onClick={() => {
                    navigate("/orders/all");
                  }}
                >
                  <h3>Total Orders</h3>
                  <div>
                    <img src={Images.TotalOrders} alt="Total Orders" />
                    <p>{dashboardData?.totalOrders}</p>
                  </div>
                </div>
              </Col>
            ) : (
              ""
            )}
            {permission?.dashboard?.executive_orders ? (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
                <div
                  className={classes.dashboardCard}
                  onClick={() => {
                    dispatch(
                      UpdateTableFilters({
                        page: 1,
                        size: 10,
                        filters: {
                          order_type: 4,
                        },
                      })
                    );
                    navigate("/orders/all");
                  }}
                >
                  <h3>Executive Orders</h3>
                  <div>
                    <img src={Images.ExecutiveOrders} alt="Executive" />
                    <p>{dashboardData?.executiveOrders}</p>
                  </div>
                </div>
              </Col>
            ) : (
              ""
            )}
            {permission?.dashboard?.customer_orders ? (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
                <div
                  className={classes.dashboardCard}
                  onClick={() => {
                    dispatch(
                      UpdateTableFilters({
                        page: 1,
                        size: 10,
                        filters: {
                          order_type: 5,
                        },
                      })
                    );
                    navigate("/orders/all");
                  }}
                >
                  <h3>Customer Orders</h3>
                  <div>
                    <img src={Images.CustomerOrders} alt="Customer" />
                    <p>{dashboardData?.customerOrders}</p>
                  </div>
                </div>
              </Col>
            ) : (
              ""
            )}
            {permission?.dashboard?.app_orders ? (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
                <div
                  className={classes.dashboardCard}
                  onClick={() => {
                    dispatch(
                      UpdateTableFilters({
                        page: 1,
                        size: 10,
                        filters: {
                          order_type: 2,
                        },
                      })
                    );
                    navigate("/orders/all");
                  }}
                >
                  <h3>App Orders</h3>
                  <div>
                    <img src={Images.AppOrders} alt="App icon" />
                    <p>{dashboardData?.appOrders}</p>
                  </div>
                </div>
              </Col>
            ) : (
              ""
            )}
            {permission?.dashboard?.web_orders ? (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
                <div
                  className={classes.dashboardCard}
                  onClick={() => {
                    dispatch(
                      UpdateTableFilters({
                        page: 1,
                        size: 10,
                        filters: {
                          order_type: 1,
                        },
                      })
                    );
                    navigate("/orders/all");
                  }}
                >
                  <h3>Web Orders</h3>
                  <div>
                    <img src={Images.WebOrders} alt="Web" />
                    <p>{dashboardData?.webOrders}</p>
                  </div>
                </div>
              </Col>
            ) : (
              ""
            )}
            {permission?.dashboard?.total_customer ? (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
                <div
                  className={classes.dashboardCard}
                  onClick={() => {
                    navigate("/manage_users/customers");
                  }}
                >
                  <h3>Total Customer</h3>
                  <div>
                    <img src={Images.TotalCustomers} alt="User" />
                    <p>{dashboardData?.totalCustomers}</p>
                  </div>
                </div>
              </Col>
            ) : (
              ""
            )}
          </Row>
        </>
      )}
      {permission?.dashboard?.monthwise_order_value ||
      permission?.dashboard?.monthwise_order ? (
        <Row gutter={[16, 16]}>
          {permission?.dashboard?.monthwise_order ? (
            <Col xs={24} sm={24} md={24} lg={12}>
              <div className={classes.bgContainer}>
                <div className={classes.SubheaderBlock}>
                  <h3 className={classes.subHeader}>Month wise Order</h3>
                  <CommonDatetimePicker
                    placeholder="Select Year"
                    dateFormat="YYYY"
                    picker={"year"}
                    value={orderYear}
                    onChange={(date) => {
                      getMothwiseOrder(date);
                      setOrderYear(date);
                    }}
                    isFuture={true}
                  />
                </div>
                <CommonAreaChart
                  series={[
                    {
                      name: "Order",
                      data: OrderChart?.map((ele: any) => ele.total || 0),
                    },
                  ]}
                  ytitle="Order"
                  xtitle="Month"
                  color={["#c0c0c0"]}
                />
              </div>
            </Col>
          ) : (
            ""
          )}
          {permission?.dashboard?.monthwise_order_value ? (
            <Col xs={24} sm={24} md={24} lg={12}>
              <div className={classes.bgContainer}>
                <div className={classes.SubheaderBlock}>
                  <h3 className={classes.subHeader}>Month wise Order Value</h3>
                  <CommonDatetimePicker
                    placeholder="Select Year"
                    dateFormat="YYYY"
                    picker={"year"}
                    value={orderValueYear}
                    onChange={(date) => {
                      getMothwiseOrderValue(date);
                      setOrderValueYear(date);
                    }}
                    isFuture={true}
                  />
                </div>
                <CommonAreaChart
                  series={[
                    {
                      name: "Order Value",
                      data: OrderValueChart?.map(
                        (ele: any) => ele.orderValue || 0
                      ),
                    },
                  ]}
                  ytitle="Order Value"
                  xtitle="Month"
                  color={["#274375"]}
                />
              </div>
            </Col>
          ) : (
            ""
          )}
        </Row>
      ) : (
        ""
      )}
    </>
  );
}
