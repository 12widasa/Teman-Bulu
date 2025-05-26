import React, { useEffect, useState } from 'react'
import Sidebar from '../../Component/Admin/Sidebar'
import { Check, Search, Trash, Trash2 } from 'lucide-react'
import { customStyles, tableColumnSeller } from './columns'
import DataTable from 'react-data-table-component'
import { ADMIN_DATA_SERVICE } from '../../Services/AdminData'

export default function VerificationData() {
  const [adminDataSeller, setAdminDataSeller] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ADMIN_DATA_SERVICE.getUser({ role_id: 2 });
        setAdminDataSeller(response.data);
      } catch (error) {
        console.log("Error fetching data from API:", error.response?.data || error.message);
      }
    }
    fetchData();
  }, [])

  const actionColumn = {
    name: 'Actions',
    cell: (row) => {
      if (row.verified === true) {
        return (
          <div className='bg-[#5EFF91] font-semibold text-sm'>Verified</div>
        );
      }

      return (
        <div className='flex gap-4'>
          <div className='flex rounded-lg bg-[#5EFF91] cursor-pointer py-2 px-4'>
            <button onClick={(e) => { e.stopPropagation(); confirmEdit(row) }} className="text-slate-400 hover:text-slate-500 rounded-full">
            </button>
            <div className='flex justify-center items-center text-white gap-1'>
              <div className='p-[1px] text-[#5EFF91] rounded-full bg-white'>
                <Check size={14} />
              </div>
              <p className='text-xs'>Terima</p>
            </div>
          </div>

          <div className='flex rounded-lg bg-[#FF5E5E] cursor-pointer py-2 px-4'>
            <button onClick={(e) => { e.stopPropagation(); confirmEdit(row) }} className="text-slate-400 hover:text-slate-500 rounded-full">
            </button>
            <div className='flex justify-center items-center text-white gap-1'>
              <div className='p-[1px] text-white'>
                <Trash size={14} />
              </div>
              <p className='text-xs'>Tolak</p>
            </div>
          </div>
        </div>
      );
    },
    width: '250px',
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  };


  const tableColumn = [...tableColumnSeller, actionColumn];

  return (
    <Sidebar>
      <h1 className="text-2xl font-bold mb-4">Data Penjual</h1>

      <div className="relative mb-4 flex justify-end">
        <div className="relative w-1/4 max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EF7800]"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
        </div>
      </div>

      <DataTable
        columns={tableColumn}
        data={adminDataSeller}
        customStyles={customStyles}
      />

    </Sidebar>
  )
}
