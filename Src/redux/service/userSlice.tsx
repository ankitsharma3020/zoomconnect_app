import { createSlice } from "@reduxjs/toolkit";
// import { tokenMiddleware } from "./apiSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: false,
  
    // token: null,
  },
  reducers: {
    setUser: (state, action) => {
      console.log("Actiooon",action.payload)
      state.user = action.payload;
      // state.token = action.payload.token;
    },

    logout: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
})

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer