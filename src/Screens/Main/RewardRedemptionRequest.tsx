import classes from "./main.module.css";
import { Col, Row } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import toast from "react-hot-toast";
import { GetToken } from "../../Shared/StoreData";
import useLoaderHook from "../../Shared/UpdateLoader";
import { useAppDispatch } from "../../Store/Rudux/Config/Hooks";
import {
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
} from "../../Shared/Methods";
import {
  ListRedemptionRequestService,
  UserDropdownService,
} from "../../Service/ApiMethods";
import { TableOptionsType } from "../../@Types/CommonComponentTypes";
import { ShowBigContent } from "../../Shared/Components";
import { UpdateTableFilters } from "../../Store/Rudux/Reducer/MainReducer";
import ScreenHeader from "../../Components/UIComponents/ScreenHeader";
import FiltersAccordion from "../../Components/UIComponents/FilterAccordion";
import CommonSelect from "../../Components/FormFields/CommonSelect";
import SubmitResetBlock from "../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../Components/UIComponents/GlobalTable";
import CommonPaginaion from "../../Components/UIComponents/CommonPagination";
import { RedemptionRequestStatus } from "../../Shared/Constants";
import GlobalModal from "../../Modals/GlobalModal";
import RewardRequestStatusModal from "../../Modals/ModifyModals/RewardRequestStatusModal";
import TableActionBlock from "../../Components/UIComponents/TableActionBlock";
import { AccessPermissionObject } from "../../@Types/accesspermission";

export default function RewardRedemptionRequest() {
  const token = GetToken();
  const { isLoading } = useLoaderHook();
  const [showFilter, setshowFilter] = useState(false);
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
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
        request_status: null,
      },
      onSubmit(values) {
        setFilters(values);
        GetListRedemptionRequestList(1, size, values);
      },
    });
  const [filters, setFilters] = useState(initialValues);

  const GetListRedemptionRequestList = (
    page = 1,
    size = 10,
    values?: { user_id: number | null }
  ) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
    });
    ListRedemptionRequestService(page, size, finalObj)
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
      lable: "User",
      render: (text) => text ?? "-",
      key: "user_name",
      className: classes.NameBox,
    },
    {
      lable: "Points",
      render: (text) => text ?? "-",
      key: "points",
      className: classes.NameBox,
    },
    {
      lable: "Request Status",
      render: (text, obj) => (
        <p
          style={{
            color:
              obj?.request_status === 2
                ? "green"
                : obj?.request_status === 3
                ? "red"
                : "#3F51B5",
          }}
        >
          {text}
        </p>
      ),
      key: "request_status_name",
    },
    {
      lable: "Reason",
      render: (text) => ShowBigContent(text),
      key: "reason_name",
      showTooltip: true,
    },
    {
      lable: "Action",
      render: (_, obj) => {
        return (
          <TableActionBlock
            permissionData={permissons?.reward_redemption}
            onClickRewardIcon={
              obj?.request_status === 1
                ? () => {
                    setStatusModal({
                      request_id: obj?.request_id,
                      request_status: obj?.request_status,
                      show: true,
                    });
                  }
                : undefined
            }
          />
        );
      },
      key: "",
    },
  ];

  const getUserDropdown = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    formData.append("user_type", 4);

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
      GetListRedemptionRequestList(page, size, values);
      getUserDropdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
              GetListRedemptionRequestList(page, size, filters);
            }}
          />
        </GlobalModal>
      )}
      {/* Screen Header */}
      <ScreenHeader
        name={`Reward Redemption Requests`}
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
                lable="Request Status"
                options={RedemptionRequestStatus}
                placeholder="Select Request Status"
                value={values.request_status}
                onChange={(data) => {
                  setFieldValue("request_status", data);
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
            handleListapi={GetListRedemptionRequestList}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
