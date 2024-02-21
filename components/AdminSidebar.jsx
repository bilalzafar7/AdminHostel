import { setUser } from "@/redux/slices/authSlice";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FaHome,
  FaUser,
  FaCog,
  FaUsers,
  FaBed,
  FaStar,
  FaBook,
  FaExclamationCircle,
  FaCity,
  FaComments,
  FaClipboardList,
  FaCommentsDollar,
  FaImages,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import {FiAlertCircle} from "react-icons/fi"
import { useDispatch } from "react-redux";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const logout = async () => {
    try {
      const auth  = getAuth()
      await signOut(auth);
      dispatch(setUser(null));
      router.push('/'); 
     
    } catch (authStateChangedError) {
      console.error('Error in onAuthStateChanged:', authStateChangedError);
    }
  };
  
  return (
    <div className="w-80 h-screen bg-gray-800 text-white sticky top-0 left-0  flex flex-col items-center p-6">
      <div className="text-2xl font-bold mb-8">Admin Panel</div>
      <ul className="w-full">
        <li className="mb-4">
          <Link href="/admin">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaHome className="mr-2" /> Dashboard
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/admin/users-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaUsers className="mr-2" /> Customer Management
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/admin/manager-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaCog className="mr-2" /> Manager Management
            </p>
          </Link>
        </li>
        {/* <li className="mb-4">
          <Link href="/admin/manager-request">
            <p className="flex items-center text-white hover:text-gray-300">
            <FiAlertCircle className="mr-2" /> Hostel Owner Request
            </p>
          </Link>
        </li> */}
        <li className="mb-4">
          <Link href="/admin/hostel-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaBed className="mr-2" /> Hostel Management
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/admin/ratings-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaStar className="mr-2" /> Ratings Management
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/admin/booking-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaBook className="mr-2" /> Booking Management
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/admin/complaints-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaExclamationCircle className="mr-2" /> Complaints Management
            </p>
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/admin/cities-management">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaCity className="mr-2" /> Cities Management
            </p>
          </Link>
        </li>
        
        <li className="mb-4">
          <Link href="/admin/feedback-check">
            <p className="flex items-center text-white hover:text-gray-300">
              <FaClipboardList className="mr-2" /> Feedbacks
            </p>
          </Link>
        </li>
       
        <li className="mb-4">
          
            <button onClick={()=>logout()} className="flex items-center text-white hover:text-gray-300">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
      
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
