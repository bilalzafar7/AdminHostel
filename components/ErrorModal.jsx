import React from "react";

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div className="modal-container bg-white w-64 p-6 rounded shadow-lg z-50">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500">{message}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
