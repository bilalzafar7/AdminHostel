import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other slices here if you have more slices in your application
    // For example: counter: counterReducer,
  },
});

export default store;