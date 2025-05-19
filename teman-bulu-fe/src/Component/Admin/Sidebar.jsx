import { Menu } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-600 text-white flex flex-col justify-between py-6">
        <div>
          <div className="px-6 mb-8 flex gap-2">
            <button className="mb-4 ">
              <Menu strokeWidth={1.5} />
            </button>
            Logo Kayak e
          </div>

          {/* Nav items */}
          <nav className="space-y-2 px-6">
            <NavLink
              to="/pembeli"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded ${isActive ? 'bg-gray-600' : ''
                }`
              }
            >
              <div className="w-6 h-6 bg-white text-black mr-4 flex items-center justify-center rounded">📦</div>
              Data Pembeli
            </NavLink>
            <NavLink
              to="/penjual"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded ${isActive ? 'bg-gray-600' : ''
                }`
              }
            >
              <div className="w-6 h-6 bg-white text-black mr-4 flex items-center justify-center rounded">🛒</div>
              Data Penjual
            </NavLink>
            <NavLink
              to="/verifikasi"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded ${isActive ? 'bg-gray-600' : ''
                }`
              }
            >
              <div className="w-6 h-6 bg-white text-black mr-4 flex items-center justify-center rounded">✅</div>
              Verifikasi Data
            </NavLink>
          </nav>
        </div>

        {/* Logout button */}
        <div className="px-6">
          <button className="flex items-center text-white px-4 py-2 rounded hover:bg-gray-600 w-full">
            <div className="w-6 h-6 bg-white text-black mr-4 flex items-center justify-center rounded">🚪</div>
            <span className="font-bold">Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
