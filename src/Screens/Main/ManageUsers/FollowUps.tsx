import classes from "./../main.module.css";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetToken } from "../../../Shared/StoreData";
import useLoaderHook from "../../../Shared/UpdateLoader";
import {
  ConvertDatetime,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../../Shared/Methods";
import {
  ChangeStatusReturnRequestService,
  ListFollowUpsService,
  ListReturnRequestService,
  ListSiteVisitRequestService,
  UserDropdownService,
} from "../../../Service/ApiMethods";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSelect from "../../../Components/FormFields/CommonSelect";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import {
  ApprovalStatus,
  ReturnRequestStatus,
  VisitorTypeOptions,
} from "../../../Shared/Constants";
import GlobalModal from "../../../Modals/GlobalModal";
import RewardRequestStatusModal from "../../../Modals/ModifyModals/RewardRequestStatusModal";
import CommonDatetimePicker from "../../../Components/FormFields/DataTimeBox";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import { AccessPermissionObject } from "../../../@Types/accesspermission";
import { useLocation, useNavigate } from "react-router";
import { ShowBigContent } from "../../../Shared/Components";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import ViewSiteVisitModal from "../../../Modals/ViewModals/ViewSiteVisitModal";

export default function FollowUps() {
  const token = GetToken();
  const { state } = useLocation();
  const { isLoading } = useLoaderHook();
  const navigation = useNavigate();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  const [viewModal, setViewModal] = useState({ data: null, show: false });

  const [showFilter, setshowFilter] = useState(false);

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
        GetListFollowUps(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListFollowUps = (
    page = 1,
    size = 10,
    values?: { user_id: number | null }
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      user_id: state?.user_id,
      token: token,
    });
    ListFollowUpsService(page, size, finalObj)
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
      key: "reminder_date",
      className: classes.NameBox,
    },

    {
      lable: "Notes",
      render: (text, data) => text ?? "-",
      key: "reminder_notes",
    },

    {
      lable: "Address",
      render: (text) => (text ? ShowBigContent(text) : "-"),
      key: "geolocation",
      className: classes.NameBox,

      showTooltip: true,
    },
  ];

  useEffect(() => {
    if (token) {
      GetListFollowUps(page, size, values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* Screen Header */}

      <ScreenHeader
        name={`Follow Ups`}
        OnClickFilter={() => {
          setshowFilter((pre) => !pre);
        }}
        onClickBackBtn={() => {
          navigation(-1);
        }}
      />

      <div className={classes.bgContainer}>
        {/* Filters */}
        <FiltersAccordion showFilter={showFilter}>
          <Row gutter={10} className={classes.filterContainer}>
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
            handleListapi={GetListFollowUps}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
