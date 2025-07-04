import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
    addFeed: (state, action) => {
      state.feed = action.payload;
    },
    addConnections: (state, action) => {
      state.connections = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter(
        (request) => request._id !== action.payload
      );
    },
    resetStore: () => {
      return initialState;
    },
  },
});

export const {
  addUser,
  removeUser,
  addFeed,
  addConnections,
  setRequests,
  removeRequest,
  resetStore,
} = userSlice.actions;

export default userSlice.reducer;
