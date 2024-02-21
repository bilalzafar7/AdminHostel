'use client'
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaLock } from "react-icons/fa";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useUserId } from "../../../UserIdContext";
import {  EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth, db } from "../../../utils/firbase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Form, FormControl, Button } from "react-bootstrap";
import {
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const schema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup.string().required("New Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const UpdatePasswordPage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    try {
      // Reauthenticate the user with their current password before changing it
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Change the password
      await updatePassword(user, newPassword);

      window.alert("Password Updated")
      console.log('Password updated successfully!');
      // Optionally, redirect the user or perform other actions after a successful password update
    } catch (error) {
      console.error('Error updating password:', error.message);
    }
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
                  name="oldPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Old Password"
                      className={`w-full py-2 border-b focus:outline-none focus:border-blue-500 ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-400"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <AiTwotoneEyeInvisible fontSize={20} /> : <AiTwotoneEye fontSize={20} />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
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
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Go back to{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
