import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-4xl font-bold text-[#EF7800] mb-4">404</h1>
      <p className="text-xl font-semibold text-gray-800 mb-2">Oops! Halaman tidak ditemukan.</p>
      <p className="text-gray-600 mb-6">Sepertinya kamu tersesat, tapi jangan khawatir!</p>
      <button
        onClick={goBack}
        className="bg-[#EF7800] text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
      >
        Kembali ke Halaman Sebelumnya
      </button>
    </div>
  );
}
