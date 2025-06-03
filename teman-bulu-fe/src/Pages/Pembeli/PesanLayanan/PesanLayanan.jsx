import React, { useEffect, useState } from 'react'
import Header from './../../../Component/Auth/Header';
import RabbitImage1 from './../../../assets/rabbit1.jpg';
import RabbitImage2 from './../../../assets/rabbit2.jpg';
import RabbitImage3 from './../../../assets/rabbit3.jpg';
import Footer from './../../../Component/Auth/Footer';
import { Filter, Funnel, Search, Star } from 'lucide-react';
import { BUYER_SERVICE } from '../../../Services/Buyer';
import { AUTH_SERVICE } from '../../../Services/Auth';
import { useNavigate } from 'react-router-dom';

export default function PesanLayanan() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [sellerServices, setSellerServices] = useState([]);
  const navigate = useNavigate();

  const handleServiceClick = (serviceId) => {
    navigate(`/detail-pesanan/${serviceId}`);
  };

  const ratingOptions = [
    { label: "5", value: 5 },
    { label: ">4", value: 4 },
    { label: ">3", value: 3 },
    { label: ">2", value: 2 },
    { label: ">1", value: 1 },
    { label: "Belum Ada Rating", value: "none" },
  ];

  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await AUTH_SERVICE.listAnimal();
        setAnimals(response.data);
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAnimal();
  }, []);

  useEffect(() => {
    const fetchSellerServices = async () => {
      try {
        const response = await BUYER_SERVICE.sellerServices();
        setSellerServices(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSellerServices();
  }, [])

  const resetFilter = async () => {
    try {
      const response = await BUYER_SERVICE.sellerServices();
      setSellerServices(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFilter = async () => {
    try {
      const params = new URLSearchParams();

      selectedAnimalIds.forEach(id => {
        params.append('animal_ids', id);
      });

      if (selectedRating) {
        params.append('rating', selectedRating);
      }
      const queryString = params.toString();
      const response = await BUYER_SERVICE.filterServices(queryString);
      setSellerServices(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <section className='flex-grow container mx-auto pb-12 md:p-4'>
        <div className='flex flex-col'>
          {/* Search and Filter */}
          <div className="relative mb-4 flex">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Cari berdasarkan nama penyedia jasa..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EF7800]"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
            </div>

            <button onClick={() => setShowFilter(prev => !prev)} className='text-[#EF7800] flex cursor-pointer items-center pl-2'>
              <Funnel strokeWidth={1} size={30} />
            </button>
          </div>
          {showFilter && (
            <div className="mt-2 mb-12">
              <p className='text-2xl pb-2 font-semibold'>Pilih Hewan</p>
              <div className='space-x-2 mt-4 flex flex-wrap gap-2'>
                {animals.map(({ id, name }) => {
                  const isSelected = selectedAnimalIds.includes(id);
                  return (
                    <span
                      key={id}
                      onClick={() => {
                        setSelectedAnimalIds((prev) =>
                          isSelected ? prev.filter((item) => item !== id) : [...prev, id] // remove and add id
                        );
                      }}
                      className={`px-4 py-2 rounded-md cursor-pointer font-medium ${isSelected
                        ? 'bg-[#EF7800] text-white'
                        : 'border border-[#EF7800] text-[#EF7800] hover:bg-[#ef7800] hover:text-white'
                        }`}
                    >
                      {name}
                    </span>
                  );
                })}

              </div>
              <p className='text-2xl pt-4 pb-2 font-semibold'>Pilih Rating</p>
              <div className='space-x-2 mt-4 flex flex-wrap'>
                {ratingOptions.map((option) => {
                  const isSelected = selectedRating === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSelectedRating(
                          selectedRating === option.value ? null : option.value
                        )
                      }
                      className={`flex items-center gap-1 border rounded-md px-3 py-2 text-sm font-medium transition-all
                        ${isSelected
                          ? "bg-[#EF7800] text-white border-[#EF7800]"
                          : "text-[#EF7800] border-[#EF7800] hover:bg-[#ef7800] hover:text-white"
                        }`}
                    >
                      <span>{option.label}</span>
                      {option.value !== "none" && (
                        <Star size={16} fill={isSelected ? "white" : "#EF7800"} strokeWidth={1.5} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className='space-x-4 pt-6'>
                <button onClick={() => {
                  setSelectedAnimalIds([]);
                  setSelectedRating('');
                  resetFilter();
                }}
                  className='text-[#EF7800] border border-[#EF7800] hover:bg-[#ef7800] hover:text-white rounded w-1/4'>
                  <span>Atur Ulang</span>
                </button>

                <button onClick={handleFilter} className='text-[#EF7800] border border-[#EF7800] hover:bg-[#ef7800] hover:text-white rounded w-1/4'><span>Terapkan Filter</span></button>
              </div>
            </div>
          )}
          <div className='flex'>
            <p className='text-3xl pb-6 font-semibold'>Pesan Layanan</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {sellerServices.map((service, id) => (
              <div key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="w-[calc(20%-0.8rem)] bg-white rounded-lg overflow-hidden cursor-pointer">
                <div className="aspect-[6/4] overflow-hidden">
                  <img src={service.profile} alt={`Service ${id + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-1">{service.full_name}</h3>
                  <p className="text-sm text-gray-600 mb-3 overflow-y-auto h-14">{service.description}</p>
                  {service.average_rating && (
                    <div className='flex items-center gap-4'>
                      <Star className='text-gray-600' size={18} />
                      <p className='text-gray-600'>{service.average_rating}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section >
      <Footer />
    </div >
  )
}
