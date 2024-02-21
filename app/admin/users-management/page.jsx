'use client'
import LoadMoreButton from '@/components/LoadMoreButton';
import Link from 'next/link';
import React, { useState, useEffect } from "react";
import { useUserId } from "../../../UserIdContext";
import { auth, db } from "../../../utils/firbase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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


const Page = () => {
  const { userId } = useUserId();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        const usersData = [];

        usersSnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });

        setAllUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []); 

  const openPopup = (userId) => {
    setSelectedUserId(userId);
  };

  const closePopup = () => {
    setSelectedUserId(null);
  };
  
  const UserDetailsPopup = ({ user, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="modal-overlay fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
        <div className="modal-container bg-gray-800 text-white w-full md:w-96 p-6 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">User Details</h2>
            
          </div>
          <div className="flex items-center mb-4">
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-32 h-32 rounded-full mr-4"
            />
            <div>
              <p className="text-xl font-bold">{`${user.firstName} ${user.lastName}`}</p>
              <div className="text-gray-400">
                <p>
                  <span className="font-semibold">Name:</span> {`${user.firstName} ${user.lastName}`}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {user.phone}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span> {user.gender}
                </p>
              </div>
            </div>
          </div>
          <button
              className="text-sm text-gray-400 border border-gray-600 hover:bg-gray-700 py-2 px-4 rounded focus:outline-none"
              onClick={onClose}
            >
              Close
            </button>
        </div>
      </div>
    );
  };
  
  
  

  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Customer Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Contact Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
          {allUsers.map((user, index) => (
            <tr key={user.userId} className='hover:bg-white hover:text-black'>
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">{`${user.firstName} ${user.lastName}`}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.phone}</td>
              <td className="py-3 px-4">
                <button
                  className="bg-blue-500 ml-3 hover:bg-blue-600 text-white py-1 px-4 rounded"
                  onClick={() => openPopup(user.userId)}
                >
                  Show Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>

        {selectedUserId && (
        <UserDetailsPopup
          user={allUsers.find((user) => user.userId === selectedUserId)}
          onClose={closePopup}
        />
      )}

      </div>
      <LoadMoreButton />
    </div>
  );
};

export default Page;
