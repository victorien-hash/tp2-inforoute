import { configureStore } from "@reduxjs/toolkit";
import permisReducer from "./permisSlice";
import authReducer from "./authSlice";
import vieDemocratiqueReducer from "./vieDemocratiqueSlice";
import registreGesReducer from "./registreGesSlice";
import interventionPompierReducer from "./interventionPompierSlice";
import bonTravailReducer from "./bonTravailSlice";
import permisConstructionReducer from "./permisConstructionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    permis: permisReducer,
    vieDemocratique: vieDemocratiqueReducer,
    registreGes: registreGesReducer,
    interventionPompier: interventionPompierReducer,
    bonTravail: bonTravailReducer,
    permisConstruction: permisConstructionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;