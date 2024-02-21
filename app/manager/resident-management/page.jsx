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

const Residentmangement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Full', 'Available'
  const [searchUserId, setSearchUserId] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { userId } = useUserId();
  const [rooms, setRooms] = useState([]);
  const [hostelData, setHostelData] = useState({});
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);

        const fetchedUsers = [];

        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          fetchedUsers.push(userData);
        });

        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

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
      let fetchedReservations = [];

      placesSnapshot.forEach(async (placeDoc) => {
        const properties = placeDoc.data().properties || [];

        for (const property of properties) {
          const propertyRooms = property.rooms || [];

          for (const room of propertyRooms) {
            if (property.managerId === userId) {
              const propertyId = property.id;
              const roomId = room.id;
              const roomData = { propertyId, ...room };
              fetchedRooms.push(roomData);

              // Extract and save single value hostel data
              fetchedHostelData = {
                hostelId: property.id,
                // Add other relevant data if needed
              };

              // Fetch reservations for the current room
              const reservationsCollectionRef = collection(db, "reservations");
              const reservationsQuery = query(
                reservationsCollectionRef,
                where("hostelId", "==", property.id),
                where("roomId", "==", room.id)
              );

              const reservationsSnapshot = await getDocs(reservationsQuery);

              reservationsSnapshot.forEach((reservationDoc) => {
                const reservationData = reservationDoc.data();
                fetchedReservations.push(reservationData);
              });
            }
          }
        }

        // Move the setReservations outside of the loop to update the state once
        // after all reservations have been fetched
        setReservations(fetchedReservations);
      });

      setRooms(fetchedRooms);
      setHostelData(fetchedHostelData);

    } catch (error) {
      console.error("Error fetching:", error.message);
    }
  };

  fetchRoomsByManagerId();
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

  const findUserDetails = (roomId) => {
    const roomReservations = reservations.filter((reservation) => reservation.roomId === roomId);
    const userDetails = roomReservations.map((reservation) => {
      const user = users.find((user) => user.userId === reservation.userId);
      return user ? { image: user.image, email: user.email, phone: user.phone,fullName: `${user.firstName} ${user.lastName}` } : null;
    });
    return userDetails;
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleOutsideClick = (event) => {
    if (event.target.className === 'modal') {
      closeModal();
    }
  };
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Resident Management</h1>
      
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Room Number</th>
              <th className="py-3 px-4 text-left">Room Name</th>
              <th className="py-3 px-4 text-left">Resident Name</th>
              <th className="py-3 px-4 text-left">Resident Email</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
          {rooms.map((room, roomIndex) => {
            const userDetailsArray = findUserDetails(room.id);
            return userDetailsArray.map((userDetails, userIndex) => (
              <tr key={`${room.id}-${userIndex}`}>
                <td className="py-3 px-5">{roomIndex * userDetailsArray.length + userIndex + 1}</td>
                <td className="py-3 px-10">{room.id}</td>
                <td className="py-3 px-4">{room.name}</td>
                <td className="py-3 px-5">{userDetails ? userDetails.fullName : 'N/A'}</td>
                <td className="py-3 px-5">{userDetails ? userDetails.email : 'N/A'}</td>
                <td className="py-3 px-5">{userDetails ? userDetails.phone : 'N/A'}</td>
                <td>
  {userDetails && userDetails.image && (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <img
        src={userDetails.image}
        alt={`User ${userDetails.userId}`}
        style={{
          maxWidth: '40px',
          maxHeight: '36px',
          borderRadius: '50%',
          marginLeft: '20px',
          cursor: 'pointer',
        }}
        onClick={() => openModal(userDetails.image)}
      />
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '5px',
          borderRadius: '5px',
          display: 'none',
        }}
      >
        Click to enlarge
      </span>
    </div>
  )}
</td>
              </tr>
            ));
          })}
          </tbody>
        </table>
        {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="modal-overlay fixed inset-0 bg-black opacity-50"
            onClick={handleOutsideClick}
          ></div>
          <div className="modal-container bg-gray-800 text-white w-full md:w-96 p-6 rounded-lg shadow-lg z-50">
            <img src={selectedImage} alt="Enlarged Image" className="mb-4" />
            <div className="flex justify-end">
              <button
                className="text-sm text-gray-400 border border-gray-600 hover:bg-gray-700 py-2 px-4 rounded focus:outline-none"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>


      <LoadMoreButton />
    </div>
  );
};

export default Residentmangement;
