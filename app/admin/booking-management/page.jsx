"use client"
import StackedLineChart from '@/graphs/StackLineChart'
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
  Timestamp
} from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Page() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const reservationsCollectionRef = collection(db, 'reservations');
      const reservationsQuery = query(
        reservationsCollectionRef,
        where('timestamp', '>=', fromDate ? Timestamp.fromDate(new Date(fromDate)) : null),
        where('timestamp', '<=', toDate ? Timestamp.fromDate(new Date(toDate)) : null)
      );

      const reservationsSnapshot = await getDocs(reservationsQuery);

      const data = [];

      reservationsSnapshot.forEach((doc) => {
        const reservationData = doc.data();
        const timestamp = reservationData.timestamp.toDate();
        data.push({ name: timestamp.toLocaleDateString(), price: reservationData.price });
      });

      setChartData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, db]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleFilterByDate = () => {
    fetchData();
  };

  return (
    <div className='bg-gray-900 m-5 rounded-lg p-5'>
      <div>
        <h1 className='text-4xl text-white mb-5 font-semibold'>Bookings</h1>
        <div className="flex mb-4">
          <label className="text-white mr-2">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="border border-gray-300 rounded px-2 py-1 text-black"
          />
          <label className="text-white ml-4 mr-2">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="border border-gray-300 rounded px-2 py-1 text-black"
          />
          <button onClick={handleFilterByDate} className="bg-blue-500 text-white px-3 py-1 rounded ml-4">
            Filter by Date
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={400}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#E8AA33" />
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
}
