import { setUser } from "@/redux/slices/authSlice";
import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FaHome,
  FaBed,
  FaBook,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaPlus,
  FaMap,
  FaCog,
  FaCalendarAlt, FaUsers, FaBullhorn, FaBuilding, FaComment, FaStar 
} from "react-icons/fa";
import { useDispatch } from "react-redux";

const ManagerSidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(setUser(null));
      router.push("/");
    } catch (authStateChangedError) {
      console.error("Error in onAuthStateChanged:", authStateChangedError);
    }
  };
  return (
    <div className="w-80 h-screen bg-gray-800 text-white sticky top-0 left-0  flex flex-col items-center p-6">
      <div className="text-2xl font-bold mb-8">Manager Panel</div>
      <ul className="w-full">
        <li className="mb-4">
          <Link href="/manager">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaHome className="mr-2" /> Dashboard
            </p>
          </Link>
        </li>

        <li className="mb-4">
          <Link href="/manager/welcome-details">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaPlus className="mr-2" /> Add Hostel
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/manager/map-check">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaMap className="mr-2" /> Map
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/manager/reservation-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaCalendarAlt className="mr-2" /> Reservation Management
            </p>
          </Link>
        </li>

        <li className="mb-4">
          <Link href="/manager/resident-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaUsers className="mr-2" /> Resident Management
            </p>
          </Link>
        </li>

        <li className="mb-4">
          <Link href="/manager/room-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaBed className="mr-2" /> Room Management
            </p>
          </Link>
        </li>

        <li className="mb-4">
          <Link href="/manager/announcement">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaBullhorn className="mr-2" /> Announcement
            </p>
          </Link>
        </li>

        <li className="mb-4">
          <Link href="/manager/service-form">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaBuilding className="mr-2" /> Facilties and Services
            </p>
          </Link>
        </li>


        <li className="mb-4">
          <Link href="/manager/complains">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaComment className="mr-2" />
              Complains
            </p>
          </Link>
        </li>

        <li className="mb-4">
          <Link href="/manager/ratings">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaStar className="mr-2" /> Ratings
            </p>
          </Link>
        </li>

        <li className="mb-4">
          <Link href="/manager/profile">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaUserCircle className="mr-2" /> Profile
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <button
            onClick={() => logout()}
            className="flex items-center text-white hover:text-gray-300"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ManagerSidebar;
