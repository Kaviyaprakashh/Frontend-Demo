import { Button, Layout, MenuProps } from "antd";
import SideBar from "./SideBar";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import classes from "./Header.module.css";

import Commondropdown from "../../Components/FormFields/CommonDropdown";
import { Images } from "../../Shared/ImageExport";
import GlobalModal from "../../Modals/GlobalModal";
import ConfirmationModal from "../../Modals/ConfirmationModal";
import {
  ClearStorageData,
  getCatchMsg,
  getUserData,
} from "../../Shared/Methods";
import CustomDrawer from "./CustomDrawer";
import ChangePasswordModal from "../../Modals/Settings/ChangePassword";
import CommonImageBox from "../../Components/FormFields/CommonImageBox";
import { UserLogOutService } from "../../Service/ApiMethods";
import { GetNotificationCount, GetToken } from "../../Shared/StoreData";
import toast from "react-hot-toast";
import useLoaderHook from "../../Shared/UpdateLoader";

const HeaderBar = () => {
  let navigate = useNavigate();
  const { isLoading } = useLoaderHook();

  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutmodal, setshowLogoutModal] = useState(false);
  const [ChangePassword, setChangePassword] = useState(false);
  const token = GetToken();
  const UserData = getUserData();
  let { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [errorImage, seterrorImage] = useState(false);
  const NotificationCount = GetNotificationCount();

  const SettingsItems: MenuProps["items"] = [
    {
      key: "3",
      label: "Change Password",
      onClick: () => {
        setChangePassword(true);
      },
      icon: (
        <CommonImageBox
          source={Images.CHANGE_PASSWORD_ICON}
          type="setting"
          alt="Change Password Icon"
        />
      ),
    },
    {
      key: "2",
      label: "Logout",
      onClick: () => {
        setshowLogoutModal(true);
      },
      icon: (
        <CommonImageBox
          source={Images.LOGOUT_SETTING_ICON}
          type="setting"
          alt="Logout Icon"
        />
      ),
    },
  ];
  const handleLogOut = () => {
    isLoading(true);
    let formData: any = new FormData();
    formData.append("token", token);
    UserLogOutService(formData)
      .then((response) => {
        if (response?.data?.status === 1) {
          ClearStorageData();
          navigate("/");
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => getCatchMsg(error))
      .finally(() => isLoading(false));
  };
  useEffect(() => {
    if (pathname) {
      setDrawerOpen?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Change Password Modal */}
      {ChangePassword && (
        <GlobalModal
          size={500}
          title="Change Password"
          Visible={ChangePassword}
          OnClose={() => setChangePassword(false)}
        >
          <ChangePasswordModal
            OnClose={() => setChangePassword(false)}
            id={getUserData()?.user_id}
          />
        </GlobalModal>
      )}
      {/* Logout Modal */}
      {showLogoutmodal && (
        <GlobalModal size={400} Visible={showLogoutmodal}>
          <ConfirmationModal
            type="logout"
            title="Sign Out?"
            msg="Do you really want to sign out now?"
            OkButton="Sign Out"
            cancelButton="Cancel"
            onClickcancelButton={() => {
              setshowLogoutModal(false);
            }}
            onClickOkButton={() => {
              handleLogOut();
            }}
          />
        </GlobalModal>
      )}

      <Layout style={{ minHeight: "100vh", background: " var(--COLOR_BG)" }}>
        <div className={`sideBar ${classes.SideBar}`}>
          <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <CustomDrawer collapsed={drawerOpen} setDrawerOpen={setDrawerOpen} />
        <Layout
          style={{
            marginLeft: collapsed ? "80px" : "250px",
            paddingLeft: "10px",
            background: "transparent",
          }}
          className={`${classes.responsiveLayout} ${
            !collapsed ? "contentanimationOut" : "contentanimationIn"
          }`}
        >
          <div className={classes.stickyTopHeader}>
            <div className={classes.topHeader}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed((pre) => !pre)}
                style={{
                  fontSize: "16px",
                }}
                className={classes.CollapeBtn}
              />
              <Button
                type="text"
                icon={
                  drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
                onClick={() => setDrawerOpen(true)}
                style={{
                  fontSize: "16px",
                }}
                className={classes.drawerBtn}
              />
              <div className={classes.userData}>
                <div className={classes.notificationContainer}>
                  <img
                    alt="profile"
                    src={Images.BellIcon}
                    style={{ width: "25px" }}
                    onClick={() => {
                      navigate("/notification");
                    }}
                  />
                  <div className={classes.notificationCount}>
                    <span>
                      {NotificationCount > 99 ? "99+" : NotificationCount || 0}
                    </span>
                  </div>
                </div>

                <Commondropdown items={SettingsItems}>
                  <div className={classes.userData}>
                    <img
                      alt="profile"
                      src={
                        errorImage
                          ? Images.PROFILE_ICON
                          : UserData?.img ?? Images.PROFILE_ICON
                      }
                      style={{ width: "30px" }}
                      onError={() => {
                        seterrorImage(true);
                      }}
                    />
                    <p>Hello! {UserData?.username ?? "User"}</p>
                  </div>
                </Commondropdown>
              </div>
            </div>
          </div>

          <div className={classes.maincontent}>
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </>
  );
};

export default HeaderBar;
