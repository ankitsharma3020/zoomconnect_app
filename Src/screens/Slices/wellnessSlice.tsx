import { createSlice } from "@reduxjs/toolkit";
import { fetchWellness } from "../Epicfiles/MainEpic";
const initialState = {
  data: null,      // CHANGED: wellness is usually an Object {}, not an Array []
  isLoading: false,
  error: null,
};
const wellnessSlice = createSlice({
  name: 'wellness',
  initialState,
  reducers: {
    // Helper to clear wellness on Logout
    clearwellnessData: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Loading
      .addCase(fetchWellness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 2. Success
      .addCase(fetchWellness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Save the User Object here
      })
      // 3. Error
      .addCase(fetchWellness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearwellnessData } = wellnessSlice.actions;
export default wellnessSlice.reducer;