import { configureStore } from "@reduxjs/toolkit";
import permisReducer from "./permisSlice";
import authReducer from "./authSlice";
import vieDemocratiqueReducer from "./vieDemocratiqueSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    permis: permisReducer,
    vieDemocratique: vieDemocratiqueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;