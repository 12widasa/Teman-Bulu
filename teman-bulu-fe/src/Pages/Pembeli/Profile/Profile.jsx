import React, { useState } from 'react'
import Header from '../../../Component/Auth/Header';
import Footer from '../../../Component/Auth/Footer';
import Image from '../../../assets/kuceng.jpg';
import { Loader2 } from 'lucide-react';
import { BUYER_SERVICE } from './../../../Services/Buyer';

export default function ProfileBuyer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateProfileBuyer, setUpdateProfileBuyer] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
  });

  const handleChange = async (e) => {
    const { id, value } = e.target;
    setUpdateProfileBuyer((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BUYER_SERVICE.getProfile();

        setAnimals(animalRes.data);
        if (response.data) {
          const profileData = response.data[0];
          // console.log(profileData);
          setUpdateProfileBuyer({
            full_name: profileData.full_name || '',
            email: profileData.email || '',
            birth: profileData.birth || '',
            phone_number: profileData.phone_number || '',
            address: profileData.address || '',
          });
        }
      } catch (err) {
        console.error('Gagal ambil data:', err);
      }
    }

    fetchData();
  }, []);

  const handleUpdateProfileBuyer = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await BUYER_SERVICE.updateProfileBuyer(updateProfileBuyer);
      alert("Berhasil Update Profile")
      setIsSubmitting(false);
    } catch (error) {
      alert("Gagal Update Profile");
      setIsSubmitting(false);
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-12 mb-6">
        <div className="flex">
          <div className="w-full md:w-1/2">
            <div className="pr-8">
              <h2 className="text-2xl font-bold mb-4">Ubah Profil</h2>
              <form onSubmit={handleUpdateProfileBuyer}>
                <div className='grid grid-cols-12'>
                  <div className='flex col-span-12 grid-cols-2 justify-between space-x-4'>
                    <div className="mb-4 w-full col-span-1">
                      <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                      <input required placeholder='John Doe' onChange={handleChange} value={updateProfileBuyer.full_name} type="text" id="full_name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                    </div>

                    <div className="mb-4 w-full col-span-1">
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input required placeholder='JaneDoe@gmail.com' onChange={handleChange} value={updateProfileBuyer.email} type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                    </div>
                  </div>

                  <div className="mb-6 col-span-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input required onChange={handleChange} type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                  </div>

                  <div className="mb-6 col-span-12">
                    <label className="block text-gray-700 mb-2">No Hp</label>
                    <input required placeholder='0812***' onChange={handleChange} value={updateProfileBuyer.phone_number} type="text" id="phone_number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                  </div>

                  <div className="mb-6 col-span-12">
                    <label className="block text-gray-700 mb-2">Alamat</label>
                    <input required placeholder='Serang' onChange={handleChange} type="text" id="address" value={updateProfileBuyer.address} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#EF7800] text-white col-span-12 py-2 px-4 rounded hover:bg-[#EF7900] transition duration-200 flex justify-center items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Ubah Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center">
            <div className="w-full flex justify-center mb-4">
              <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={Image}
                  alt="Profile"
                  className="max-h-1/4 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </main >
      < Footer />
    </div >
  )
}
