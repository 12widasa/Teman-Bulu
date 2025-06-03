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

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return true;
    }
  };

  const getUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role_id;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");

      if (token && isTokenValid(token)) {
        setIsLoggedIn(true);
      } else {
        if (token) {
          localStorage.removeItem("token");
        }
        setIsLoggedIn(false);
      }
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

  const publicPaths = ["/landingpage", "/login", "/register-buyer", "/register-seller", "/", "/about"];

  if (!publicPaths.includes(currentPath) && !isLoggedIn) {
    return null;
  }

  const handleProfileClick = () => {
    const role = getUserRole();
    if (role === 3) {
      navigate("/profile-buyer");
    } else if (role === 2) {
      navigate("/profile-seller");
    } else {
      navigate("/landingpage");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-white lg:px-4 md:px-4">
        <div className="container py-2 sm:py-3 md:py-4 mx-auto w-full flex justify-between items-center px-2 sm:px-4">
          {/* Logo */}
          <div className="w-full md:w-1/3 flex-col h-auto pl-2 sm:pl-4 flex overflow-hidden">
            <img className='w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64' src={LOGO} alt="" />
          </div>

          {/* Navigation */}
          <nav className="flex">
            <ul className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 items-center">
              <li className="items-center">
                <Link
                  to="/landingpage"
                  className={`text-xs sm:text-sm md:text-base lg:text-lg ${currentPath === "/landingpage" ? "text-orange-500" : "text-gray-800"
                    }`}
                >
                  Beranda
                </Link>
              </li>

              <li className="items-center">
                <Link to="/about" className={`text-xs sm:text-sm md:text-base lg:text-lg ${currentPath === "/about" ? "text-orange-500" : "text-gray-800"
                  }`}>
                  Tentang Kami
                </Link>
              </li>

              {/* Show these items only when not logged in */}
              {!isLoggedIn && (
                <>
                  <li>
                    <div className="relative">
                      <button
                        onClick={toggleDropdown}
                        className="bg-[#EF7800] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
                      >
                        Register
                        <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </button>

                      {isOpen && (
                        <div className="absolute mt-2 w-28 sm:w-32 md:w-36 lg:w-40 bg-white rounded shadow-lg z-10 border border-gray-200">
                          <Link
                            to="/register-buyer"
                            className="block w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                          >
                            Pembeli
                          </Link>
                          <Link
                            to="/register-seller"
                            className="block w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                          >
                            Penjual
                          </Link>
                        </div>
                      )}
                    </div>
                  </li>

                  <li>
                    <Link
                      to="/login"
                      className="bg-[#EF7800] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded flex items-center text-xs sm:text-sm md:text-base"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}

              {/* Show these items only when logged in and token is valid */}
              {isLoggedIn && (
                <>
                  <li className="items-center">
                    <Link to="/pesan-layanan" className={`text-xs sm:text-sm md:text-base lg:text-lg ${currentPath === "/pesan-layanan" || currentPath === "/detail-pesanan" ? "text-orange-500" : ""
                      } text-gray-800`}>
                      Pesan Layanan
                    </Link>
                  </li>

                  <li className="items-center">
                    <Link to="/daftar-transaksi" className={`text-xs sm:text-sm md:text-base lg:text-lg ${currentPath === "/daftar-transaksi" ? "text-orange-500" : ""
                      } text-gray-800`}>
                      Daftar Transaksi
                    </Link>
                  </li>

                  <li className="ml-auto relative">
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-1 sm:gap-2 bg-gray-100 p-1.5 sm:p-2 rounded-full"
                    >
                      <User size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-32 sm:w-36 md:w-40 lg:w-48 bg-white rounded shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
                        >
                          <span className="flex items-center gap-2">
                            <User size={14} className="sm:w-4 sm:h-4" />
                            Profile
                          </span>
                        </button>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-800 hover:bg-gray-100 hover:text-[#EF7800]"
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