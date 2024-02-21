"use client";
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

const Complains = () => {
  const { userId } = useUserId();
  const [hostelData, setHostelData] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);

  const resolveComplaint = (complaintId) => {
    // Implement your logic to resolve the complaint
    // Update the state or make an API call, etc.
  };
  useEffect(() => {
    const fetchRoomsByManagerId = async () => {
      try {
        const placesCollectionRef = collection(db, "places");
        const placesQuery = query(
          placesCollectionRef,
          where("properties", "!=", [])
        );

        const placesSnapshot = await getDocs(placesQuery);

        let fetchedRooms = [];
        let fetchedHostelData = {};

        placesSnapshot.forEach((placeDoc) => {
          const properties = placeDoc.data().properties || [];

          properties.forEach((property) => {
            const propertyRooms = property.rooms || [];

            propertyRooms.forEach((room) => {
              if (property.managerId === userId) {
                const propertyId = property.id; // Assuming property.id is the hostelId
                const roomId = room.id;
                const roomData = { propertyId, ...room };
                fetchedRooms.push(roomData);

                // Extract and save single value hostel data
                fetchedHostelData = {
                  hostelId: property.id,
                  city: property.city, // Assuming property.city is the city
                  // Add other relevant data if needed
                };
              }
            });
          });
        });

        setHostelData(fetchedHostelData);
      } catch (error) {
        console.error("Error fetching:", error.message);
      }
    };

    fetchRoomsByManagerId();
  }, [userId]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsRef = collection(db, "complaints");
        const complaintsSnapshot = await getDocs(complaintsRef);

        if (!complaintsSnapshot.empty) {
          const complaintData = await Promise.all(
            complaintsSnapshot.docs.map(async (doc) => {
              const complaint = doc.data();

              // Check if the complaint matches the hostelId in hostelData
              if (complaint.hostelId === hostelData.hostelId) {
                const userRef = collection(db, "users");
                const userQuery = query(
                  userRef,
                  where("userId", "==", complaint.userId)
                );
                const userSnapshot = await getDocs(userQuery);
                const userData = userSnapshot.docs.map((userDoc) =>
                  userDoc.data()
                );

                // Assuming there's only one user with the given userId
                const user = userData.length > 0 ? userData[0] : null;

                return {
                  ...complaint,
                  userEmail: user ? user.email : "Unknown",
                  userName: user ? user.firstName : "Unknown", // Replace 'email' with the actual field in your user document
                };
              } else {
                return null; // Filter out complaints that do not match the hostelId
              }
            })
          );

          // Filter out null values (complaints that did not match the hostelId)
          const filteredComplaints = complaintData.filter(Boolean);

          setComplaints(filteredComplaints);
        } else {
          setComplaints([]);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, [hostelData.hostelId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        if (!usersSnapshot.empty) {
          const userData = usersSnapshot.docs.map((doc) => doc.data());
          setUsers(userData);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleResolveClick = async (complaintId) => {
    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, { resolve: "yes" });

      // Update the local state to reflect the resolved complaint
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, resolve: "yes" }
            : complaint
        )
      );
      window.alert("Status Updated");
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  const sortedComplaints = complaints.sort((a, b) => {
    // Put resolved complaints at the end
    if (a.resolve === "yes" && b.resolve !== "yes") {
      return 1;
    } else if (a.resolve !== "yes" && b.resolve === "yes") {
      return -1;
    } else {
      // For unresolved complaints or if both are resolved, maintain the existing order
      return 0;
    }
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Complaints Management</h1>
      <div>
        <h2 className="text-2xl mb-4">Complaints</h2>
        {sortedComplaints.map((complaint) => (
  <div
    key={complaint.complainId}
    className={`p-4 mb-4 rounded-lg shadow-md ${
      complaint.resolve === 'yes' ? 'bg-green-300' : 'bg-gray-200'
    }`}
  >
    <p className="text-lg mb-2 font-semibold text-indigo-800">Complain: {complaint.text}</p>
    <p className="text-gray-600">
      <strong>Room ID:</strong> {" "}{complaint.roomId}
    </p>
    <p className="text-gray-600">
      <strong>Resident Name:</strong> {" "}{complaint.userName}
    </p>
    <p className="text-gray-600">
      <strong>Resident Email:</strong> {complaint.userEmail}
    </p>
    <p className="text-gray-600">
      <strong>Complaint ID:</strong> {complaint.complainId}
    </p>
    <p className="text-gray-600">
      <strong>Resolve:</strong> {complaint.resolve}
    </p>
    <button
      onClick={() => handleResolveClick(complaint.complainId)}
      className={`py-2 px-4 rounded focus:outline-none mt-2 ${
        complaint.resolve === 'yes'
          ? 'bg-gray-500 cursor-not-allowed text-gray-300'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
      disabled={complaint.resolve === 'yes'}
    >
      {complaint.resolve === 'yes' ? 'Resolved' : 'Resolve'}
    </button>
  </div>
))}
      </div>
    </div>
  );
};

export default Complains;
