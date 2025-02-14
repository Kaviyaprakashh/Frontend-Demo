import { useEffect } from "react";
import {
  getCatchMsg,
  getPermissionData,
  getUserToken,
} from "../Shared/Methods";
import { useAppDispatch } from "../Store/Rudux/Config/Hooks";
import {
  UpdateNotificationCount,
  UpdateUserToken,
} from "../Store/Rudux/Reducer/MainReducer";
import instance from "../Service/Axios";
import { removeSessionStorageData } from "../Store/Storage";
import {
  UpdateCopyAccessPermission,
  UpdateUserAccessPermission,
} from "../Store/Rudux/Reducer/AccessReducer";
import { ViewProfileService } from "../Service/ApiMethods";
import toast from "react-hot-toast";

export default function Instance() {
  const LoginuserData = getUserToken();
  const dispatch = useAppDispatch();

  const getUserProfile = (token: string) => {
    let formData = new FormData();
    formData.append("token", token);
    ViewProfileService(formData)
      .then((response: any) => {
        if (response?.data?.status === 1) {
          dispatch(
            UpdateNotificationCount(response?.data?.data?.notification_count)
          );
        } else {
          toast.error(response?.data?.msg);
        }
      })
      .catch((error) => {
        getCatchMsg(error);
      });
  };
  useEffect(() => {
    if (LoginuserData) {
      let token = getUserToken();
      dispatch(UpdateUserToken(token));
      let copyPermission = getPermissionData("COPIED_PERMISSION");
      dispatch(UpdateCopyAccessPermission(copyPermission));
      let UserAccessPermission = getPermissionData("EM_USER_ACCESS_PERMISSION");
      dispatch(UpdateUserAccessPermission(UserAccessPermission));
      getUserProfile(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LoginuserData]);

  instance.interceptors.response.use(
    (response: any) => {
      if (response?.data?.status === -1) {
        removeSessionStorageData("EM_LOGIN_DATA");
        window.location.href = "/";
      } else {
        return response;
      }
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  return <></>;
}
