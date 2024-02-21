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

const RoomManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Full', 'Available'
  const [searchUserId, setSearchUserId] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { userId } = useUserId();
  const [rooms, setRooms] = useState([]);
  const [hostelData, setHostelData] = useState({});
  const [matchingReservations, setMatchingReservations] = useState([]);
  const [roomUserIds, setRoomUserIds] = useState({});
  const [userNames, setUserNames] = useState({});
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [size, setSize] = useState("");
  const [bedType, setBedType] = useState("");
  const [roomsArray, setRoomsArray] = useState([]);
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
  const handleSearch = () => {
    const filteredRooms = rooms.filter((room) => {
      const matchesStatus =
        statusFilter === "All" || calculateStatus(room) === statusFilter;
      const matchesUserId =
        searchUserId === "" ||
        (room.userId !== null && room.userId.toString().includes(searchUserId));
      return matchesStatus && matchesUserId;
    });
    setSearchResults(filteredRooms);
  };
  const calculateStatus = (room) => {
    if (room.bookedSlots === room.capacity) {
      return "No";
    } else {
      return `${room.bookedSlots} / ${room.capacity}`;
    }
  };

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
                  
                };
              }
            });
          });
        });

        setRooms(fetchedRooms);
        setHostelData(fetchedHostelData);

        // Fetch matching reservations
        const reservationsCollectionRef = collection(db, "reservations");
        const reservationsQuery = query(
          reservationsCollectionRef,
          where("city", "==", managerCity),
          where("hostelId", "==", fetchedHostelData.hostelId)
        );

        const reservationsSnapshot = await getDocs(reservationsQuery);
        const matchingReservationsData = reservationsSnapshot.docs.map((doc) =>
          doc.data()
        );

        setMatchingReservations(matchingReservationsData);

        // Extract userIds for each roomId
        const roomUserIdsData = {};
        fetchedRooms.forEach((room) => {
          const roomId = room.id;
          const userIdsForRoom = matchingReservationsData
            .filter((reservation) => reservation.roomId === roomId)
            .map((reservation) => reservation.userId);

          roomUserIdsData[roomId] = userIdsForRoom;
        });

        setRoomUserIds(roomUserIdsData);
        const usersCollectionRef = collection(db, "users");
        const usersQuery = query(
          usersCollectionRef,
          where("userId", "in", Object.values(roomUserIdsData).flat())
        );

        const usersSnapshot = await getDocs(usersQuery);
        const userNamesData = {};

        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          userNamesData[userData.userId] = userData.firstName;
        });

        setUserNames(userNamesData);
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
      }
    };

    fetchRoomsByManagerId();
  }, [userId, managerCity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const managersCollectionRef = collection(db, "managers");
        const placesCollectionRef = collection(db, "places");

        // Query managers collection based on locally defined userId
        const managersQuery = query(
          managersCollectionRef,
          where("userId", "==", userId)
        );

        const managersSnapshot = await getDocs(managersQuery);

        let newManagerCity = "";

        managersSnapshot.forEach((doc) => {
          newManagerCity = doc.data().city;
        });

        // Set the state with the new managerCity
        setManagerCity(newManagerCity);

        // Query places collection based on the managerCity
        const placesQuery = query(
          placesCollectionRef,
          where("place", "==", newManagerCity)
        );

        const placesSnapshot = await getDocs(placesQuery);

        let newPlaceProperties = [];

        placesSnapshot.forEach((doc) => {
          // Assuming "properties" is an array field in your "places" collection
          newPlaceProperties = doc.data().properties;
        });

        // Set the state with the new placeProperties

        // Map through all arrays in the properties field
        newPlaceProperties.forEach((property) => {
          // Compare the managerId with the userId
          if (property.managerId === userId) {
            // Assuming "hostelArray" is a field in the matching property
            const newHostelArray = property;

            // Set the state with the new hostelArray

            // Assuming "rooms" is a field within each hostel array
            const newRoomsArray = newHostelArray.rooms;

            // Set the state with the new roomsArray
            setRoomsArray(newRoomsArray);
            console.log(newRoomsArray);

            // Break the loop if a match is found
            return;
          }
        });

        // Continue with the rest of your code or use the roomsArray state as needed
        // ...

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the function only once when the component mounts
    fetchData();

  }, [userId]);
  
  const handleCreateRoom = async () => {
    try {
      const roomId = generateRandomId();
      const placesCollectionRef = collection(db, "places");
  
      // Replace with the actual city from hostelData
      const targetCity = managerCity;
  
      const placesQuery = query(
        placesCollectionRef,
        where("place", "==", targetCity)
      );
  
      const placesSnapshot = await getDocs(placesQuery);
  
      if (!placesSnapshot.empty) {
        const propertyDocRef = placesSnapshot.docs[0].ref;
  
        // Find the property with the matching managerId
        const targetPropertyIndex = placesSnapshot.docs[0].data().properties.findIndex(property => property.managerId === userId);
  
        if (targetPropertyIndex !== -1) {
          // Create a new room object with individual properties
          const newRoom = {
            name: roomName,
            person: Number(capacity),
            size: Number(size),
            bed: bedType,
            id: roomId
          };
  
          // Get the target property
          const targetProperty = placesSnapshot.docs[0].data().properties[targetPropertyIndex];
  
          // Assuming "rooms" is an array field in the target property
          const updatedRoomsArray = [...targetProperty.rooms, newRoom];
  
          // Update the "rooms" field in the target property directly
          await updateDoc(propertyDocRef, {
            ["properties"]: placesSnapshot.docs[0].data().properties.map((property, index) =>
              index === targetPropertyIndex ? { ...property, rooms: updatedRoomsArray } : property
            )
          });
  
          window.alert("Room Added");
          setIsModalOpen(false);
  
          // Update the state with the new room data
          setRoomsArray(updatedRoomsArray);
        }
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };
  
  const generateRandomId = (length = 5) => {
    const digits = "0123456789";
    let randomNumber = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      randomNumber += digits.charAt(randomIndex);
    }
  
    return randomNumber;
  };
  
  
  const handleDeleteRoom = async (roomId) => {
    try {
      const placesCollectionRef = collection(db, "places");
  
      // Replace with the actual city from hostelData
      const targetCity = hostelData.city;
  
      const placesQuery = query(
        placesCollectionRef,
        where("place", "==", targetCity)
      );
  
      const placesSnapshot = await getDocs(placesQuery);
  
      if (!placesSnapshot.empty) {
        const propertyDocRef = placesSnapshot.docs[0].ref;
  
        // Find the property with the matching managerId
        const targetProperty = placesSnapshot.docs[0].data().properties.find(property => property.managerId == userId);
  
        if (targetProperty) {
          // Filter out the deleted room based on roomId
          const updatedRoomsArray = targetProperty.rooms.filter(room => room.id !== roomId);
  
          // Update the "rooms" field in the target property directly
          await updateDoc(propertyDocRef, {
            ["properties"]: placesSnapshot.docs[0].data().properties.map((property, index) =>
              index === 0 ? { ...property, rooms: updatedRoomsArray } : property
            )
          });
  
          window.alert("Room Deleted");
          // Update the state with the new room data
          setRoomsArray(updatedRoomsArray);
        }
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };
  

  return (
    <div className="container mx-auto p-8">
      
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create Room
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Room Number</th>
              <th className="py-3 px-4 text-left">Room Size</th>
              <th className="py-3 px-4 text-left">Capacity</th>
              <th className="py-3 px-4 text-left">Total Reserved</th>
              <th className="py-3 px-4 text-left">Availability</th>
              <th className="py-3 px-4 text-left">Resident Name</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={room.id} className="hover:bg-white hover:text-black">
                <td className="py-3 px-5">{index + 1}</td>
                <td className="py-3 px-10">{room.id}</td>
                <td className="py-3 px-10">{room.size} square ft</td>
                <td className={`py-3 px-4`}>{room.person} person</td>
                <td className={`py-3 px-8`}>
                  {roomUserIds[room.id]?.length || 0} person
                </td>
                <td
                  className={`py-3 px-4 ${
                    room.person - (roomUserIds[room.id]?.length || 0) === 0
                      ? "FullyReserved"
                      : "Available"
                  }`}
                >
                  {room.person - (roomUserIds[room.id]?.length || 0) === 0
                    ? "Fully Reserved"
                    : "Available"}
                </td>
                <td className="py-3 px-4">
                  {roomUserIds[room.id]?.map((userId, index, array) => (
                    <span key={userId}>
                      {userNames[userId]}
                      {index !== array.length - 1 && ","}
                      {"  "}
                    </span>
                  ))}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-container bg-gray-800 text-white w-full md:w-96 p-6 rounded-lg shadow-lg z-50">
            <h2 className="text-3xl font-bold mb-2">Create Room</h2>
            <p className="text-sm mb-4">Enter room details below:</p>
            <div className="mb-4">
              <label className="block text-sm mb-2">Room Name</label>
              <input
                type="text"
                placeholder="Enter room name"
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-gray-500"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Capacity</label>
              <input
                type="number"
                placeholder="Enter capacity"
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-gray-500"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Size (square feet)</label>
              <input
                type="text"
                placeholder="Enter size"
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-gray-500"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Bed Type</label>
              <input
                type="text"
                placeholder="Enter bed type"
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-gray-500"
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2 focus:outline-none"
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
              <button
                className="text-sm text-gray-400 border border-gray-600 hover:bg-gray-700 py-2 px-4 rounded focus:outline-none"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <LoadMoreButton />
    </div>
  );
};

export default RoomManagementPage;
