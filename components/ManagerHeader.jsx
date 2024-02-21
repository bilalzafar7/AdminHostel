"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import SearchKBD from "./search";

const ManagerHeader = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Handle search logic here
    console.log(data.search);
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <SearchKBD />
    </header>
  );
};

export default ManagerHeader;
