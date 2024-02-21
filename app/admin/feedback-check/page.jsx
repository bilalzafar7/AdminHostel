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

const FeedbackTable = () => {
    const [feedbackData, setFeedbackData] = useState([]);
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            const feedbacksCollectionRef = collection(db, 'feedbacks');
            const feedbacksSnapshot = await getDocs(feedbacksCollectionRef);
    
            const feedbacksData = feedbacksSnapshot.docs.map((feedbackDoc) => {
              const feedback = feedbackDoc.data();
              return {
                feedback: feedback.text,
                userId: feedback.userId
              };
            });
    
            // Save feedbacks data in state
            setFeedbackData(feedbacksData);
          } catch (error) {
            console.error('Error fetching feedbacks:', error.message);
          }
        };
    
        fetchData();
      }, []); // Run this effect only once on component mount
  
    return (
        <div className="container mx-auto mt-8 p-8 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Feedback Table</h1>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">UserId</th>
              <th className="py-2 px-4 border-b text-left">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((feedback, index) => (
              <tr key={index} className={(index % 2 === 0) ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border-b">{feedback.userId}</td>
                <td className="py-2 px-4 border-b">{feedback.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default FeedbackTable;