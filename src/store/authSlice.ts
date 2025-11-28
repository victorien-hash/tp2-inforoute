import { createSlice} from "@reduxjs/toolkit";
import type {PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  token: string | null;
}

const initialState: AuthState = {
  user: (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: any; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      try {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch {}
    },
    updateProfileSuccess(state, action: PayloadAction<{ user: any }>) {
      state.user = action.payload.user;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch {}
    },
    logout(state) {
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}
    },
  },
});

export const { loginSuccess, updateProfileSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
