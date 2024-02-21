"use client";
import LoadMoreButton from "@/components/LoadMoreButton";
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
const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "user1@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "user2@example.com",
    role: "Manager",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "user3@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 4,
    name: "Bob Wilson",
    email: "user4@example.com",
    role: "Manager",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "user5@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 6,
    name: "David Lee",
    email: "user6@example.com",
    role: "Manager",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Emma Davis",
    email: "user7@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 8,
    name: "Frank Miller",
    email: "user8@example.com",
    role: "Manager",
    status: "Inactive",
  },
  {
    id: 9,
    name: "Grace Wilson",
    email: "user9@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 10,
    name: "Henry Johnson",
    email: "user10@example.com",
    role: "Manager",
    status: "Inactive",
  },
  {
    id: 11,
    name: "Isabella Taylor",
    email: "user11@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 12,
    name: "Jack Smith",
    email: "user12@example.com",
    role: "Manager",
    status: "Inactive",
  },
];

const Page = () => {
  const [users, setUsers] = useState(usersData);
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Active', 'Inactive'
  const [roleFilter, setRoleFilter] = useState("All"); // 'All', 'User', 'Admin', 'Manager'
  const [allManagers, setAllManagers] = useState([]);

  const handleStatusChange = (userId, newStatus) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, status: newStatus };
      }
      return user;
    });
    setUsers(updatedUsers);
  };
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (statusFilter !== "All" && user.status !== statusFilter) {
      return false;
    }
    if (roleFilter !== "All" && user.role !== roleFilter) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const fetchAllManagers = async () => {
      try {
        const managersCollectionRef = collection(db, "managers");
        const managersSnapshot = await getDocs(managersCollectionRef);

        const managersData = [];

        managersSnapshot.forEach((doc) => {
          const manager = doc.data();
          if (manager.role === "manager") {
            managersData.push({ id: doc.id, ...manager });
          }
        });

        setAllManagers(managersData);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchAllManagers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const managersCollectionRef = collection(db, "managers");
      const managerDocRef = doc(managersCollectionRef, userId);

      // Update the role in Firebase
      await updateDoc(managerDocRef, {
        role: newRole,
      });

      // Update the local state
      setAllManagers((prevManagers) =>
        prevManagers.map((manager) =>
          manager.id === userId ? { ...manager, role: newRole } : manager
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Manager Management
      </h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white  border rounded-lg overflow-hidden">
          <thead className=" text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">City</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {allManagers.map((user, index) => (
              <tr key={user.id} className="hover:bg-white hover:text-black">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.phoneNumber}</td>
                <td className="py-3 px-4">{user.city}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-black"
                  >
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LoadMoreButton />
    </div>
  );
};

export default Page;
