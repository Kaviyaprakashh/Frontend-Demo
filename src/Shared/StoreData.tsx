import { useAppSelector } from "../Store/Rudux/Config/Hooks";

export const GetToken = () => {
  return useAppSelector((state) => state.main.UserToken);
};

export const GetLoader = () => {
  return useAppSelector((state) => state.auth.Loader);
};

export const GetTableFilters = () => {
  return useAppSelector((state) => state.main.TableFilters);
};

export const GetSecondaryFilters = () => {
  return useAppSelector((state) => state.main.SecondaryFilters);
};

export const GetCopyAccessPermission = () => {
  return useAppSelector((state) => state.accesspermission.CopyAccessPermission);
};

export const GetAccessPermission = () => {
  return useAppSelector((state) => state.accesspermission.UserAccessPermission);
};

export const GetNotificationCount = () => {
  return useAppSelector((state) => state.main.NotificationCount);
};
