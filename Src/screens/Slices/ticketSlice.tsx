import { createSlice } from "@reduxjs/toolkit";
import { fetchtickets } from "../Epicfiles/MainEpic";


const initialState = {
  data: [],        // Where we save the list of policies
  isLoading: false,
  error: null,
};

// --- 3. THE SLICE ---
const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // Standard synchronous reducers can go here if needed (e.g., clearData)
    clearTicketData: (state) => {
      state.data = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading State
      .addCase(fetchtickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle Success State (Save data)
      .addCase(fetchtickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Save API response to state
      })
      // Handle Error State
      .addCase(fetchtickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Save error message
      });
  },
});

export const { clearTicketData } = ticketSlice.actions;
export default ticketSlice.reducer;