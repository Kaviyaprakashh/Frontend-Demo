import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  CopyAccessPermission: null,
  UserAccessPermission: null,
};

const AccessReducer = createSlice({
  name: "AccessReducer",
  initialState: initialState,
  reducers: {
    UpdateCopyAccessPermission: (state, action) => {
      return {
        ...state,
        CopyAccessPermission: action.payload,
      };
    },
    UpdateUserAccessPermission: (state, action) => {
      return {
        ...state,
        UserAccessPermission: action.payload,
      };
    },
  },
});

export const { UpdateCopyAccessPermission, UpdateUserAccessPermission } =
  AccessReducer.actions;

export default AccessReducer.reducer;
