"use client";
import store from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import { UserIdProvider } from "../UserIdContext";  // Import UserIdProvider

export default function CustomProvider({ children }) {
  return (
    <Provider store={store}>
      <UserIdProvider>
        {children}
      </UserIdProvider>
    </Provider>
  );
}
