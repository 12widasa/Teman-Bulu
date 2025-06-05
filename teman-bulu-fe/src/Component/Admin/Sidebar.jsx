import { Check, Link, LogOut, Menu, User } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import LOGO from '../../assets/logo.png';

export default function Sidebar({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 text-white flex flex-col justify-between py-6">
        <div>
          <div className="px-6 mb-8 flex gap-2 text-black">
            {/* <button className="mb-4 ">
              <Menu strokeWidth={1.5} />
            </button> */}
            <img src={LOGO} className='w-40' alt="" />
          </div>

          {/* Nav items */}
          <nav className="space-y-2 px-6">
            <NavLink
              to="/admin-data-buyer"
              className={({ isActive }) =>
                'flex items-center px-4 py-2 rounded transition-colors duration-200 ' +
                (isActive
                  ? 'bg-[#EF7800] text-white'
                  : 'bg-transparent text-black hover:bg-[#EF7800] hover:text-white')
              }
            >
              <div className="w-6 h-6 mr-4 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              Data Pembeli
            </NavLink>
            <NavLink
              to="/admin-data-seller"
              className={({ isActive }) =>
                'flex items-center px-4 py-2 rounded transition-colors duration-200 ' +
                (isActive
                  ? 'bg-[#EF7800] text-white'
                  : 'bg-transparent text-black hover:bg-[#EF7800] hover:text-white')
              }
            >
              <div className="w-6 h-6 mr-4 flex items-center justify-center rounded">
                <User className="w-5 h-5" />
              </div>
              Data Penjual
            </NavLink>
            <NavLink
              to="/admin-verification-data"
              className={({ isActive }) =>
                'flex items-center px-4 py-2 rounded transition-colors duration-200 ' +
                (isActive
                  ? 'bg-[#EF7800] text-white'
                  : 'bg-transparent text-black hover:bg-[#EF7800] hover:text-white')
              }
            >
              <div className="w-6 h-6 mr-4 flex items-center justify-center rounded">
                <Check />
              </div>
              Verifikasi Data
            </NavLink>
          </nav>
        </div>

        {/* Logout button */}
        <div className="px-6">
          <button className="flex items-center text-[#EF7800] px-4 py-2 rounded w-full">
            <div className="w-6 h-6 text-[#EF7800] mr-4 flex items-center justify-center rounded"><LogOut /></div>
            <span className="font-bold">Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
