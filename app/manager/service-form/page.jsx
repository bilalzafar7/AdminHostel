"use client";
import LoadMoreButton from "@/components/LoadMoreButton";
import React, { useEffect, useState } from "react";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ServiceManagementScreen = () => {
  const [managerCity, setManagerCity] = useState("");
  const [newService, setNewService] = useState("");
  const [services, setServices] = useState([]);
  const { userId } = useUserId();

  const [servicesArray, setServicesArray] = useState([]);

  useEffect(() => {
    const fetchManagerCity = async () => {
      try {
        // Reference to the manager document using the userId
        const managerDocRef = doc(db, "managers", userId);

        // Fetch the manager document
        const managerDocSnap = await getDoc(managerDocRef);

        if (managerDocSnap.exists()) {
          // Extract the city from the manager document
          const city = managerDocSnap.data().city;
          setManagerCity(city);
        } else {
          console.error("Manager document not found");
        }
      } catch (error) {
        console.error("Error fetching manager city:", error);
      }
    };

    // Call the function to fetch manager city when the component mounts
    fetchManagerCity();
  }, [userId]);

  useEffect(() => {
    // Ensure that managerCity is available before fetching hostels
    if (managerCity) {
      const fetchHostelArray = async () => {
        try {
          const placesCollectionRef = collection(db, "places");

          const placesQuery = query(
            placesCollectionRef,
            where("place", "==", managerCity)
          );

          const placesSnapshot = await getDocs(placesQuery);

          if (!placesSnapshot.empty) {
            const propertyDocRef = placesSnapshot.docs[0].ref;

            const targetProperty = placesSnapshot.docs[0]
              .data()
              .properties.find((property) => property.managerId === userId);

            if (targetProperty) {
              const fetchedHostelArray = targetProperty.services || [];
              setServices(fetchedHostelArray);
            } else {
              console.log("Hostel with matching managerId not found.");
            }
          } else {
            console.log("No places found for the given city.");
          }
        } catch (error) {
          console.error("Error fetching hostels:", error);
        }
      };

      // Call the fetchHostelArray function when managerCity is available
      fetchHostelArray();
    }
  }, [managerCity, userId]);
  // Empty dependency array ensures the effect runs only once on mount

  const addService = async () => {
    try {
      // Ensure that managerCity is available
      if (managerCity) {
        const placesCollectionRef = collection(db, "places");
        const placesQuery = query(
          placesCollectionRef,
          where("place", "==", managerCity)
        );
        const placesSnapshot = await getDocs(placesQuery);
  
        if (!placesSnapshot.empty) {
          const propertyDocRef = placesSnapshot.docs[0].ref;
  
          // Find the property with the matching managerId
          const targetProperty = placesSnapshot.docs[0]
            .data()
            .properties.find((property) => property.managerId === userId);
  
          if (targetProperty) {
            // Add new service to the array
            const updatedServicesArray = [...targetProperty.services, newService];
  
            // Update the services field in the target property directly
            await updateDoc(propertyDocRef, {
              properties: placesSnapshot.docs[0].data().properties.map((property) =>
                property.managerId === userId
                  ? { ...property, services: updatedServicesArray }
                  : property
              ),
            });
  
            // Update state with the new services array
            setServices(updatedServicesArray);
            window.alert("Facility added")
            // Clear the input field
            setNewService("");
          } else {
            console.log("Hostel with matching managerId not found.");
          }
        } else {
          console.log("No places found for the given city.");
        }
      }
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };
  
  const editService = (index) => {
    const updatedService = prompt("Edit Service:", services[index]);
    if (updatedService !== null) {
      const updatedServices = [...services];
      updatedServices[index] = updatedService;
      setServices(updatedServices);
    }
  };

  const deleteService = async (index) => {
    try {
      // Ensure that managerCity is available
      if (managerCity) {
        const placesCollectionRef = collection(db, "places");
        const placesQuery = query(
          placesCollectionRef,
          where("place", "==", managerCity)
        );
        const placesSnapshot = await getDocs(placesQuery);

        if (!placesSnapshot.empty) {
          const propertyDocRef = placesSnapshot.docs[0].ref;

          // Find the property with the matching managerId
          const targetProperty = placesSnapshot.docs[0]
            .data()
            .properties.find((property) => property.managerId === userId);

          if (targetProperty) {
            // Remove the service at the specified index
            const updatedServicesArray = [...targetProperty.services];
            updatedServicesArray.splice(index, 1);

            // Update the services field in the target property directly
            await updateDoc(propertyDocRef, {
              properties: placesSnapshot.docs[0]
                .data()
                .properties.map((property, idx) =>
                  idx === 0
                    ? { ...property, services: updatedServicesArray }
                    : property
                ),
            });

            // Update state with the new services array
            setServices(updatedServicesArray);
            window.alert("Facility deleted")
          } else {
            console.log("Hostel with matching managerId not found.");
          }
        } else {
          console.log("No places found for the given city.");
        }
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "20px",
          color: "black",
          fontWeight: "bold",
        }}
      >
        Service Management
      </h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Add new service"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "60%",
            fontSize: "16px",
            borderRadius: "6px", // Use 'px' for specifying border radius
            border: "3px solid #ccc", // Add border styling
          }}
        />
        <button
          onClick={addService}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Add Service
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {services.map((service, index) => (
          <li
            key={index}
            style={{
              marginBottom: "15px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f4f4f4",
            }}
          >
            <span style={{ fontSize: "18px" }}>{service}</span>
            <div>
              <button
                style={{
                  padding: "8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => deleteService(index)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ServiceManagementScreen;
