import { createSlice } from "@reduxjs/toolkit";
import { fetchhospitalstate } from "../Epicfiles/MainEpic";

const initialState = {
  data: [],        // Where we save the list of policies
  isLoading: false,
  error: null,
};

// --- 3. THE SLICE ---
const hospitalstateSlice = createSlice({
  name: 'hospitalstate',
  initialState,
  reducers: {
    // Standard synchronous reducers can go here if needed (e.g., clearData)
    clearhospitalstateData: (state) => {
      state.data = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading State
      .addCase(fetchhospitalstate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle Success State (Save data)
      .addCase(fetchhospitalstate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Save API response to state
      })
      // Handle Error State
      .addCase(fetchhospitalstate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Save error message
      });
  },
});

export const { clearhospitalstateData } = hospitalstateSlice.actions;
export default hospitalstateSlice.reducer;