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
      // Declare placesCollectionRef within the function
      const placesCollectionRef = collection(db, "places");

      try {
        const placesSnapshot = await getDocs(placesCollectionRef);

        // Map over the documents and extract city names with their arrays
        const citiesData = placesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            city: data.place,
            shortDescription: data.shortDescription,
            propertiesLength: (data.properties || []).length,
          };
        });

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
      const cityDocRef = doc(db, 'places', cityId);
  
      // Delete the city document
      await deleteDoc(cityDocRef);
  
      // Fetch updated cities data
      await fetchCitiesWithData();
    } catch (error) {
      console.error('Error deleting city:', error.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">City Management</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add City
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">City Name</th>
              <th className="py-3 px-4 text-left">Total Hostels</th>
              <th className="py-3 px-4 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {citiesWithData.map((city, index) => (
              <tr key={city.id} className="hover:bg-white hover:text-black">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{city.city}</td>
                <td className="py-3 px-6">{city.propertiesLength} hostels</td>
                <td className="py-3 px-6">{city.shortDescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-container bg-white w-80 p-6 rounded shadow-lg z-50">
            <h2 className="text-2xl font-bold mb-4 text-center">Add City</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter city name"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={cityData.place}
                onChange={(e) =>
                  setCityData({ ...cityData, place: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter city image URL"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={cityData.placeImage}
                onChange={(e) =>
                  setCityData({ ...cityData, placeImage: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Enter short description"
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={cityData.shortDescription}
                onChange={(e) =>
                  setCityData({ ...cityData, shortDescription: e.target.value })
                }
              ></textarea>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
              onClick={handleSubmit}
            >
              Add City
            </button>
            <button
              className="text-sm text-gray-600 mt-3 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
