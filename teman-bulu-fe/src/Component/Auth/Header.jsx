import { ChevronDown, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LOGO from '../../assets/logo.png';

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your actual authentication check
    const checkAuthStatus = () => {
      // const token = localStorage.getItem("token");
      const token = "true"
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/landingpage");
  };

  const publicPaths = ["/landingpage", "/login", "/register-buyer", "/register-seller"];

  if (!publicPaths.includes(currentPath) && !isLoggedIn) {
    return null;
  }

  return (
    <div>
      {/* <!-- Header --> */}
      <header className="bg-white lg:px-4 md:px-4">
        <div className="container py-4 mx-auto w-full flex justify-between items-center">
          {/* <!-- Logo --> */}
          <div className="w-full md:w-1/3 flex-col h-auto pl-4 md:pl-4 sm:pl-4 flex overflow-hidden">
            {/* <!-- Placeholder for logo --> */}
            {/* <p className="text-2xl md:text-xl font-bold break-words leading-tight">
              TEMAN ada BULU
            </p>
            <p className="text-base md:text-xs break-words">
              Solusi <span className="text-[#EF7800] font-bold">Bahagia</span> Peliharaan Anda
            </p> */}
            <img className='w-[280px]' src={LOGO} alt="" />
          </div>


          {/* <!-- Navigation --> */}
          <nav className="flex">
            <ul className="flex space-x-6 items-center">
              <li className="items-center">
                <Link
                  to="/landingpage"
                  className={`${currentPath === "/landingpage" ? "text-orange-500" : "text-gray-800"
                    }`}
                >
                  Beranda
                </Link>
              </li>

              <li className="items-center">
                <Link to="/about" className="text-gray-800 hover:text-gray-600">
                  Tentang Kami
                </Link>
              </li>

              {/* Show these items only when not logged in */}
              {!isLoggedIn && (
                <>
                  <li>
                    {(currentPath === "/login" || currentPath === "/landingpage") && (
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
                              Pembeli
                            </Link>
                            <Link
                              to="/register-seller"
                              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                            >
                              Penjual
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </li>

                  <li>
                    {(currentPath === "/landingpage" ||
                      currentPath === "/register-buyer" ||
                      currentPath === "/register-seller") && (
                        <Link
                          to="/login"
                          className="bg-[#EF7800] text-white px-4 py-3 rounded flex items-center"
                        >
                          Login
                        </Link>
                      )}
                  </li>
                </>
              )}

              {/* Show these items only when logged in */}
              {isLoggedIn && (
                <>
                  <li className="items-center">
                    <Link to="/pesan-layanan" className={`${currentPath === "/pesan-layanan" || currentPath === "/detail-pesanan" ? "text-orange-500" : ""} text-gray-800 hover:text-gray-600`}>
                      Pesan Layanan
                    </Link>
                  </li>

                  <li className="items-center">
                    <Link to="/daftar-transaksi" className={`${currentPath === "/daftar-transaksi" ? "text-orange-500" : ""} text-gray-800 hover:text-gray-600`}>
                      Daftar Transaksi
                    </Link>
                  </li>

                  <li className="ml-auto relative">
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 bg-gray-100 p-2 rounded-full"
                    >
                      <User size={24} className="text-gray-700" />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10 border border-gray-200">
                        <Link
                          to="/profile"
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}
