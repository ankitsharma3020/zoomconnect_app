import { createSlice } from "@reduxjs/toolkit";
import { fetchPolicydetails } from "../Epicfiles/MainEpic";

const initialState = {
  data: [],        // Where we save the list of policies
  isLoading: false,
  error: null,
};

// --- 3. THE SLICE ---
const policydetailsSlice = createSlice({
  name: 'policydetails',
  initialState,
  reducers: {
    // Standard synchronous reducers can go here if needed (e.g., clearData)
    clearPolicydetailsData: (state) => {
      state.data = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading State
      .addCase(fetchPolicydetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle Success State (Save data)
      .addCase(fetchPolicydetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Save API response to state
      })
      // Handle Error State
      .addCase(fetchPolicydetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Save error message
      });
  },
});

export const { clearPolicydetailsData } = policydetailsSlice.actions;
export default policydetailsSlice.reducer;