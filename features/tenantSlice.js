import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTenant } = tenantSlice.actions;

export default tenantSlice.reducer;
