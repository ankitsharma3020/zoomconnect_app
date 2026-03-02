import { createSlice } from "@reduxjs/toolkit";
import { fetchTicketChat } from "../Epicfiles/MainEpic";



const initialState = {
  data: [],        // Where we save the list of policies
  isLoading: false,
  error: null,
};

// --- 3. THE SLICE ---
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Standard synchronous reducers can go here if needed (e.g., clearData)
    clearChatData: (state) => {
      state.data = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading State
      .addCase(fetchTicketChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle Success State (Save data)
      .addCase(fetchTicketChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Save API response to state
      })
      // Handle Error State
      .addCase(fetchTicketChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Save error message
      });
  },
});

export const { clearChatData } = chatSlice.actions;
export default chatSlice.reducer;