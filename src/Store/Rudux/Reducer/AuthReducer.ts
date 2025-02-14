import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Loader: false,
};

const { actions, reducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    UpdateLoader: (state, action) => {
      return {
        ...state,
        Loader: action.payload,
      };
    },
  },
});

export const { UpdateLoader } = actions;
export default reducer;
