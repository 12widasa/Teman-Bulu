import React, { useEffect, useState } from 'react'
import Sidebar from '../../Component/Admin/Sidebar'
import { Check, Search, Trash, Trash2, TriangleAlert } from 'lucide-react'
import { customStyles, tableColumnSeller } from './columns'
import DataTable from 'react-data-table-component'
import { ADMIN_DATA_SERVICE } from '../../Services/AdminData'

export default function VerificationData() {
  const [adminDataSeller, setAdminDataSeller] = useState([]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const confirmAccept = (row) => {
    setShowAcceptModal(true);
    setSelectedId(row.id);
  }

  const confirmDecline = (row) => {
    setShowDeclineModal(true);
    setSelectedId(row.id);
  }

  const fetchData = async () => {
    try {
      const response = await ADMIN_DATA_SERVICE.getUser({ role_id: 2 });
      setAdminDataSeller(response.data);
    } catch (error) {
      console.log("Error fetching data from API:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (e) => {
    e.stopPropagation();
    try {
      const response = await ADMIN_DATA_SERVICE.verifyUser({ seller_id: selectedId });
      setSelectedId(null);
      setShowAcceptModal(false);
      await fetchData();
      return response.data;
    } catch (error) {
      console.log("Error fetching data from API:", error.response?.data || error.message);
    }
  };

  const handleDecline = async (e) => {
    e.stopPropagation();
    try {
      const response = await ADMIN_DATA_SERVICE.declineUser({ seller_id: selectedId });
      setSelectedId(null);
      setShowDeclineModal(false);
      await fetchData();
      return response.data;
    } catch (error) {
      console.log("Error fetching data from API:", error.response?.data || error.message);
    }
  };

  const actionColumn = {
    name: 'Actions',
    cell: (row) => {
      if (row.verified === 1) {
        return (
          <div className='bg-[#5EFF91] text-white rounded-lg py-1 px-4 text-sm'>Verified</div>
        );
      }

      return (
        <div className='flex gap-4'>
          <div className='flex rounded-lg bg-[#5EFF91] cursor-pointer'>
            <button onClick={(e) => { e.stopPropagation(); confirmAccept(row) }} className="text-slate-400 py-2 px-4 hover:text-slate-500 rounded-full">
              <div className='flex justify-center items-center text-white gap-1'>
                <div className='p-[1px] text-[#5EFF91] rounded-full bg-white'>
                  <Check size={14} />
                </div>
                <p className='text-xs'>Terima</p>
              </div>
            </button>
          </div>

          <div className='flex rounded-lg bg-[#FF5E5E] cursor-pointer'>
            <button onClick={(e) => { e.stopPropagation(); confirmDecline(row) }} className="text-slate-400 py-2 px-4 hover:text-slate-500 rounded-full">
              <div className='flex justify-center items-center text-white gap-1'>
                <div className='p-[1px] text-white'>
                  <Trash size={14} />
                </div>
                <p className='text-xs'>Tolak</p>
              </div>
            </button>
          </div>
        </div >
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
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
            <div className="text-red-500 flex justify-center text-4xl mb-2"><TriangleAlert size={48} /></div>
            <h2 className="text-lg font-semibold mb-4">Terima Pengajuan Akun Ini?</h2>
            <div className='space-x-4 flex justify-around'>
              <button onClick={handleAccept} className='border w-20 rounded-md border-[#EF7800] text-[#EF7800]'><span className='text-sm'>Ya</span></button>
              <button onClick={() => setShowAcceptModal(false)} className='border w-20 rounded-md border-[#EF7800] bg-[#EF7800] text-[#ffffff]'><span className='text-sm'>Tidak</span></button>
            </div>
          </div>
        </div>
      )}

      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
            <div className="text-red-500 flex justify-center text-4xl mb-2"><TriangleAlert size={48} /></div>
            <h2 className="text-lg font-semibold mb-4">Tolak Pengajuan Akun Ini?</h2>
            <div className='space-x-4 flex justify-around'>
              <button onClick={handleDecline} className='border w-20 rounded-md border-[#EF7800] text-[#EF7800]'><span className='text-sm'>Ya</span></button>
              <button onClick={() => setShowDeclineModal(false)} className='border w-20 rounded-md border-[#EF7800] bg-[#EF7800] text-[#ffffff]'><span className='text-sm'>Tidak</span></button>
            </div>
          </div>
        </div>
      )}
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
