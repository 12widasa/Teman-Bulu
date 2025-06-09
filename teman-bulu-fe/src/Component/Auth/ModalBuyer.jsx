import React from 'react';

export default function ModalBuyer({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">Your account has been successfully created.</p>
        <button
          onClick={onClose}
          className="bg-[#EF7800] text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};
