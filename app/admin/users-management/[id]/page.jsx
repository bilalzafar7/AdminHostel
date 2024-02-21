'use client'
import React, { useState } from 'react';
import LoadMoreButton from '@/components/LoadMoreButton';
import Link from 'next/link';

const hostelsData = [
  {
    id: 1,
    hostelName: 'Hostel A',
    managerName: 'Manager A',
    managerEmail: 'managerA@example.com',
    complaints: [
      { id: 101, complaint: 'Issue 1', status: 'Pending' },
      { id: 102, complaint: 'Issue 2', status: 'Done' },
    ],
  },
  // Add more hostels with respective details
];

const userData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  hostel: 'Hostel A',
  contact: '0300000000',
  gender:"male",
  complaints: [
    { id: 1, issue: 'Room cleanliness issue' },
    { id: 2, issue: 'Noisy neighbors' },
    // Add more complaints
  ],
};

const bookingHistoryData = [
  {
    id: 1,
    userName: 'John Doe',
    userEmail: 'user1@example.com',
    hostelName: 'Hostel A',
    managerEmail: 'managerA@example.com',
    managerName: 'Manager A',
    startDate: '2023-01-01',
    endDate: '2023-01-10',
  },
  // Add more booking history entries
];

const Page = () => {
  const [hostels, setHostels] = useState(hostelsData);
  const [bookingHistory] = useState(bookingHistoryData);

  // Function to update complaint status
  const handleStatusChange = (hostelId, complaintId) => {
    const updatedHostels = hostels.map(hostel => {
      if (hostel.id === hostelId) {
        const updatedComplaints = hostel.complaints.map(complaint => {
          if (complaint.id === complaintId) {
            complaint.status = complaint.status === 'Pending' ? 'Done' : 'Pending';
          }
          return complaint;
        });
        return { ...hostel, complaints: updatedComplaints };
      }
      return hostel;
    });
    setHostels(updatedHostels);
  };


  return (
    <div className="container mx-auto p-8">
      <div className="container mx-auto p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Customer Information</h1>
      <div className="bg-white shadow-md p-6 rounded-lg mb-8">
        <p className="text-lg">
          <strong>Name:</strong> {userData.name}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {userData.email}
        </p>
        <p className="text-lg">
          <strong>Hostel:</strong> {userData.hostel}
        </p>
        <p className="text-lg">
          <strong>Contact No:</strong> {userData.contact}
        </p>
        <p className="text-lg">
          <strong>Gender:</strong> {userData.gender}
        </p>
      </div>
      {/* <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Complaints</h2>
        <ul className="list-disc list-inside">
          {userData.complaints.map(complaint => (
            <li key={complaint.id} className="text-lg mb-2">
              {complaint.issue}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
      <h1 className="text-4xl font-bold mb-8 text-center">Complaint History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden mb-8">
          {/* Hostel Information Table */}
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Hostel Name</th>
              <th className="py-3 px-4 text-left">Manager Name</th>
              <th className="py-3 px-4 text-left">Manager Email</th>
              <th className="py-3 px-4 text-left">Complaints</th>
              <th className="py-3 px-4 text-left">Status</th>
              {/* <th className="py-3 px-4 text-left">Action</th> */}
            </tr>
          </thead>
          <tbody>
        {hostels.map(hostel => (
          <tr key={hostel.id} className='hover:bg-white hover:text-black'>
             <td className="py-3 px-4">{hostel.id}</td>
                <td className="py-3 px-4">{hostel.hostelName}</td>
                <td className="py-3 px-4">{hostel.managerName}</td>
                <td className="py-3 px-4">{hostel.managerEmail}</td>
                <td className="py-3 px-4">
                  {hostel.complaints.map(complaint => (
                    <div key={complaint.id}>{complaint.complaint}</div>
                  ))}
                </td>
            <td className="py-3 px-4">
              {hostel.complaints.map(complaint => (
                <div key={complaint.id}>
                  {complaint.status}
                  
                </div>
              ))}
            </td>
            {/* <td>
            <button
                    className="bg-blue-500 ml-3 hover:bg-blue-600 text-white py-1 px-4 rounded"
                    onClick={() => handleStatusChange(hostel.id, complaint.id)}
                  >
                    Change Status
                  </button>
            </td> */}
          </tr>
        ))}
      </tbody>

        </table>

        {/* Booking History Table */}
        <h1 className="text-4xl font-bold mb-8 text-center">Booking History</h1>
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">User Name</th>
              <th className="py-3 px-4 text-left">User Email</th>
              <th className="py-3 px-4 text-left">Hostel Name</th>
              <th className="py-3 px-4 text-left">Manager Email</th>
              <th className="py-3 px-4 text-left">Manager Name</th>
              <th className="py-3 px-4 text-left">Start Date</th>
              <th className="py-3 px-4 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {bookingHistory.map(booking => (
              <tr key={booking.id} className='hover:bg-white hover:text-black'>
                <td className="py-3 px-4">{booking.id}</td>
                <td className="py-3 px-4">{booking.userName}</td>
                <td className="py-3 px-4">{booking.userEmail}</td>
                <td className="py-3 px-4">{booking.hostelName}</td>
                <td className="py-3 px-4">{booking.managerEmail}</td>
                <td className="py-3 px-4">{booking.managerName}</td>
                <td className="py-3 px-4">{booking.startDate}</td>
                <td className="py-3 px-4 text-red-500">{booking.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LoadMoreButton />
    </div>
  );
};

export default Page;




