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
import { StarFilled } from "@ant-design/icons";

const Ratings = () => {
  const { userId } = useUserId();
  const [hostelData, setHostelData] = useState({});
  const [ratingsData, setRatingsData] = useState([]);

  useEffect(() => {
    const fetchRatingsByManagerId = async () => {
      try {
        const placesCollectionRef = collection(db, "places");
        const placesQuery = query(
          placesCollectionRef,
          where("properties", "!=", [])
        );

        const placesSnapshot = await getDocs(placesQuery);

        let fetchedRatings = [];
        let fetchedHostelData = {};

        for (const placeDoc of placesSnapshot.docs) {
          const properties = placeDoc.data().properties || [];

          for (const property of properties) {
            if (property.managerId === userId) {
              fetchedHostelData = {
                hostelId: property.id,
                // Add other relevant data if needed
              };

              if (property.ratings) {
                // Assuming ratings is an array of objects with rating details
                for (const rating of property.ratings) {
                  const userDocRef = doc(db, "users", rating.userId);
                  const userDoc = await getDoc(userDocRef);

                  const ratingInfo = {
                    comment: rating.comment,
                    rating: rating.rating,
                    userName: userDoc.exists()
                      ? `${userDoc.data().firstName} ${userDoc.data().lastName}`
                      : "Unknown User",
                  };
                  fetchedRatings.push(ratingInfo);
                }
              }
            }
          }
        }

        setRatingsData(fetchedRatings);
        setHostelData(fetchedHostelData);
      } catch (error) {
        console.error("Error fetching ratings:", error.message);
      }
    };

    fetchRatingsByManagerId();
  }, [userId]);

  return (
    <div className="container mx-auto p-8">
    <h1 className="text-4xl font-bold mb-8 text-center">Hostel Ratings</h1>
    <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
    <thead className="text-blue-400">
              <tr>
              <th className="py-3 px-4 text-left">Index</th>
              <th className="py-3 px-4 text-left">User Name</th>
                <th className="py-3 px-4 text-left">Comment</th>
                <th className="py-3 px-4 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratingsData.map((rating, index) => (
                <tr key={index} className="hover:bg-white hover:text-black">
                  <td className="py-2 px-6">{index + 1}</td>
                  <td className="py-2 px-5">{rating.userName}</td>
                  <td className="py-2 px-6">{rating.comment}</td>
                  <td className="py-2 px-2">
                    {Array.from({ length: rating.rating }, (_, i) => (
                      <StarFilled key={i} style={{ fontSize: '18px', color: '#FFD700', margin: '0 1px' }} />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default Ratings;
