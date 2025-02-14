import { Navigate, Outlet } from "react-router";
import { GetInitialMainRouteName } from "../Shared/PrivateRouteMethods";
import { getPermissionData, getUserData } from "../Shared/Methods";
import { AccessPermissionObject } from "../@Types/accesspermission";

export const AuthPrivateRouter = () => {
  const userData = getUserData();
  const permisson: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return userData && permisson ? (
    <Navigate
      to={
        userData?.user_type === 1
          ? "/dashboard"
          : GetInitialMainRouteName(permisson)
      }
    />
  ) : (
    <Outlet />
  );
};

export const MainPrivateRouter = () => {
  const userData = getUserData();
  const permisson: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return userData && permisson ? <Outlet /> : <Navigate to={"/"} />;
};

export const ProductMasterPrivateRouter = () => {
  const userData = getUserData();
  const permisson: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return userData && permisson?.product_masters?.product_master_menu ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export const MastersPrivateRouter = () => {
  const userData = getUserData();
  const permisson: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return userData && permisson?.masters?.masters_menu ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export const UsersPrivateRouter = () => {
  const userData = getUserData();
  const permisson: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );

  return userData && permisson?.manage_user?.user_menu ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export const CMSPrivateRouter = () => {
  const userData = getUserData();
  const permisson: AccessPermissionObject = getPermissionData(
    "EM_USER_ACCESS_PERMISSION"
  );
  return userData && permisson?.cms?.cms_menu ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
