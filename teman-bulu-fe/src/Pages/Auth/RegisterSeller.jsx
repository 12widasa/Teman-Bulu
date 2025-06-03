import React, { useEffect, useState } from 'react'
import ModalOpen from '../../Component/Auth/ModalOpen';
import Header from './../../Component/Auth/Header';
import Footer from './../../Component/Auth/Footer';
import Image from './../../assets/auth-image.jpg';
import { ChevronDown, CircleAlert, Loader2, X } from 'lucide-react';
import { AUTH_SERVICE } from '../../Services/Auth';

export default function RegisterSeller() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [registerSellerAuth, setRegisterSellerAuth] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
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

  const handleAnimalSelect = (animal) => {
    setSelectedAnimals(prev => {
      const isAlreadySelected = prev.some(item => item.id === animal.id);

      if (isAlreadySelected) {
        return prev.filter(item => item.id !== animal.id);
      } else {
        return [...prev, animal];
      }
    });
  };

  const removeAnimal = (animalId) => {
    setSelectedAnimals(prev => prev.filter(item => item.id !== animalId));
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
      const animalIds = selectedAnimals.map(animal => animal.id);
      console.log(registerSellerAuth);
      console.log(animalIds);
      await AUTH_SERVICE.registerSeller({ ...registerSellerAuth, animal_ids: animalIds });
      setIsSubmitting(false);
      setShowModal(true);
    } catch (error) {
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
                  <label className="block text-gray-700 mb-2">
                    Hewan (Multi Select)
                  </label>

                  <div className="relative">
                    <div
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer bg-white flex flex-wrap items-center gap-1"
                    >
                      {selectedAnimals.length === 0 ? (
                        <span className="text-gray-500">Pilih Hewan</span>
                      ) : (
                        selectedAnimals.map(animal => (
                          <span
                            key={animal.id}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                          >
                            {animal.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAnimal(animal.id);
                              }}
                              className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      )}

                      <ChevronDown
                        className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        size={16}
                      />
                    </div>

                    {isOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {animals.map(animal => {
                          const isSelected = selectedAnimals.some(item => item.id === animal.id);
                          return (
                            <div
                              key={animal.id}
                              onClick={() => handleAnimalSelect(animal)}
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${isSelected ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => { }}
                                className="pointer-events-none"
                              />
                              {animal.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
                  />
                  <span className="bg-gray-500 cursor-pointer text-white px-4 py-2 whitespace-nowrap">Choose</span>
                  <span className="flex-grow bg-white px-4 py-2 text-gray-600 truncate">{filesName.certificate || 'Pilih Sertifikat'}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EF7800] text-white py-2 px-4 rounded hover:bg-[#EF7900] transition duration-200 flex justify-center items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Daftar'
                  )}
                </button>

                <div className='mt-4 flex items-center gap-4 border border-gray-100 shadow-2xl p-4'>
                  <span className='text-[#EF7800]'><CircleAlert size={40} /> </span>
                  <div className='flex flex-col'>
                    <span>
                      Setelah daftar, silahkan menghubungi Link WA berikut untuk Verifikasi dan melanjutkan ke tahap interview
                    </span>
                    <span>Link WA : ...</span>
                  </div>
                </div>
              </form>

              <ModalOpen
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                link="http://wa.me/..."
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="h-72 md:h-full rounded justify-center relative">
              <img src={Image} alt="" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
