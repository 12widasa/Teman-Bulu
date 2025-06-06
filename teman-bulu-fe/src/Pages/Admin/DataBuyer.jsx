import React, { useEffect, useState } from 'react'
import Sidebar from '../../Component/Admin/Sidebar'
import { Search } from 'lucide-react'
import DataTable from 'react-data-table-component';
import { tableColumnBuyer, customStyles } from './columns';
import { ADMIN_DATA_SERVICE } from '../../Services/AdminData';

export default function DataBuyer() {
  const [adminDataBuyer, setAdminDataBuyer] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ADMIN_DATA_SERVICE.getUser({ role_id: 3 });
        setAdminDataBuyer(response.data);
      } catch (error) {
        console.log("Error fetching data from API:", error.response?.data || error.message);
      }
    }
    fetchData();
  }, [])
  return (
    <Sidebar>
      <h1 className="text-2xl font-bold mb-4">Data Pembeli</h1>

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
        columns={tableColumnBuyer}
        data={adminDataBuyer}
        customStyles={customStyles}
      />

    </Sidebar>
  )
}
