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

const AdminPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [citiesWithData, setCitiesWithData] = useState([]);

  const [cityData, setCityData] = useState({
    place: "",
    placeImage: "",
    properties: [],
    shortDescription: "",
  });

  useEffect(() => {
    const fetchCitiesWithData = async () => {
      const placesCollectionRef = collection(db, "places");

      try {
        const placesSnapshot = await getDocs(placesCollectionRef);

        const citiesData = [];

        // Iterate over each place document
        for (const placeDoc of placesSnapshot.docs) {
          const placeData = placeDoc.data();
          const properties = placeData.properties || [];

          const cityData = {
            city: placeData.place,
            shortDescription: placeData.shortDescription,
            propertiesLength: properties.length,
            hostels: [], // Array to store hostels for each city
          };

          // Iterate over each property within the place
          for (const property of properties) {
            const hostelData = {
              hostelName: property.name,
              rooms: property.rooms.length,
              price: property.newPrice,
              rating: property.rating// Array to store room numbers for each hostel
            };

            // Add hostel data to cityData.hostels
            cityData.hostels.push(hostelData);
          }

          citiesData.push(cityData);
        }

        // Save city data in state
        setCitiesWithData(citiesData);
      } catch (error) {
        console.error("Error fetching cities with data:", error);
      }
    };

    // Call the function to fetch cities with data
    fetchCitiesWithData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const placesCollectionRef = collection(db, "places");

      // Add a new auto-generated ID to the city data
      const newCityData = {
        ...cityData,
        id: "", // Let Firestore generate a new ID
      };

      // Add the new city data to the "places" collection
      await addDoc(placesCollectionRef, newCityData);

      // Reset the form after successful submission
      setCityData({
        place: "",
        placeImage: "",
        properties: [],
        shortDescription: "",
      });

      alert("City added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  const handleDeleteCity = async (cityId) => {
    try {
      // Assuming you have a "places" collection in your database
      const cityDocRef = doc(db, "places", cityId);

      // Delete the city document
      await deleteDoc(cityDocRef);

      // Fetch updated cities data
      await fetchCitiesWithData();
    } catch (error) {
      console.error("Error deleting city:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Hostel Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
    <thead className="text-blue-400">
      <tr>
        <th className="py-3 px-4 text-left">ID</th>
        <th className="py-3 px-4 text-left">City Name</th>
        <th className="py-3 px-4 text-left">Total Hostels</th>
        <th className="py-3 px-4 text-left">Hostel Name</th>
        <th className="py-3 px-4 text-left">Number of Rooms</th>
        <th className="py-3 px-4 text-left">Price</th>
        <th className="py-3 px-4 text-left">Rating</th>
      </tr>
    </thead>
    <tbody>
      {citiesWithData.map((cityData, index) => (
        <React.Fragment key={index}>
          <tr className="hover:bg-white hover:text-black border-b">
            <td className="py-3 px-4">{index + 1}</td>
            <td className="py-3 px-4">{cityData.city}</td>
            <td className="py-3 px-4">{cityData.hostels.length} hostels</td>
            {cityData.hostels.length > 0 ? (
              <>
                <td className="py-3 px-4">{cityData.hostels[0].hostelName}</td>
                <td className="py-3 px-4">{cityData.hostels[0].rooms}</td>
                <td className="py-3 px-4">{cityData.hostels[0].price}</td>
                <td className="py-3 px-4">{cityData.hostels[0].rating}</td>
              </>
            ) : (
              <td className="py-3 px-4">N/A</td>
            )}
          </tr>
          {cityData.hostels.length > 1 &&
            cityData.hostels.slice(1).map((hostel, hostelIndex) => (
              <tr key={`${index}-${hostelIndex}`} className="hover:bg-white hover:text-black border-b">
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4">{hostel.hostelName}</td>
                <td className="py-3 px-4">{hostel.rooms}</td>
                <td className="py-3 px-4">{hostel.price}</td>
                <td className="py-3 px-4">{hostel.rating}</td>
              </tr>
            ))}
        </React.Fragment>
      ))}
    </tbody>
  </table>
      </div>
    </div>
  );
};

export default AdminPanel;
