'use client'
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaUser, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { useUserId } from "../../../UserIdContext";
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
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ProfilePage = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const { userId } = useUserId();
  const [managerData, setManagerData] = useState(null);

  const onSubmit = async (data) => {
    try {
      const managerDocRef = doc(db, 'managers', managerData.userId); // Assuming you have an 'id' property in managerData
      await updateDoc(managerDocRef, {
        name: data.name,
        email: data.email,
      });
      console.log('Manager data updated successfully!');
      // Optionally, update the local state after a successful update
      setManagerData({
        ...managerData,
        name: data.name,
        email: data.email,
      });
      window.alert("Profile Updated")
    } catch (error) {
      console.error('Error updating manager data:', error.message);
    }
  };

  useEffect(() => {
    const fetchManagerData = async (userID) => {
      try {
        const managersQuery = query(
          collection(db, 'managers'),
          where('userId', '==', userID)
        );
        const managersSnapshot = await getDocs(managersQuery);

        if (!managersSnapshot.empty) {
          const managerDoc = managersSnapshot.docs[0];
          const managerData = managerDoc.data();
          setManagerData(managerData);
          console.log('Manager data:', managerData);
          
        } else {
          console.log('No matching manager found for userID:', userID);
        }
      } catch (error) {
        console.error('Error fetching manager data:', error.message);
      }
    };

    // Assuming userId is a state variable
    fetchManagerData(userId);
  }, [userId]); 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Update Profile
        </h2>
        {managerData && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <label className="block text-sm text-gray-600 mr-3">
                  <FaUser />
                </label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={managerData.name} // Set default value from managerData
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Name"
                      className={`w-full py-2 border-b focus:outline-none focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <label className="block text-sm text-gray-600 mr-3">
                  <FaEnvelope />
                </label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={managerData.email} // Set default value from managerData
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Email"
                      className={`w-full py-2 border-b focus:outline-none focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Update Profile
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Want to change your password?{" "}
            <Link href="/update-password" className="text-blue-500 hover:underline">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
