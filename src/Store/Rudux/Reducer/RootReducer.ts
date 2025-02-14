import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";
import MainReducer from "./MainReducer";
import AccessReducer from "./AccessReducer";

export const RootReducer = combineReducers({
  auth: AuthReducer,
  main: MainReducer,
  accesspermission: AccessReducer,
});
