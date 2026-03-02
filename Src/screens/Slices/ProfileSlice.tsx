import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile } from "../Epicfiles/MainEpic";
const initialState = {
  data: null,      // CHANGED: Profile is usually an Object {}, not an Array []
  isLoading: false,
  error: null,
};
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Helper to clear profile on Logout
    clearProfileData: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Loading
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 2. Success
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Save the User Object here
      })
      // 3. Error
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileData } = profileSlice.actions;
export default profileSlice.reducer;