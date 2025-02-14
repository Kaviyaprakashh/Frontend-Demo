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
  getTableSNO,
} from "../../Shared/Methods";
import {
  NotificationListService,
  UserDropdownService,
} from "../../Service/ApiMethods";
import { TableOptionsType } from "../../@Types/CommonComponentTypes";
import ScreenHeader from "../../Components/UIComponents/ScreenHeader";
import FiltersAccordion from "../../Components/UIComponents/FilterAccordion";
import CommonSelect from "../../Components/FormFields/CommonSelect";
import SubmitResetBlock from "../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../Components/UIComponents/GlobalTable";
import CommonPaginaion from "../../Components/UIComponents/CommonPagination";
import CommonDatetimePicker from "../../Components/FormFields/DataTimeBox";

export default function NotificationList() {
  const token = GetToken();
  const { isLoading } = useLoaderHook();

  const [showFilter, setshowFilter] = useState(false);

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
        GetListNotification(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListNotification = (
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
    NotificationListService(page, size, finalObj)
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
      lable: "Executive",
      render: (text) => text ?? "-",
      key: "creator_name",
      className: classes.NameBox,
    },
    {
      lable: "User",
      render: (text) => text ?? "-",
      key: "user_name",
      className: classes.NameBox,
    },
    {
      lable: "Order No",
      render: (text) => text ?? "-",
      key: "order_no",
      className: classes.NameBox,
    },

    {
      lable: "Amount",
      render: (text) => text || "-",
      key: "paid_amount",
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
      GetListNotification(page, size, values);
      getUserDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* Screen Header */}
      <ScreenHeader
        name={`Notifications`}
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
            handleListapi={GetListNotification}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
