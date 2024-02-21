"use client";
import LoadMoreButton from "@/components/LoadMoreButton";
import { useEffect, useState } from "react";
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

const WelcomePage = () => {
  const [hostelName, setHostelName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState(""); // Assuming 'type' is a dropdown with options 'male' and 'female'
  const [price, setPrice] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const { userId } = useUserId();
  const [managerCity, setManagerCity] = useState("");
  const [hostelExists, setHostelExists] = useState(false);

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
  }, [userId]); // Trigger the effect when userId changes

  const generateRandomId = (length = 5) => {
    const digits = "0123456789";
    let randomNumber = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      randomNumber += digits.charAt(randomIndex);
    }
  
    return randomNumber;
  };

  const handleAddHostel = async () => {
    try {
      const hostelId = generateRandomId();
      // Reference to the places collection
      const placesCollectionRef = collection(db, "places");

      // Query the documents where place matches the manager's city
      const placesQuery = query(
        placesCollectionRef,
        where("place", "==", managerCity)
      );

      const placesSnapshot = await getDocs(placesQuery);

      if (!placesSnapshot.empty) {
        const placesDocRef = placesSnapshot.docs[0].ref;

        const storage = getStorage();
        const userStorageRef = ref(storage, "hostel_images");
        const imageUrls = [];

        for (const imageFile of selectedImages) {
          const imageName = `${userId}_${Date.now()}_${imageFile.name}`;
          const storageRef = ref(userStorageRef, imageName);

          await uploadBytes(storageRef, imageFile);

          // Get the download URL for the uploaded image
          const imageUrl = await getDownloadURL(storageRef);
          imageUrls.push(imageUrl);
        }

        const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;
        // Update the properties array in the document
        await updateDoc(placesDocRef, {
          properties: arrayUnion({
            managerId: userId,
            name: hostelName,
            address,
            type,
            newPrice: Number(price),
            rating: null,
            id: hostelId,
            rooms: [],
            ratings: [],
            services: [],
            photos: imageUrls.map((imageUrl, index) => ({ id: index + 1, imageUrl })),
            image: firstImageUrl,
            approved: false,
          }),
        });

        setHostelName("");
        setAddress("");
        setType("");
        setPrice("");
        setSelectedImages([]);

        console.log("Hostel added to places successfully");
        window.alert("Hostel Added. Please add the rooms now");
      } else {
        console.error("Places document not found");
      }
    } catch (error) {
      console.error("Error adding hostel to places:", error);
    }
  };

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesCollectionRef = collection(db, "places");
  
        const placesQuery = query(
          placesCollectionRef,
          where("place", "==", managerCity)
        );
  
        const placesSnapshot = await getDocs(placesQuery);
  
        if (!placesSnapshot.empty) {
          const properties = placesSnapshot.docs[0].data().properties;
  
          const exists = checkIfHostelExists(properties, userId);
          setHostelExists(exists);
        }
      } catch (error) {
        console.error("Error checking hostel existence:", error);
      }
    };
  
    fetchData();
  }, [managerCity, userId]);

  const checkIfHostelExists = (properties, userId) => {
    return properties.some(hostel => hostel.managerId === userId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
         {hostelExists ? (
      <div className="text-center">
      <h2 className="text-4xl font-bold mb-4 text-gray-900">Hostel Already Added</h2>
      <p className="text-1xl text-white">
        It seems like you've already added a hostel. If you need to add room, add them in Room Management.
      </p>
     
    </div>
    ) : (
      <div
        className="bg-white p-8 rounded shadow-md"
        style={{ width: "500px" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Add your Hostel
       
        </h2>
        <form>
          <div className="mb-4">
            <label className="text-1xl font-bold mb-6  text-gray-800">
              Hostel Name
            </label>
            <input
              type="text"
              placeholder="Enter hostel name"
              className="bg-gray-200 text-gray-800 border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-indigo-500"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
            />
          </div>
          <div className="mb-4">
          <label className="text-1xl font-bold mb-6  text-gray-800">Address</label>
            <input
              type="text"
              placeholder="Enter address"
              className="bg-gray-200 text-gray-800 border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-indigo-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
          <label className="text-1xl font-bold mb-6  text-gray-800">Type</label>
            <select
              className="bg-gray-200 text-gray-800 border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-indigo-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4">
          <label className="text-1xl font-bold mb-6  text-gray-800">Price</label>
            <input
              type="text"
              placeholder="Enter price"
              className="bg-gray-200 text-gray-800 border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-indigo-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-4">
          <label className="text-1xl font-bold mb-6  text-gray-800">
              Select Images
            </label>
            <input
              type="file"
              multiple
              className="bg-gray-200 text-gray-800 border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-indigo-500"
              onChange={handleImageSelection}
            />
          </div>
          {/* Display selected image names for reference */}
          {selectedImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Selected Images:</p>
              <ul>
                {selectedImages.map((image, index) => (
                  <li key={index}>{image.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-4 rounded focus:outline-none"
              onClick={handleAddHostel}
            >
              Add Hostel
            </button>
          </div>
        </form>
      </div>
    )}
      
    </div>
  );
};

export default WelcomePage;
