"use client";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
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
import { StarFilled } from "@ant-design/icons";





const AdminPanel = () => {
  const [ratingFilter, setRatingFilter] = useState('All'); 
  const { userId } = useUserId();
  const [hostelData, setHostelData] = useState({});
  const [ratingsData, setRatingsData] = useState([]);

  useEffect(() => {
    const fetchAllRatings = async () => {
      try {
        const placesCollectionRef = collection(db, 'places');
        const placesQuery = query(
          placesCollectionRef,
          where('properties', '!=', [])
        );

        const placesSnapshot = await getDocs(placesQuery);

        let fetchedRatings = [];

        for (const placeDoc of placesSnapshot.docs) {
          const properties = placeDoc.data().properties || [];

          for (const property of properties) {
            const hostelName = property.name;

            if (property.ratings) {
              // Assuming ratings is an array of objects with rating details
              for (const rating of property.ratings) {
                const userDocRef = doc(db, 'users', rating.userId);
                const userDoc = await getDoc(userDocRef);

                const ratingInfo = {
                  hostelName: hostelName,
                  rating: rating.rating,
                  comment: rating.comment,
                  userName: userDoc.exists()
                    ? `${userDoc.data().firstName} ${userDoc.data().lastName} `
                    : 'Unknown User',
                  email: userDoc.exists()
                    ? `${userDoc.data().email}`
                    : 'Unknown User',
                };

                fetchedRatings.push(ratingInfo);
              }
            }
          }
        }

        setRatingsData(fetchedRatings);
      } catch (error) {
        console.error('Error fetching ratings:', error.message);
      }
    };

    fetchAllRatings();
  }, [db]);

  const handleRatingFilterChange = (rating) => {
    setRatingFilter(rating);
  };


  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Ratings</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Hostel Name</th>
              <th className="py-3 px-4 text-left">User Name</th>
              <th className="py-3 px-4 text-left">User Email</th>
              <th className="py-3 px-4 text-left">Comment</th>
              <th className="py-3 px-4 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratingsData.map((hostel,index) => (
              <tr key={hostel.id} className="hover:bg-white hover:text-black">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{hostel.hostelName}</td>
                <td className="py-3 px-4">{hostel.userName}</td>
                <td className="py-3 px-4">{hostel.email}</td>
                <td className="py-3 px-4">{hostel.comment}</td>
                <td className="py-3 px-4">{hostel.rating}</td>
                
                <td className="py-3 px-4 flex gap-1">
                  {[...Array(Math.floor(hostel.rating))].map((_, index) => (
                    <FaStar key={index} className="text-yellow-500" />
                  ))}
                  {hostel.rating % 1 !== 0 && (
                    <FaStarHalfAlt className="text-yellow-500" />
                  )}
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

export default AdminPanel;
