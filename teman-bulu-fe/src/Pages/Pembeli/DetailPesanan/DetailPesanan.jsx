import React, { useEffect, useState } from 'react'
import Header from './../../../Component/Auth/Header';
import Footer from './../../../Component/Auth/Footer';
import dayjs from 'dayjs';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BUYER_SERVICE } from '../../../Services/Buyer';

export default function DetailPesanan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [selectedPaket, setSelectedPaket] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [detailService, setDetailService] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [services, setServices] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchDetailService = async () => {
      try {
        const response = await BUYER_SERVICE.seller(id);
        setDetailService(response.data);
        setAnimals(response.data.animals);
        setServices(response.data.services);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailService();
  }, [])

  const getAvailablePackages = (selectedAnimalId) => {
    if (!selectedAnimalId || !services) return [];

    const selectedAnimalData = animals.find(animal => animal.id == selectedAnimalId);
    if (!selectedAnimalData) return [];
    return services
      .filter(service => service.animal_name === selectedAnimalData.name)
      .map(service => ({
        id: service.id,
        name: service.skill_name,
        price: service.price,
        animal_name: service.animal_name
      }));
  };

  const isPerluTanggalRange = () => {
    if (!selectedPaket) return false;
    const selectedService = services.find(service => service.id == selectedPaket);
    const serviceName = selectedService?.skill_name.toLowerCase();
    return serviceName?.includes('penitipan');
  };

  const totalHari = isPerluTanggalRange()
    ? dayjs(endDate).diff(dayjs(startDate), "day") + 1
    : 1;

  const harga = () => {
    if (!selectedPaket) return 0;
    const selectedService = services.find(service => service.id == selectedPaket);
    if (!selectedService) return 0;

    const basePrice = selectedService.price;
    const days = totalHari > 0 ? totalHari : 1;

    return basePrice * days;
  };

  const handlePesanWithState = async () => {
    if (!validateForm()) return;

    const selectedService = services.find(service => service.id == selectedPaket);
    const startEpoch = new Date(startDate).getTime() / 1000;
    const endEpoch = new Date(isPerluTanggalRange() ? endDate : startDate).getTime() / 1000;

    const orderData = {
      servicesId: selectedService?.id,
      start_dt: startEpoch,
      end_dt: endEpoch,
      address: address,
      animalName: selectedService?.animal_name,
      paket: selectedService?.skill_name,
      price: harga(),
    };

    try {
      const response = await BUYER_SERVICE.order({
        service_id: orderData.servicesId,
        start_dt: orderData.start_dt,
        end_dt: orderData.end_dt,
        address: orderData.address,
        total_price: orderData.price
      });

      navigate('/konfirmasi-pembayaran', { state: { ...orderData, responseData: response.data.insertId } });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }

  };
  // address: address,

  // const orderData = {
  //   serviceId: selectedPaket,
  //   sellerId: detailService?.seller?.id,
  //   animalId: selectedAnimal,
  //   paketId: selectedPaket, // ID paket (sama dengan serviceId)
  //   price: selectedService?.price, // Harga dari service
  //   tanggalMulai: startDate,
  //   tanggalSelesai: isPerluTanggalRange() ? endDate : startDate,
  //   address: document.getElementById('address').value // Ambil alamat dari textarea
  // };

  const validateForm = () => {
    if (!selectedAnimal || !selectedPaket || !startDate) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return false;
    }

    if (isPerluTanggalRange() && !endDate) {
      alert('Mohon pilih tanggal selesai untuk paket penitipan');
      return false;
    }

    if (isPerluTanggalRange() && dayjs(endDate).isBefore(dayjs(startDate))) {
      alert('Tanggal selesai tidak boleh sebelum tanggal mulai');
      return false;
    }

    return true;
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <section className="flex flex-grow flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto">
        {/* LEFT SECTION - Profile */}
        {detailService && detailService.seller ? (
          <div className="flex flex-col items-center text-center w-full md:w-1/3">
            <img
              src="https://placehold.co/200x200" // Ganti dengan gambar aslimu
              alt="Profile"
              className="rounded-lg w-48 h-48 object-cover"
            />
            <h2 className="text-lg font-semibold mt-4">{detailService?.seller?.full_name}</h2>
            <p className="text-sm text-gray-500">{detailService?.seller?.description}</p>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              ⭐ <span className="ml-1">{detailService?.seller?.average_rating}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-500 text-sm">Data seller tidak tersedia</p>
          </div>
        )}

        {/* RIGHT SECTION - Pemesanan */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Pilih Hewan */}
          <div>
            <label htmlFor="animal" className="block text-gray-700 mb-2">
              Hewan (Dropdown)
            </label>
            <select
              id="animal_id"
              name="animal"
              value={selectedAnimal}
              onChange={(e) => {
                setSelectedAnimal(e.target.value);
                setSelectedPaket(""); // Reset paket saat hewan berubah
                setStartDate("");
                setEndDate("");
              }}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="">Pilih Hewan</option>
              {animals?.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pilih Paket */}
          <div>
            <p className="font-semibold">Pilih Paket</p>
            {selectedAnimal ? (
              <div className="flex gap-2 mt-2 flex-wrap">
                {getAvailablePackages(selectedAnimal).map((paket) => (
                  <button
                    key={paket.id}
                    onClick={() => {
                      setSelectedPaket(paket.id);
                      if (!paket.name.toLowerCase().includes('penitipan')) {
                        setStartDate("");
                        setEndDate("");
                      }
                    }}
                    className={`px-4 py-2 border rounded-md font-semibold transition ${selectedPaket == paket.id
                      ? "bg-[#EF7800] text-white border-[#EF7800]"
                      : "hover:bg-orange-100"
                      }`}
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium">{paket.name}</div>
                      <div className="text-xs opacity-75">
                        Rp {paket.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2 text-sm">Pilih hewan terlebih dahulu</p>
            )}
          </div>

          <div>
            <p>Alamat</p>
            <textarea
              name="alamat"
              id="address"
              className='border w-64 rounded-md p-2'
              placeholder='Masukkan Alamat Anda'
              onChange={(e) => setAddress(e.target.value)}
              defaultValue={detailService?.buyer?.address || ''}
            ></textarea>
          </div>

          {/* Pilih Tanggal */}
          <div>
            <p className="font-semibold">Pilih Tanggal</p>
            {isPerluTanggalRange() ? (
              <div className="flex gap-4 mt-2">
                <div>
                  <label className="text-sm font-medium">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="mt-1 p-2 border rounded-md w-full max-w-xs"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tanggal Selesai</label>
                  <input
                    type="date"
                    className="mt-1 p-2 border rounded-md w-full max-w-xs"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <input
                type="date"
                className="mt-2 p-2 border rounded-md w-1/3 max-w-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            )}
          </div>

          {/* Deskripsi Paket */}
          <div>
            <p className="text-lg font-semibold">Deskripsi (Deskripsi Paket Layanan - Hardcode)</p>
            <div className="mt-4 space-y-6 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-orange-600">🛁 Paket A – Grooming di Rumah</p>
                <ul className="list-disc ml-6">
                  <li>Mandi</li>
                  <li>Potong kuku</li>
                  <li>Pembersihan telinga</li>
                  <li>Pembersihan kandang</li>
                  <li>Dog walking (khusus anjing) selama 30 menit</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-green-600">🌿 Paket B – Penitipan</p>
                <ul className="list-disc ml-6">
                  <li>Kandang nyaman</li>
                  <li>Makanan & minuman</li>
                  <li>Pembersihan kandang</li>
                  <li>Waktu bermain & aktivitas ringan</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-pink-500">✂️ Paket C – Grooming di Tempat</p>
                <ul className="list-disc ml-6">
                  <li>Mandi</li>
                  <li>Potong kuku</li>
                  <li>Pembersihan telinga</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">❤️ Paket D – Grooming & Penitipan</p>
                <ul className="list-disc ml-6">
                  <li>Kombinasi lengkap layanan Paket B + Paket C</li>
                  <li>Cocok untuk Anda yang ingin menitipkan sekaligus merawat hewan kesayangan dengan layanan terbaik</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Total dan Tombol */}
          {/* HARGA AKAN BERUBAH UBAH, DAN BUTTON AKAN MENGARAH KE HALAMAN PEMBAYARAN DAN DAFTAR TRANSAKSI */}
          <div className="text-xl font-semibold mt-4">
            Total Harga:{" "}
            <span className="text-[#EF7800]">Rp {harga().toLocaleString()}</span>
            {isPerluTanggalRange() && totalHari > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                ({totalHari} hari × harga per hari)
              </p>
            )}
          </div>

          <button
            onClick={handlePesanWithState}
            className="w-full md:w-auto bg-[#EF7800] text-white py-3 px-6 rounded-md font-semibold hover:bg-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!selectedAnimal || !selectedPaket || !startDate || (isPerluTanggalRange() && !endDate)}
          >
            PESAN
          </button>
        </div>
      </section >
      <Footer />
    </div >
  )
}
