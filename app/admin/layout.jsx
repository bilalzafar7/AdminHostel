"use client";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";
import React from "react";
import NotFound from "../not-found";
import { useSelector } from "react-redux";

export default function AdminLayout({ children }) {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      {/* {user?.role === "admin" ? (
        <div className="flex">
          <AdminSidebar />
          <div className="w-full">
            <AdminHeader />
            {children}
          </div>
        </div>
      ) : (
        <NotFound />
      )} */}
       <div className="flex">
          <AdminSidebar />
          <div className="w-full">
            <AdminHeader />
            {children}
          </div>
        </div>
    </div>
  );
}
