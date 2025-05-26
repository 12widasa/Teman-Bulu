import React, { useEffect, useState } from 'react'
import Header from './../../../Component/Auth/Header';
import Footer from './../../../Component/Auth/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { BUYER_SERVICE } from '../../../Services/Buyer';

export default function Pembayaran() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Cek apakah ada data state yang dikirim
    if (location.state) {
      setOrderData(location.state);
      console.log('Data pesanan:', location.state);
    } else {
      // Jika tidak ada data state, redirect ke halaman sebelumnya
      console.log('Tidak ada data pesanan');
      navigate(-1); // atau navigate('/') untuk ke home
    }
  }, [location.state, navigate]);

  const paymentData = {
    servicesId: orderData?.servicesId,
    paket: orderData?.paket,
    animalName: orderData?.animalName,
    start_dt: orderData?.start_dt,
    end_dt: orderData?.end_dt,
    price: orderData?.price,
    address: orderData?.address,
    orderId: orderData?.responseData,
  };

  console.log(paymentData);

  const handlePembayaran = async () => {
    if (!paymentMethod) {
      alert("Silakan pilih metode pembayaran.");
      return;
    }

    const orderId = orderData?.responseData;
    try {
      const response = await BUYER_SERVICE.payOrder({ order_id: orderId });
      return response.data;
    } catch (error) {
      console.log(error);
    }

    openModal();
  };

  // const dataPesanan = {
  //   hewan: "Kucing",
  //   paket: "Paket A",
  //   lokasi: "Jakarta",
  //   startDate: "2023-08-01",
  //   endDate: "2023-08-05",
  //   total: 10000,
  // };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Body */}
            <div className="p-8 text-center">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Pembayaran Berhasil
              </h2>

              {/* Illustration */}
              {/* <ChevronDown size={24} /> */}

              {/* Message */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Silahkan tunggu petugas yang akan datang kerumahmu
                <br />
                Salam Teman Bulu 🐾
              </p>

              {/* Action Button */}
              <button
                onClick={closeModal}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 ease-in-out transform hover:scale-105"
              >
                Lihat Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
      <main className='flex-grow container flex flex-col mx-auto justify-center w-full px-4 py-8'>
        <h2 className="text-xl font-semibold mb-6">Ringkasan Pemesanan</h2>

        <div className="grid grid-cols-3 gap-6">
          {/* Kartu Ringkasan */}
          <div className="md:col-span-2 col-span-3 border rounded-lg p-6">
            <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700 mb-6">
              <div>
                <p className="font-semibold">Jenis Hewan</p>
                <p>{paymentData.animalName}</p>
              </div>
              <div>
                <p className="font-semibold">Pilihan Paket</p>
                <p>{paymentData.paket}</p>
              </div>
              <div>
                <p className="font-semibold">Lokasi</p>
                <p>{paymentData.address}</p>
              </div>
              <div>
                <p className="font-semibold">Tanggal</p>
                <p>
                  {paymentData.start_dt} - {paymentData.end_dt}
                </p>
              </div>
              {/* <div className="col-span-2 text-gray-500 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras semper vestibulum pretium.
              </div> */}
            </div>

            <hr className="my-4" />

            {/* Total + Tombol Bayar */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Total</p>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-[#EF7800]">Rp {paymentData.price?.toLocaleString("id-ID")}</p>
                <button
                  onClick={handlePembayaran}
                  className="bg-[#EF7800] text-white px-6 py-2 rounded-md hover:bg-orange-500 font-semibold"
                >
                  BAYAR
                </button>
              </div>
            </div>
          </div>

          {/* Pilihan Pembayaran */}
          <div className="border md:col-span-1 col-span-3 rounded-lg p-6 h-fit">
            <p className="font-semibold mb-4">Pilihan Pembayaran</p>
            <div className="flex flex-col gap-3">
              {["Tunai", "Gopay - 08128318238", "Transfer Bank BCA - 12344566"].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    onChange={() => setPaymentMethod(method)}
                    checked={paymentMethod === method}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
