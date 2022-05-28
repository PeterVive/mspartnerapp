import { Contract } from "@microsoft/microsoft-graph-types-beta";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface tenantState {
  value: Contract | null;
}

const initialState = {
  value: null,
} as tenantState;

export const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<Contract | null>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTenant } = tenantSlice.actions;

export default tenantSlice.reducer;
