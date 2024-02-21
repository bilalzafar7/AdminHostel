'use client'
import SameDataComposedChart from '@/graphs/SameDataComposedChart'
import StackedAreaChart from '@/graphs/StackedAreaChart'
import React, { useState, useEffect } from "react";
import { auth, db } from "../../utils/firbase";
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
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AreaChart,
} from "recharts";


export default function page() {
  const [chartData, setChartData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [managerData, setManagerData] = useState([]);

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        const reservationsCollectionRef = collection(db, 'reservations');
        const reservationsSnapshot = await getDocs(reservationsCollectionRef);

        // Map over the documents and extract the relevant data
        const bookingsData = reservationsSnapshot.docs.map((doc) => {
          const data = doc.data();
          const date = new Date(data.timestamp.toMillis()).toLocaleDateString(); // Extract the date

          return {
            name: date,
            uv: 1, // You can customize this based on your data structure
          };
        });

        // Aggregate the bookings data by date
        const aggregatedData = bookingsData.reduce((accumulator, current) => {
          const existingItem = accumulator.find((item) => item.name === current.name);

          if (existingItem) {
            existingItem.uv += 1; // Increment the booking count for the same date
          } else {
            accumulator.push(current);
          }

          return accumulator;
        }, []);

        // Save aggregated data in state
        setChartData(aggregatedData);
      } catch (error) {
        console.error('Error fetching bookings data:', error);
      }
    };

    // Call the function to fetch bookings data
    fetchBookingsData();
  }, []);

   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const users = usersSnapshot.docs.map((doc) => doc.data());
        setUserData(users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchManagerData = async () => {
      try {
        const managersCollectionRef = collection(db, 'managers');
        const managersSnapshot = await getDocs(managersCollectionRef);
        const managers = managersSnapshot.docs.map((doc) => doc.data());
        setManagerData(managers);
      } catch (error) {
        console.error('Error fetching manager data:', error);
      }
    };

    fetchUserData();
    fetchManagerData();
  }, []);
  
  const totalUsers = userData.length;
  const totalManagers = managerData.length;

  // Create data array for the chart
  const chartDataa = [
    { name: 'Total Users', uv: totalUsers },
    { name: 'Total Managers', pv: totalManagers },
  ];

  return (
    <div>
      <div className='bg-gray-900 m-5 rounded-lg p-5'>
        <h1 className='text-4xl text-white mb-5 font-semibold'>Bookings</h1>
        <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="uv" barSize={20} fill="#E8AA33" />
        <Line type="monotone" dataKey="uv" stroke="#fff" />
      </ComposedChart>
    </ResponsiveContainer>
      </div>

      <div className='bg-gray-900 m-5 rounded-lg p-5'>
        <h1 className='text-4xl text-white mb-5 font-semibold'>User And Mangers</h1>
        <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        width={500}
        height={400}
        data={chartDataa}
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
        <Area type="monotone" dataKey="uv" stackId="1" fill="#E8AA33" />
        <Area type="monotone" dataKey="pv" stackId="1" fill="#E8AA99" />
      </AreaChart>
    </ResponsiveContainer>
      </div>
    </div>
  )
}
