import { configureStore } from "@reduxjs/toolkit";
import tenantReducer from "../features/tenantSlice";

export const store = configureStore({
  reducer: {
    tenant: tenantReducer,
  },
});
