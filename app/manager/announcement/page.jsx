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

const Announcement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const { userId } = useUserId();
  const [hostelData, setHostelData] = useState({});
  const [announcements, setAnnouncements] = useState([]);

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
    const fetchAnnouncements = async () => {
      try {
        const announcementsRef = collection(db, "announcements");
        const announcementsQuery = query(
          announcementsRef,
          where("managerId", "==", userId),
          where("hostelId", "==", hostelData.hostelId)
        );

        const announcementsSnapshot = await getDocs(announcementsQuery);

        if (!announcementsSnapshot.empty) {
          const announcementData = announcementsSnapshot.docs.map((doc) =>
            doc.data()
          );
          setAnnouncements(announcementData);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [hostelData.hostelId, userId]);

  const handleAddAnnouncement = async () => {
    try {
      const newAnnouncementData = {
        city: managerCity,
        content: newAnnouncement,
        hostelId: hostelData.hostelId,
        managerId: userId,
        timestamp: serverTimestamp(),
      };

      // Add the new anno   uncement to Firebase
      const docRef = await addDoc(
        collection(db, "announcements"),
        newAnnouncementData
      );

      // Update the local state with the new announcement
      setAnnouncements((prevAnnouncements) => [
        ...prevAnnouncements,
        newAnnouncementData,
      ]);

      // Close the modal
      setIsModalOpen(false);
      window.alert("Announcement added");
      console.log("New announcement added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding new announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      // Delete the announcement from Firestore using its ID
      await deleteDoc(doc(db, 'announcements', announcementId));

      // Update the state to remove the deleted announcement
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.filter((announcement) => announcement.id !== announcementId)
      );

      console.log('Announcement deleted successfully');
      window.alert("Announcement Removed");
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Announcement Page</h1>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add New Announcement
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-container bg-white w-full md:w-96 p-6 rounded-lg shadow-lg z-50">
            <h2 className="text-2xl font-bold mb-4">Add New Announcement</h2>
            <textarea
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              placeholder="Enter your announcement..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
                onClick={handleAddAnnouncement}
              >
                Add Announcement
              </button>
              <button
                className="text-sm text-gray-600 border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table for displaying older announcements */}
      <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
        <thead className="text-blue-400">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Announcement</th>
            <th className="py-3 px-4 text-left">Added Date</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement, index) => (
            <tr key={index} className="hover:bg-white hover:text-black">
              <td className="py-3 px-5">{index + 1}</td>
              <td className="py-3 px-10">{announcement.content}</td>
              <td className="py-3 px-5">
                {announcement.timestamp.toDate().toLocaleDateString("en-US")}
              </td>

              <td className="py-3 px-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
                  onClick={() => handleDeleteAnnouncement(announcement.announcementId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Announcement;
