'use client'
import LoadMoreButton from '@/components/LoadMoreButton';
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

const AdminPanel = () => {
  const [places, setPlaces] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchAllComplaints = async () => {
      try {
        const complaintsCollectionRef = collection(db, 'complaints');
        const complaintsSnapshot = await getDocs(complaintsCollectionRef);

        const complaintsData = complaintsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComplaints(complaintsData);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchAllComplaints();
  }, [db]);

 
  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const placesCollectionRef = collection(db, 'places');
        const placesSnapshot = await getDocs(placesCollectionRef);

        const placesData = placesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlaces(placesData);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchAllPlaces();
  }, [db]); 

  const handleResolveComplaint = (complaintId) => {
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return { ...complaint, resolved: true };
      }
      return complaint;
    });
    setComplaints(updatedComplaints);
  };

  return (
    <div className="container mx-auto p-8">
      
      <h1 className="text-4xl font-bold mb-8 text-center">Complaint Management</h1>
      <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
        <thead className="text-blue-400">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">City</th>
            <th className="py-3 px-4 text-left">Hostel Name</th>
            <th className="py-3 px-4 text-left">Resolved</th>
            <th className="py-3 px-4 text-left">Content</th>
            <th className="py-3 px-4 text-left">Hostel Name</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint,index) => {
            // Find the corresponding place data for the complaint
            const place = places.find(place => place.place === complaint.city);
            
            // Assuming properties is an array inside each place
            const property = place?.properties.find(property => property.id === complaint.hostelId);

            // Extract the hostel name
            const hostelName = property?.name || 'Unknown Hostel';

            return (
              <tr key={complaint.id}>
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{complaint.city}</td>
                <td className="py-3 px-4">{hostelName}</td>
                <td className={`py-3 px-4 ${complaint.resolve === 'yes'? 'text-green-500' : 'text-red-500'}`}>
                  {complaint.resolve === 'yes' ? 'Yes' : 'No'}
                </td>
                <td className="py-3 px-4">{complaint.text}</td>
                <td className="py-3 px-4">{hostelName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <LoadMoreButton />
    </div>
  );
};

export default AdminPanel;
