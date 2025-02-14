import classes from "../main.module.css";
import ScreenHeader from "../../../Components/UIComponents/ScreenHeader";
import { Col, Row } from "antd";
import CommonInput from "../../../Components/FormFields/CommonInput";
import { INPUT_LENGTHS } from "../../../Shared/Constants";
import { useFormik } from "formik";
import { CategoryFiltersType } from "../../../@Types/FiltersTypes";
import SubmitResetBlock from "../../../Components/UIComponents/SubmitResetBlock";
import GlobalTable from "../../../Components/UIComponents/GlobalTable";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { GetTableFilters, GetToken } from "../../../Shared/StoreData";
import {
  ChangeUserStatusService,
  DeleteUserService,
  ListUserService,
} from "../../../Service/ApiMethods";
import {
  CheckfiltersAvailable,
  ConvertJSONtoFormData,
  getCatchMsg,
  getPermissionData,
  getTableSNO,
  getUserData,
  getUserHeaderName,
} from "../../../Shared/Methods";
import toast from "react-hot-toast";
import useLoaderHook from "../../../Shared/UpdateLoader";
import { TableOptionsType } from "../../../@Types/CommonComponentTypes";
import CommonPaginaion from "../../../Components/UIComponents/CommonPagination";
import FiltersAccordion from "../../../Components/UIComponents/FilterAccordion";
import CommonSwitchbutton from "../../../Components/FormFields/CommonSwitch";
import GlobalModal from "../../../Modals/GlobalModal";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import ChangePasswordModal from "../../../Modals/Settings/ChangePassword";
import TableActionBlock from "../../../Components/UIComponents/TableActionBlock";
import { ShowBigContent } from "../../../Shared/Components";
import ChangeDesignationModal from "../../../Modals/ModifyModals/ChangeDesignationModal";
import { AccessPermissionObject } from "../../../@Types/accesspermission";

export default function User() {
  const navigate = useNavigate();
  const token = GetToken();
  const userData: any = getUserData();
  const { pathname } = useLocation();
  const [showFilter, setshowFilter] = useState(false);
  const { isLoading } = useLoaderHook();
  const tableFilters = GetTableFilters();
  const permissons: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  const [ChangePassword, setChangePassword] = useState({ show: false, id: 0 });
  const [deleteModal, setShowDeleteModal] = useState({ show: false, id: 0 });

  const [designationModal, setDesignationModal] = useState({
    show: false,
    user_id: null,
  });

  const [DataList, setDataList] = useState({
    page: 1,
    size: 10,
    items: [],
    total: 0,
  });
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
      name: "",
    },
    onSubmit(values) {
      setFilters(values);
      GetListUser(1, size, values);
    },
  });
  const [filters, setFilters] = useState(initialValues);

  const GetListUser = (page = 1, size = 10, values?: CategoryFiltersType) => {
    isLoading(true);
    let finalObj = ConvertJSONtoFormData({
      ...values,
      token: token,
      user_type: getUserHeaderName(pathname).userType,
    });
    ListUserService(page, size, finalObj)
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
      lable: "Username",
      render: (text) => text ?? "-",
      key: "username",
      className: classes.NameBox,
    },
    {
      lable: "First Name",
      render: (text) => text ?? "-",
      key: "first_name",
      className: classes.NameBox,
    },

    {
      lable: "Last Name",
      render: (text) => text ?? "-",
      key: "last_name",
      className: classes.NameBox,
    },

    {
      lable: "Contact",
      render: (text) => text ?? "-",
      key: "phone",
      className: classes.NameBox,
    },

    {
      lable: "Email",
      render: (text) => ShowBigContent(text),
      key: "email",
      showTooltip: true,
    },
    {
      lable: "Reward Points",
      render: (text) => text ?? "-",
      key: "reward_points",
    },
    {
      lable: "Status",
      render: (text, data) => (
        <CommonSwitchbutton
          checked={text === 1 ? true : false}
          disabled={
            //@ts-ignore
            !permissons?.manage_user?.[getUserHeaderName(pathname)?.key]
              ?.change_status
              ? true
              : false
          }
          onChange={() => {
            handleChangeUserStatus(data.id, text === 1 ? 0 : 1);
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
            permissionData={
              //@ts-ignore
              permissons?.manage_user?.[getUserHeaderName(pathname).key]
            }
            onClickSiteVisitIcon={
              getUserHeaderName(pathname).userType === 3
                ? () => {
                    navigate("/manage_users/site_visit", {
                      state: { user_id: data?.id },
                    });
                  }
                : false
            }
            onPressFollowUps={
              getUserHeaderName(pathname).userType === 3
                ? () => {
                    navigate("/manage_users/followups", {
                      state: { user_id: data?.id },
                    });
                  }
                : false
            }
            onClickViewIcon={() => {
              navigate(
                `/manage_users/view_${getUserHeaderName(pathname).pathname}`,
                {
                  state: {
                    id: data.id,
                    usertype: getUserHeaderName(pathname).userType,
                    filters: { page, size, filters },
                  },
                }
              );
            }}
            onClickPasswordIcon={() => {
              setChangePassword({
                show: true,
                id: data.id,
              });
            }}
            onClickEditIcon={() => {
              navigate(
                `/manage_users/modify_${getUserHeaderName(pathname).pathname}`,
                {
                  state: {
                    type: "Update",
                    UpdateData: data,
                    usertype: getUserHeaderName(pathname).userType,
                    filters: { page, size, filters },
                  },
                }
              );
            }}
            onClickDesignationIcon={
              getUserHeaderName(pathname).userType !== 5
                ? false
                : () => {
                    setDesignationModal({
                      show: true,
                      user_id: data.id,
                    });
                  }
            }
            onClickDeleteIcon={() => {
              setShowDeleteModal({
                show: true,
                id: data.id,
              });
            }}
            onClickHistroyIcon={
              getUserHeaderName(pathname).userType !== 2
                ? () => {
                    navigate(
                      `/manage_users/orderhistory_${
                        getUserHeaderName(pathname).pathname
                      }`,
                      {
                        state: {
                          id: data.id,
                          prev_pathname: getUserHeaderName(pathname).pathname,
                          UpdateData: data,
                          filters: { page, size, filters },
                        },
                      }
                    );
                  }
                : false
            }
            onClickPoinHistoryIcon={
              getUserHeaderName(pathname).userType === 4 ||
              getUserHeaderName(pathname).userType === 5
                ? () => {
                    navigate(
                      `/manage_users/point_history_${
                        getUserHeaderName(pathname).pathname
                      }`,
                      {
                        state: {
                          id: data.id,
                          UpdateData: data,
                          filters: { page, size, filters },
                        },
                      }
                    );
                  }
                : false
            }
            onClickPermissionIcon={
              getUserHeaderName(pathname).userType === 2 &&
              userData?.user_type === 1
                ? () => {
                    navigate(
                      `/manage_users/accesspermission_${
                        getUserHeaderName(pathname).pathname
                      }`,
                      {
                        state: {
                          type: "Update",
                          id: data.id,
                          UpdateData: data,
                          filters: { page, size, filters },
                        },
                      }
                    );
                  }
                : false
            }
          />
        );
      },
      key: "",
    },
  ];

  const handleChangeUserStatus = (id: number, status: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      user_id: id,
      status: status,
    };

    ChangeUserStatusService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListUser(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  const handleDeleteUser = (id: number) => {
    isLoading(true);
    let finalObj = {
      token: token,
      user_id: id,
    };

    DeleteUserService(ConvertJSONtoFormData(finalObj))
      .then((response) => {
        if (response.data.status === 1) {
          toast.success(response.data.msg);
          GetListUser(page, size, filters);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };

  useEffect(() => {
    if (token && pathname) {
      // resetForm();
      // setshowFilter(false);
      // handleSubmit();
      let finalFilters = tableFilters?.filters || initialValues;

      GetListUser(
        tableFilters?.page || 1,
        tableFilters?.size || 10,
        finalFilters
      );
      setFilters(finalFilters);
      setValues(finalFilters);
      setshowFilter(CheckfiltersAvailable(finalFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, pathname]);

  return (
    <>
      {ChangePassword.show && (
        <GlobalModal
          Visible={true}
          size={600}
          title="Change Password"
          OnClose={() => {
            setChangePassword({ show: false, id: 0 });
          }}
        >
          <ChangePasswordModal
            OnClose={() => {
              setChangePassword({ show: false, id: 0 });
            }}
            handleSuccess={() => {
              GetListUser(page, size, filters);
            }}
            id={ChangePassword.id}
            isUser={true}
          />
        </GlobalModal>
      )}

      {designationModal.show && (
        <GlobalModal
          OnClose={() => {
            setDesignationModal({ show: false, user_id: null });
          }}
          size={500}
          Visible={designationModal.show}
          title="Change Designation"
        >
          <ChangeDesignationModal
            OnClose={() => setDesignationModal({ show: false, user_id: null })}
            handleSuccess={() => {
              GetListUser(page, size, filters);
            }}
            UpdateData={designationModal.user_id}
          />
        </GlobalModal>
      )}
      {deleteModal.show && (
        <GlobalModal size={400} Visible={deleteModal.show}>
          <ConfirmationModal
            OkButton="Delete"
            cancelButton="Cancel"
            title="Delete"
            name={getUserHeaderName(pathname).title}
            onClickcancelButton={() => {
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
            onClickOkButton={() => {
              handleDeleteUser(deleteModal.id);
              setShowDeleteModal({
                show: false,
                id: 0,
              });
            }}
          />
        </GlobalModal>
      )}
      <ScreenHeader
        name={getUserHeaderName(pathname).title || ""}
        permissionData={
          //@ts-ignore
          permissons?.manage_user?.[getUserHeaderName(pathname)?.key]
        }
        OnClickAdd={() => {
          navigate(
            `/manage_users/modify_${getUserHeaderName(pathname).pathname}`,
            {
              state: {
                type: "Create",
                usertype: getUserHeaderName(pathname).userType,
                filters: { page, size, filters },
              },
            }
          );
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
                lable="Name"
                maxLength={INPUT_LENGTHS.Name}
                placeholder="Enter Name"
                value={values.name}
                onChange={(data) => {
                  setFieldValue("name", data);
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
          <GlobalTable
            items={items}
            Options={
              getUserHeaderName(pathname).userType === 4
                ? Options.filter((ele) => ele.key !== "username")
                : getUserHeaderName(pathname).userType === 5 ||
                  getUserHeaderName(pathname).userType === 3
                ? Options.filter(
                    (ele) =>
                      ele.key !== "reward_points" && ele.key !== "username"
                  )
                : getUserHeaderName(pathname).userType === 2
                ? Options.filter((ele) => ele.key !== "reward_points")
                : Options
            }
            total={total}
          />
          <CommonPaginaion
            DataList={DataList}
            handleListapi={GetListUser}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
