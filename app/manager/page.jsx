"use client";
import SameDataComposedChart from "@/graphs/SameDataComposedChart";
import SimpleBarChart from "@/graphs/SimpleBarChart";
import StackedAreaChart from "@/graphs/StackedAreaChart";
import { useEffect, useState } from "react";
import React from "react";
import { useUserId } from "../../UserIdContext";
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

export default function page() {
  const { userId } = useUserId();
  const [unresolvedComplaintsCount, setUnresolvedComplaintsCount] = useState(0);
  const [hostelData, setHostelData] = useState({});
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalReservationPrice, setTotalReservationPrice] = useState(0);
  const [reservationTimestamps, setReservationTimestamps] = useState([]);
  const [chartData, setChartData] = useState([]);

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

        // Calculate total number of rooms
        const totalRooms = fetchedRooms.length;
        setTotalRooms(totalRooms);

        // Fetch reservations for the hostel
        const reservationsCollectionRef = collection(db, "reservations");
        const reservationsQuery = query(
          reservationsCollectionRef,
          where("hostelId", "==", fetchedHostelData.hostelId)
        );

        const reservationsSnapshot = await getDocs(reservationsQuery);

        // Calculate total number of reservations and total reservation price
        let totalReservationsCount = 0;
        let totalPrice = 0;
        let timestampsData = [];

        reservationsSnapshot.forEach((reservationDoc) => {
          const reservationData = reservationDoc.data();
          totalReservationsCount++;
          totalPrice += reservationData.price || 0;
          timestampsData.push({
            name: new Date(
              reservationData.timestamp.toDate()
            ).toLocaleDateString(), // Convert timestamp to a readable format
            uv: reservationData.price || 0,
          });
        });

        timestampsData.sort((a, b) => a.name - b.name);
        setChartData(timestampsData);

        setTotalReservations(totalReservationsCount);
        setTotalReservationPrice(totalPrice);
      } catch (error) {
        console.error("Error fetching:", error.message);
      }
    };

    fetchRoomsByManagerId();
  }, [userId]);

  useEffect(() => {
    const fetchUnresolvedComplaintsCount = async () => {
      try {
        const complaintsCollectionRef = collection(db, "complaints"); // Replace 'complaints' with your actual collection name
        const unresolvedComplaintsQuery = query(
          complaintsCollectionRef,
          where("resolve", "==", "no")
        );
        const unresolvedComplaintsSnapshot = await getDocs(
          unresolvedComplaintsQuery
        );

        const count = unresolvedComplaintsSnapshot.size;
        setUnresolvedComplaintsCount(count);
      } catch (error) {
        console.error(
          "Error fetching unresolved complaints count:",
          error.message
        );
      }
    };

    fetchUnresolvedComplaintsCount();
  }, []);

  return (
    <div>
      <style>
        {`
    .dashboard-container {
      display: flex;
      margin: 30px; 
    }

    .dashboard-block {
      width: 270px; 
      height: 180px;
      margin-left: 20px; 
      border-radius: 4%; 
      overflow: hidden; 
    }
    .dashboard-block h3 {
      font-size: 1.5rem; 
      font-weight: bold; 
    }
  `}
      </style>

      <div className="dashboard-container">
        <div
          className="dashboard-block"
          style={{
            backgroundColor: "green",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#020617",
              }}
            >
              Total Bookings
            </h3>
            <p
              style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}
            >
              {totalReservations}
            </p>
          </div>
        </div>
        <div
          className="dashboard-block"
          style={{
            backgroundColor: "blue",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#020617",
              }}
            >
              Total Rooms
            </h3>
            <p
              style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}
            >
              {totalRooms}
            </p>
          </div>
        </div>

        <div
          className="dashboard-block"
          style={{
            backgroundColor: "purple",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#020617",
              }}
            >
              Total Revenue
            </h3>
            <p
              style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}
            >
              {totalReservationPrice} Pkr
            </p>
          </div>
        </div>

        <div
          className="dashboard-block"
          style={{
            backgroundColor: "orange",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#020617",
              }}
            >
              Complaints
            </h3>
            <p
              style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}
            >
              {unresolvedComplaintsCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 m-5 rounded-lg p-5">
        <h1 className="text-4xl text-white mb-5 font-semibold">Bookings</h1>
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
    </div>
  );
}
