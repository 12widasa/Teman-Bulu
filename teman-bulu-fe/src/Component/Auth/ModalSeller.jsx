import React from 'react';

export default function ModalSeller({ isOpen, onClose, link }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-72 p-6 rounded-lg shadow-lg max-w-[800px] w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <div className='flex flex-col items-center mt-8'>
          <div className="text-4xl font-bold text-blue-500 mb-4">( ? )</div>
          <p className="text-lg font-semibold mb-2">
            Silahkan menghubungi Link WA berikut untuk Verifikasi dan melanjutkan ke tahap interview
          </p>
          <p className="mt-4">
            Link WA:{' '}
            <a href={link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              Link
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
