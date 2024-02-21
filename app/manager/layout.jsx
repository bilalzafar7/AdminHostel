"use client";
import ManagerHeader from "@/components/ManagerHeader";
import ManagerSidebar from "@/components/ManagerSidebar";
import React from "react";
import { useSelector } from "react-redux";
import NotFound from "../not-found";

export default function layout({ children }) {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      {/* {user?.role === 'manager' ?<div className="flex">
    <ManagerSidebar />
    <div className="w-full">
      <ManagerHeader />
      {children}
      </div>
  </div> : <NotFound /> } */}
      <div className="flex">
        <ManagerSidebar />
        <div className="w-full">
          <ManagerHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
