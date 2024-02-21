// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { use } from 'react';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;


// use

// const user = useSelector((state) => state.auth.user);
// const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
// const dispatch = useDispatch();

// const handleLogin = (userData) => {
//   // Assuming userData is the data you receive after a successful login API call
//   dispatch(setUser(userData));
// };

// const handleLogout = () => {
//   // Call this function to clear user data and authentication status
//   dispatch(clearUser());
// };