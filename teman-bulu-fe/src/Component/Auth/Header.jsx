import React from 'react'
import { Link, useLocation } from 'react-router-dom';

export default function Header() {

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
      {/* <!-- Header --> */}
      <header className="bg-white">
        <div className="container py-4 mx-auto w-full flex justify-between items-center">
          {/* <!-- Logo --> */}
          <div className="w-48 h-12 pr-14 flex items-center justify-center">
            {/* <!-- Placeholder for logo --> */}
            <p className='text-2xl font-bold'>Teman Bulu</p>
          </div>

          {/* <!-- Navigation --> */}
          <nav className="flex items-center">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-800 hover:text-gray-600">About</a></li>
              <li>
                {currentPath === '/login' || currentPath === '/landingpage' ? (
                  <Link to="/register" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                    Register
                  </Link>
                ) : currentPath === '/register' ? (
                  <Link to="/login" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
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
