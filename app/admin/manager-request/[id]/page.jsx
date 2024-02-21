'use client'
import React, { useState } from 'react';

const hostelData = {
  id: "202",
  name: "Hostel Name",
  address: "Hostel Address",
  city: "City",
  gender: "Male/Female/Mixed",
  contactNumber: "Contact Number",
  availability: "No of Rooms / Space of Rooms",
  pricePerRoom: "Price per Room",
  photos: ["Photo URL 1", "Photo URL 2", "Photo URL 3"], // Add more photo URLs
  // roomsDetails: {
  //   bed: "One big Mattress",
  //   extraFacilities: "Geysar / AC / Cooler etc",
  //   numberOfPersonsInRoom: 1,
  //   paymentMethod: "Pay in Cash / Bank",
  // },
};

const Page = () => {
  const [hostel] = useState(hostelData);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextSlide = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === hostel.photos.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? hostel.photos.length - 1 : prevIndex - 1));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Hostel Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border rounded-lg overflow-hidden">
          <thead className="text-blue-400">
            <tr>
              <th className="py-3 px-4 text-left">Field</th>
              <th className="py-3 px-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(hostel).map(([key, value]) => (
              <tr key={key} className='hover:bg-white hover:text-black'>
                <td className="py-3 px-4">{key}</td>
                {key === 'photos' ? (
                  <td className="py-3 px-4">
                    <button onClick={openModal}>View Photos</button>
                    {showModal && (
                      <div className="modal">
                        <span className="close" onClick={closeModal}>
                          &times;
                        </span>
                        <div className="modal-content">
                          <button onClick={prevSlide}>Previous</button>
                          <img src={hostel.photos[selectedImageIndex]} alt={`Photo ${selectedImageIndex + 1}`} />
                          <button onClick={nextSlide}>Next</button>
                        </div>
                      </div>
                    )}
                  </td>
                ) : (
                  <td className="py-3 px-4">{typeof value === 'string' ? value : Array.isArray(value) ? value.join(", ") : ''}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
