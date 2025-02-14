import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  UserToken: null,

  TableFilters: {
    page: 1,
    size: 0,
    filters: null,
  },
  SecondaryFilters: {
    page: 1,
    size: 0,
    filters: null,
  },
  NotificationCount: 0,
};

const { actions, reducer } = createSlice({
  name: "main",
  initialState,
  reducers: {
    UpdateUserToken: (state, action) => {
      return {
        ...state,
        UserToken: action.payload,
      };
    },

    UpdateTableFilters: (state, action) => {
      return {
        ...state,
        TableFilters: action.payload,
      };
    },
    UpdateSecondaryFilters: (state, action) => {
      return {
        ...state,
        SecondaryFilters: action.payload,
      };
    },
    UpdateNotificationCount: (state, action) => {
      return {
        ...state,
        NotificationCount: action.payload,
      };
    },
  },
});

export const {
  UpdateUserToken,
  UpdateTableFilters,
  UpdateSecondaryFilters,
  UpdateNotificationCount,
} = actions;
export default reducer;
