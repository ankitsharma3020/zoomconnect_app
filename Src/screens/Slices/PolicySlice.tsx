import { createSlice } from "@reduxjs/toolkit";
import { fetchPolicies } from "../Epicfiles/MainEpic";

const initialState = {
  data: [],        // Where we save the list of policies
  isLoading: false,
  error: null,
};

// --- 3. THE SLICE ---
const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    // Standard synchronous reducers can go here if needed (e.g., clearData)
    clearPolicyData: (state) => {
      state.data = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading State
      .addCase(fetchPolicies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle Success State (Save data)
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Save API response to state
      })
      // Handle Error State
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Save error message
      });
  },
});

export const { clearPolicyData } = policySlice.actions;
export default policySlice.reducer;