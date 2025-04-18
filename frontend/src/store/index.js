// store/index.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userId: null,
    role: null, // "user" sau "admin"
    token: null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
      state.role = null;
      state.token = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});