import React, { useEffect, useState } from 'react'
import Header from '../../../Component/Auth/Header';
import Footer from '../../../Component/Auth/Footer';
import Image from '../../../assets/kuceng.jpg';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { AUTH_SERVICE } from '../../../Services/Auth';
import { SELLER_SERVICE } from './../../../Services/Seller';

export default function ProfileSeller() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [updateProfileSeller, setUpdateProfileSeller] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    birth: '',
    phone_number: '',
    address: '',
    description: '',
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

    // Untuk input file
    if (type === 'file') {
      const file = files[0];
      if (file) {
        try {
          const base64 = await convertBase64(file);
          setUpdateProfileSeller(prev => ({
            ...prev,
            [id]: base64,
          }));
          setFilesName(prev => ({
            ...prev,
            [id]: file.name,
          }));
        } catch (err) {
          console.error(`Gagal konversi ${id} ke base64`, err);
        }
      }
    }
    else {
      setUpdateProfileSeller(prev => ({
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
    const fetchData = async () => {
      try {
        const [animalRes, profileRes] = await Promise.all([
          AUTH_SERVICE.listAnimal(),
          SELLER_SERVICE.getProfile(),
        ]);

        setAnimals(animalRes.data);

        console.log(profileRes.data[0].full_name);

        if (profileRes.data) {
          const profileData = profileRes.data;
          console.log(profileData);
          setUpdateProfileSeller({
            full_name: profileData[0].full_name || '',
            email: profileData[0].email || '',
            birth: profileData[0].birth || '',
            phone_number: profileData[0].phone_number || '',
            address: profileData[0].address || '',
            description: profileData[0].description || '',
            cv: profileData[0].cv || '',
            certificate: profileData[0].certificate || '',
            profile: profileData[0].profile || '',
          });
          setIsOnline(profileData[0].status);
          // Handle selected animals 
          if (profileData[0].animal_ids) {
            const selected = animalRes.data.filter(animal =>
              profileData.animal_ids.includes(animal.id)
            );
            setSelectedAnimals(selected);
          }
        }
      } catch (err) {
        console.error('Gagal ambil data:', err);
      }
    }

    fetchData();
  }, []);

  const handleUpdateProfileSeller = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const animalIds = selectedAnimals.map(animal => animal.id);
      console.log(updateProfileSeller);
      console.log(animalIds);
      await SELLER_SERVICE.updateProfileSeller({ ...updateProfileSeller, animal_ids: animalIds });
      setIsSubmitting(false);
      setShowModal(true);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };

  // 0 untuk offline 1 untuk online
  const [isOnline, setIsOnline] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    const newStatus = isOnline === 1 ? 0 : 1;
    updateStatusAPI(newStatus);
  };

  const updateStatusAPI = async (status) => {
    try {
      setIsLoading(true);
      const response = await SELLER_SERVICE.changeStatus({ status });

      if (response.status === "success") {
        setIsOnline(status);
        console.log('Status berhasil diupdate:', response);
      } else {
        throw new Error('Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setIsOnline(!status);
      alert('Gagal mengupdate status. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
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
              <form onSubmit={handleUpdateProfileSeller}>
                <div className='flex justify-between space-x-4'>
                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      required
                      id="full_name"
                      type="text"
                      value={updateProfileSeller.full_name || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      required
                      placeholder='JohnDoe@gmail.com'
                      onChange={handleChange}
                      type="email"
                      value={updateProfileSeller.email || ''}
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <div className='flex justify-between space-x-4'>
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      required
                      onChange={handleChange}
                      type="password"
                      id="password"
                      value={updateProfileSeller.password || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 mb-2">
                      Hewan
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

                      {/* Dropdown Options */}
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
                                  onChange={() => { }} // Handled by parent onClick
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
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Tempat, Tanggal Lahir</label>
                  <input required placeholder='Serang, 01 Januari 2000' onChange={handleChange} type="text" value={updateProfileSeller.birth} id="birth" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">No, Handphone</label>
                  <input required placeholder='0812*****' onChange={handleChange} type="text" value={updateProfileSeller.phone_number} id="phone_number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Alamat</label>
                  <input required placeholder='Korea' onChange={handleChange} type="text" value={updateProfileSeller.address} id="address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Keterangan</label>
                  <textarea required placeholder='Saya memiliki jasa grooming yang sangat handal dan memiliki pengalaman selama 5 tahun.' onChange={handleChange} type="text" value={updateProfileSeller.description} id="description" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></textarea>
                </div>

                <div className="relative flex w-full mb-6 max-w-lg overflow-hidden border cursor-pointer border-gray-300 rounded">
                  <input
                    type="file"
                    id="profile"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                    'Update'
                  )}
                </button>
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

            {/* Status + Slider */}
            <div className="w-full flex">
              <div className='pr-6'>
                <p className="text-2xl font-bold">Status Saya</p>
                <p className="mb-4">Kondisi Ketersediaan Jasa</p>
              </div>
              <div className="flex justify-center">
                <div
                  className={`relative inline-flex items-center h-12 rounded-full cursor-pointer transition-all duration-300 ${isOnline ? "w-36 bg-green-500" : "w-36 bg-red-500"
                    } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={!isLoading ? handleToggle : undefined}
                >
                  {/* Text Label */}
                  {isOnline ? (
                    <span className="absolute left-5 text-white font-semibold text-sm z-10">
                      Online
                    </span>
                  ) : (
                    <span className="absolute right-5 text-white font-semibold text-sm z-10">
                      Offline
                    </span>
                  )}

                  {/* Slider Button */}
                  <div
                    className={`absolute w-10 h-10 bg-white rounded-full shadow-lg transition-transform duration-300 top-1 ${isOnline ? "translate-x-24" : "translate-x-2"
                      }`}
                  >
                    {isLoading && (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div >
      </main >

      < Footer />
    </div >
  )
}
