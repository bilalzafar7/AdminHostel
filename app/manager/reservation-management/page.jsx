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

const ReservationManagementPage = () => {
  const [reservations, setReservations] = useState();
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Active', 'Inactive'
  const [userIdFilter, setUserIdFilter] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const { userId } = useUserId();
  const [rooms, setRooms] = useState([]);
  const [hostelData, setHostelData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [userInfos, setUserInfos] = useState({});

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  const handleSearch = () => {
    const filteredRooms = rooms.filter((room) => {
      const matchesStatus =
        statusFilter === "All" || room.status === statusFilter;
      const matchesUserId =
        searchUserId === "" ||
        (room.userId !== null && room.userId.toString().includes(searchUserId));
      return matchesStatus && matchesUserId;
    });
    setSearchResults(filteredRooms);
  };
  const handleUserIdFilterChange = (e) => {
    setUserIdFilter(e.target.value);
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
                  // Add other relevant data if needed
                };
              }
            });
          });
        });

        setRooms(fetchedRooms);
        setHostelData(fetchedHostelData);
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
      }
    };

    fetchRoomsByManagerId();
  }, [userId]);

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
    const fetchBookings = async () => {
      try {
        const bookingsCollectionRef = collection(db, "bookings");
        const bookingsQuery = query(
          bookingsCollectionRef,
          where("city", "==", managerCity),
          where("hostelId", "==", hostelData.hostelId)
        );

        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map((doc) => doc.data());
        setBookings(bookingsData);

        // Collect user IDs from bookings
        const userIds = bookingsData.map((booking) => booking.userId);

        // Fetch user data for each user ID
        const fetchUserInfos = async () => {
          try {
            const usersCollectionRef = collection(db, "users");

            for (const userId of userIds) {
              const userDocRef = doc(usersCollectionRef, userId);
              const userDocSnapshot = await getDoc(userDocRef);

              if (userDocSnapshot.exists()) {
                const user = userDocSnapshot.data();

                setUserInfos((prevUserInfos) => ({
                  ...prevUserInfos,
                  [userId]: user,
                }));
              } else {
                console.log(`User with ID ${userId} not found`);
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error.message);
          }
        };

        // Call the fetchUserInfos function
        fetchUserInfos();
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    // Call the fetchBookings function when the component mounts
    fetchBookings();
  }, [managerCity, hostelData.hostelId]);

  const getNumberOfUsersForRoom = async (roomId, hostelId, city) => {
    try {
      // Reference to the reservations collection
      const reservationsCollectionRef = collection(db, "reservations");

      // Create a query to fetch reservations based on roomId, hostelId, and city
      const reservationsQuery = query(
        reservationsCollectionRef,
        where("roomId", "==", roomId),
        where("hostelId", "==", hostelId),
        where("city", "==", city)
      );

      // Fetch the documents that match the query
      const reservationsSnapshot = await getDocs(reservationsQuery);

      // Calculate the number of users for the specified room
      const numberOfUsers = reservationsSnapshot.size;

      return numberOfUsers;
    } catch (error) {
      console.error("Error fetching reservations:", error.message);
      return 0; // Return 0 in case of an error
    }
  };

  const addReservation = async (roomId, hostelId, userId, city) => {
    const reservationsCollectionRef = collection(db, 'reservations');
  
    try {
      // Add a new reservation document with an auto-generated ID
      const newReservationRef = await addDoc(reservationsCollectionRef, {
        roomId,
        hostelId,
        userId,
        city,
        payment_intent: '',
        // Include the auto-generated ID in the document
        reservationId: '', 
        timestamp: serverTimestamp(), // Placeholder for the ID
        // Add other fields as needed
        // ...
      });
  
      // Access the auto-generated reservation ID
      const reservationId = newReservationRef.id;
  
      // Update the document with the reservation ID and other fields
      await setDoc(doc(reservationsCollectionRef, reservationId), {
        roomId,
        hostelId,
        userId,
        city,
        payment_intent: '',
        reservationId,
        timestamp: serverTimestamp(), 
        // Add other fields as needed
        // ...
      });
  
      // Show alert with the reservation ID
      window.alert(`Reservation added successfully! Reservation ID: ${reservationId}`);
  
      // You may want to update the state or perform other actions after adding the reservation
    } catch (error) {
      console.error('Error adding reservation:', error.message);
    }
  };

  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Reservation Management
      </h1>

      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Applicant Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Room ID</th>
              <th className="py-3 px-4 text-left">Room Name</th>
              <th className="py-3 px-4 text-left">Room Capacity</th>
              <th className="py-3 px-4 text-left">Reserved Already</th>
              <th className="py-3 px-4 text-left">Applied Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((reservation, index) => (
              <tr
                key={reservation.id}
                className="hover:bg-white hover:text-black"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                  {`${userInfos[reservation.userId]?.firstName || "N/A"} ${
                    userInfos[reservation.userId]?.lastName || "N/A"
                  }`}
                </td>

                <td className="py-3 px-4">
                  {userInfos[reservation.userId]?.email || "N/A"}
                </td>
                <td className="py-3 px-4">{reservation.roomId}</td>
                <td className="py-3 px-4">{reservation.roomName}</td>
                <td className="py-3 px-4">{reservation.roomCapacity} person</td>
                <td className="py-3 px-4">
                  {getNumberOfUsersForRoom(
                    reservation.roomId,
                    hostelData.hostelId,
                    managerCity
                  )}{" "}
                  person
                </td>
                <td className="py-3 px-4">
                  {reservation.date.toDate().toLocaleDateString("en-US")}
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                    onClick={() => {
                      addReservation(
                        reservation.roomId,
                        hostelData.hostelId,
                        reservation.userId,
                        managerCity
                      );
                    }}
                    >
                      Accept
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LoadMoreButton />
    </div>
  );
};

export default ReservationManagementPage;
