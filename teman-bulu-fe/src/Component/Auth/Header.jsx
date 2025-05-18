import { ChevronDown } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      {/* <!-- Header --> */}
      <header className="bg-white">
        <div className="container py-4 mx-auto w-full flex justify-between items-center">
          {/* <!-- Logo --> */}
          <div className="w-full md:w-1/3 flex-col h-auto pr-4 flex overflow-hidden">
            {/* <!-- Placeholder for logo --> */}
            <p className="text-2xl md:text-3xl font-bold break-words leading-tight">
              TEMAN ada BULU
            </p>
            <p className="text-base md:text-lg break-words">
              Solusi <span className="text-[#EF7800] font-bold">Bahagia</span> Peliharaan Anda
            </p>
          </div>


          {/* <!-- Navigation --> */}
          <nav className="flex">
            <ul className="flex space-x-6 items-center">
              <li className='items-center'><Link to="" className="text-gray-800 hover:text-gray-600">Beranda</Link></li>
              <li className='items-center'><Link to="" className="text-gray-800 hover:text-gray-600">Tentang Kami</Link></li>
              {/* <li className='items-center'><a href="#" className="text-gray-800 hover:text-gray-600">About</a></li> */}
              <li>
                {currentPath === '/login' || currentPath === '/landingpage' ? (
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="bg-[#EF7800] text-white px-4 py-3 rounded flex items-center gap-2"
                    >
                      Register
                      <ChevronDown size={14} />
                    </button>

                    {isOpen && (
                      <div className="absolute mt-2 w-40 bg-white rounded shadow-lg z-10 border border-gray-200">
                        <Link
                          to="/register-buyer"
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                        >
                          Buyer
                        </Link>
                        <Link
                          to="/register-seller"
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                        >
                          Seller
                        </Link>
                      </div>
                    )}
                  </div>
                ) : currentPath === '/register-buyer' || currentPath === '/register-seller' ? (
                  <Link to="/login" className="bg-[#EF7800] text-white px-4 py-3 rounded">
                    Login
                  </Link>
                ) : null}
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}
