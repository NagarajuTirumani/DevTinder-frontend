import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state, action) => {
      state.user = null;
    },
    addFeed: (state, action) => {
      state.feed = action.payload;
    },
  },
});

export const { addUser, removeUser, addFeed } = userSlice.actions;

export default userSlice.reducer;
