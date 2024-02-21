"use client";
import React, { useState, useEffect } from "react";
import { useUserId } from "../../../UserIdContext";
import { auth, db } from "../../../utils/firbase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Form, FormControl, Button } from "react-bootstrap";
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

function Map() {
  const { userId } = useUserId();
  let map;
  let marker;
  let searchBox;
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [managerCity, setManagerCity] = useState("");

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
    const existingScript = document.getElementById("google-maps-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBPjBHXmDnGvJULgTBQFScAlMCqGZUe16g&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.id = "google-maps-script";
      window.initMap = initMap;

      document.head.appendChild(script);

      return () => {
        // Clean up the script and the global initMap function when the component is unmounted
        delete window.initMap;
        document.head.removeChild(script);
      };
    } else {
      // If the script is already loaded, just call initMap
      initMap();
    }
  }, []);

  function initMap() {
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 30.3753, lng: 69.3451 },
      zoom: 6,
    });

    // Add a click event listener to the map
    map.addListener("click", handleMapClick);

    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    searchBox = new window.google.maps.places.SearchBox(input);
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards the current map's viewport.
    map.addListener("bounds_changed", function () {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", handlePlacesChanged);
  }

  function handleMapClick(event) {
    // Clear the previous marker, if any
    if (marker) {
      marker.setMap(null);
    }

    // Create a new marker at the clicked location
    marker = new window.google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
    });

    // Update the selectedLocation state
    const selectedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(selectedLocation);

    // Update the database with the new latitude and longitude
  }

  function handlePlacesChanged() {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // For each place, get the icon, name, and location.
    const bounds = new window.google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Create a marker for each place.
      marker = new window.google.maps.Marker({
        map,
        title: place.name,
        position: place.geometry.location,
        draggable: true,
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      // Update the selectedLocation state
      setSelectedLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });

    map.fitBounds(bounds);
  }

  const handleaddlocation = async () => {
    try {
      const placesCollectionRef = collection(db, "places");
  
      // Replace with the actual city from hostelData  
      const placesQuery = query(
        placesCollectionRef,
        where("place", "==", managerCity)
      );
  
      const placesSnapshot = await getDocs(placesQuery);
  
      if (!placesSnapshot.empty) {
        const placeDoc = placesSnapshot.docs[0];
        const propertiesArray = placeDoc.data().properties;
  
        // Find the property with the matching managerId
        const targetProperty = propertiesArray.find(property => property.managerId === userId);
  
        if (targetProperty) {
          // Add latitude and longitude properties to the found property
          const updatedProperty = {
            ...targetProperty,
            latitude: selectedLocation.lat,  // Replace with the actual latitude value
            longitude: selectedLocation.lng,  // Replace with the actual longitude value
          };
  
          // Update the properties array with the modified property
          const updatedPropertiesArray = propertiesArray.map(property => {
            if (property.managerId === userId) {
              return updatedProperty;
            }
            return property;
          });
  
          // Update the document with the modified properties array
          await updateDoc(placeDoc.ref, { properties: updatedPropertiesArray });
  
          console.log("done");
        } else {
          console.log("Hostel with matching managerId not found.");
        }
      } else {
        console.log("No places found for the given city.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };
  
  


  return (
    <div>
      <div
        id="map"
        style={{
          height: "90vh",
          width: "100%",
        }}
      ></div>
      <Form inline>
        <FormControl
          type="text"
          id="pac-input"
          placeholder="Search for a place"
          style={{
            marginTop: "10px",
            marginLeft: "250px",
            padding: "10px",
            width: "300px",
            borderColor: "black",
            borderWidth: "3px",
            borderRadius: "8px",
          }}
          bsSize="lg" // Set the size to 'lg' (large)
        />
      </Form>
      {selectedLocation && (
        <div
          style={{
            height: "60px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <Button
            variant="success"
            size="lg"
            onClick={handleaddlocation}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
}

export default Map;
