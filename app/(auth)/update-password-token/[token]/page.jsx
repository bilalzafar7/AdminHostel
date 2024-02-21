'use client'
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaLock } from "react-icons/fa";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";

const schema = yup.object().shape({
  newPassword: yup.string().required("New Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const UpdatePasswordPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle update password logic here
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Update Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block text-sm text-gray-600 mr-3">
                <FaLock />
              </label>
              <div className="relative w-full">
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      className={`w-full py-2 border-b focus:outline-none focus:border-blue-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <AiTwotoneEyeInvisible fontSize={20} /> : <AiTwotoneEye fontSize={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block text-sm text-gray-600 mr-3">
                <FaLock />
              </label>
              <div className="relative w-full">
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`w-full py-2 border-b focus:outline-none focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiTwotoneEyeInvisible fontSize={20} /> : <AiTwotoneEye fontSize={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
