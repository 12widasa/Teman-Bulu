import React, { useEffect, useState } from 'react'
import ModalOpen from '../../Component/Auth/ModalOpen';
import Header from './../../Component/Auth/Header';
import Footer from './../../Component/Auth/Footer';
import Image from './../../assets/auth-image.jpg';
import { Loader2 } from 'lucide-react';
import { AUTH_SERVICE } from '../../Services/Auth';

export default function RegisterSeller() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [registerSellerAuth, setRegisterSellerAuth] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    animal_id: '',
    birth: '',
    phone_number: '',
    address: '',
    cv: "",
    certificate: "",
    profile: ""
  });
  const [filesName, setFilesName] = useState({
    cv: "",
    certificate: "",
    profile: ""
  });

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if (file) {
        fileReader.readAsDataURL(file);
      }
      fileReader.onload = (() => {
        resolve(fileReader.result);
      });
      fileReader.onerror = (() => {
        reject(error);
      });
    })
  }

  const handleChange = async (e) => {
    const { id, files, type, value } = e.target;
    if (type === 'file') {
      console.log(files)
      const file = files[0];
      if (file) {
        try {
          const base64 = await convertBase64(file);
          setRegisterSellerAuth((prev) => ({
            ...prev,
            [id]: base64,
          }));
          setFilesName((prev) => ({
            ...prev,
            [id]: file.name,
          }));
        } catch (err) {
          console.error(`Gagal konversi ${id} ke base64`, err);
        }
      }
    } else {
      setRegisterSellerAuth((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  useEffect(() => {
    async function fetchAnimal() {
      try {
        const response = await AUTH_SERVICE.listAnimal();
        setAnimals(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAnimal();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      console.log(registerSellerAuth);
      await AUTH_SERVICE.registerSeller({ ...registerSellerAuth, animal_id: parseInt(registerSellerAuth.animal_id) });
      setIsSubmitting(false);
      setShowModal(true);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <!-- Header --> */}
      <Header />
      {/* <!-- Main Content --> */}
      <main className="flex-grow container mx-auto py-12 mb-6">
        <div className="flex">
          {/* <!-- Register Form --> */}
          <div className="w-full md:w-1/2">
            <div className="pr-8">
              <h2 className="text-2xl font-bold mb-4">Daftar</h2>
              <form onSubmit={handleRegisterSubmit}>
                <div className='flex justify-between space-x-4'>
                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                    <input required placeholder='John Doe' onChange={handleChange} type="text" id="full_name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input required placeholder='John Doe' onChange={handleChange} type="text" id="username" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                  </div>
                </div>

                <div className='flex justify-between space-x-4'>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input required onChange={handleChange} type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input required placeholder='***' onChange={handleChange} type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="animal" className="block text-gray-700 mb-2">
                    Hewan (Dropdown)
                  </label>
                  <select
                    id="animal_id"
                    name="animal"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="">Pilih Hewan</option>
                    {animals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Tempat, Tanggal Lahir</label>
                  <input required placeholder='Serang, 01 Januari 2000' onChange={handleChange} type="text" id="birth" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">No, Handphone</label>
                  <input required placeholder='0812*****' onChange={handleChange} type="text" id="phone_number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Alamat</label>
                  <input required placeholder='Korea' onChange={handleChange} type="text" id="address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="relative flex w-full mb-6 max-w-lg overflow-hidden border cursor-pointer border-gray-300 rounded">
                  <input
                    type="file"
                    id="profile"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  // onChange={handleFileChange}
                  />
                  <span className="bg-gray-500 cursor-pointer text-white px-4 py-2 whitespace-nowrap">Choose</span>
                  <span className="flex-grow bg-white px-4 py-2 text-gray-600 truncate">{filesName.profile || 'Pilih Profile'}</span>
                </div>

                <div className="relative flex w-full mb-6 max-w-lg overflow-hidden border border-gray-300 rounded">
                  <input
                    type="file"
                    id="cv"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  // onChange={handleFileChange}
                  />
                  <span className="bg-gray-500 cursor-pointer text-white px-4 py-2 whitespace-nowrap">Choose</span>
                  <span className="flex-grow bg-white px-4 py-2 text-gray-600 truncate">{filesName.cv || 'Pilih CV'}</span>
                </div>

                <div className="relative flex w-full mb-6 max-w-lg overflow-hidden border border-gray-300 rounded">
                  <input
                    type="file"
                    id="certificate"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  // onChange={handleFileChange}
                  />
                  <span className="bg-gray-500 cursor-pointer text-white px-4 py-2 whitespace-nowrap">Choose</span>
                  <span className="flex-grow bg-white px-4 py-2 text-gray-600 truncate">{filesName.certificate || 'Pilih Sertifikat'}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded hover:bg-[#1d1f1f] transition duration-200 flex justify-center items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>

              <ModalOpen
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                link="ini linknya"
              />
            </div>
          </div>

          {/* <!-- Image Placeholder --> */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="h-72 md:h-full rounded justify-center relative">
              <img src={Image} alt="" />
            </div>
          </div>
        </div>
      </main>

      {/* <!-- Footer --> */}
      <Footer />
    </div>
  )
}
