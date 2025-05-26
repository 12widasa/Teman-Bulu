import React, { useEffect, useState } from 'react'
import Header from './../../../Component/Auth/Header';
import Footer from '../../../Component/Auth/Footer';
import { ArrowLeft, Calendar, Package, Phone, Star, User, X } from 'lucide-react';
import DogImage from '../../../assets/dog1.jpg';
import { BUYER_SERVICE } from '../../../Services/Buyer';

export default function DaftarTransaksi() {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBuyerOrder = async () => {
      try {
        setIsLoading(true);
        const response = await BUYER_SERVICE.buyerOrders();
        setBuyerOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching buyer order:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBuyerOrder();
  }, []);

  const getOrdersByStatus = (status) => {
    if (!buyerOrders.orders) return [];
    return buyerOrders.orders.filter(order => order.status === status);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const handlePayment = async (orderId, price) => {
    try {
      console.log('Processing payment for order:', orderId, 'Amount:', price);

      // Template untuk API call payment
      // const paymentData = {
      //   order_id: orderId,
      //   amount: price,
      //   payment_method: 'selected_method', // bisa dari state atau props
      // };

      // const response = await BUYER_SERVICE.payOrder({order_id: orderId});

      // if (response.success) {
      //   alert('Pembayaran berhasil!');
      //   // Refresh data setelah pembayaran berhasil
      //   const updatedOrders = await BUYER_SERVICE.buyerOrders();
      //   setBuyerOrders(updatedOrders.data);
      // } else {
      //   alert('Pembayaran gagal: ' + response.message);
      // }

      // Untuk sementara, tampilkan alert
      alert(`Processing payment for Order ID: ${orderId} - Amount: Rp. ${formatPrice(price)}`);

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    }
  };



  const formatPrice = (price) => {
    return price?.toLocaleString('id-ID');
  };

  const openRatingModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setSelectedOrderId(null);
    // Reset form saat modal ditutup
    setRating(0);
    setHoverRating(0);
    setFeedback('');
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitRating = async () => {
    try {
      // Template untuk submit rating API
      // const ratingData = {
      //   order_id: selectedOrderId,
      //   rating: rating,
      //   feedback: feedback
      // };

      // const response = await BUYER_SERVICE.submitRating(ratingData);

      console.log('Order ID:', selectedOrderId, 'Rating:', rating, 'Feedback:', feedback);
      alert('Rating berhasil dikirim!');
      closeRatingModal();

      // Refresh data setelah submit rating
      // const updatedOrders = await BUYER_SERVICE.buyerOrders();
      // setBuyerOrders(updatedOrders.data);

    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Terjadi kesalahan saat mengirim rating');
    }
  };

  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case 0:
          return {
            text: 'Belum Bayar',
            bgColor: 'bg-red-200',
            borderColor: 'border-red-600',
            textColor: 'text-red-600'
          };
        case 1:
          return {
            text: 'Berlangsung',
            bgColor: 'bg-yellow-200',
            borderColor: 'border-yellow-600',
            textColor: 'text-yellow-600'
          };
        case 2:
          return {
            text: 'Selesai',
            bgColor: 'bg-green-200',
            borderColor: 'border-green-600',
            textColor: 'text-green-600'
          };
        default:
          return {
            text: 'Unknown',
            bgColor: 'bg-gray-200',
            borderColor: 'border-gray-600',
            textColor: 'text-gray-600'
          };
      }
    };

    const config = getStatusConfig(status);

    return (
      <span className={`text-xs ${config.bgColor} border ${config.borderColor} ${config.textColor} p-1 px-3 rounded-lg`}>
        {config.text}
      </span>
    );
  };

  const OrderCard = ({ order, showPaymentButton = false, showCompletedButton = false }) => (
    <div key={order.order_id} className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
      {/* Pet Image */}
      <div className="relative">
        <img
          src={DogImage}
          alt="Pet grooming"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Order ID */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">{order.animal_name}</h2>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">Seller Name:</span> {order.seller_name}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">Tanggal:</span> <span className='font-bold'>{formatDate(order.start_dt)} - {formatDate(order.end_dt)}</span>
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">No Hp:</span> <span className='font-bold'>{order.seller_phone_number}</span>
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">Paket:</span> <span className='font-bold'> {order.skill_name}</span>
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="text-xl font-bold text-gray-800">Rp. {formatPrice(order.total_price)}</span>
        </div>

        {/* Action Buttons */}
        {showPaymentButton && (
          <button
            className="w-full bg-[#EF7800] hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            onClick={() => handlePayment(order.order_id, order.price)}
          >
            Bayar Sekarang
          </button>
        )}

        {showCompletedButton && (
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-105"
            onClick={() => openRatingModal(order.order_id)}
          >
            Pesanan Selesai
          </button>
        )}
      </div>
    </div>
  );

  const selectedOrder = buyerOrders.orders?.find(order => order.order_id === selectedOrderId);

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='container flex-grow mx-auto justify-center w-full px-4 py-8'>
        <section className='flex flex-col'>
          <h2 className="text-2xl font-semibold mb-6">Status Pemesanan</h2>
          <div className='flex flex-row w-full gap-6 h-32'>
            <div className='flex flex-col justify-center items-center w-1/3 bg-red-200 rounded-md'>
              <p className='text-2xl'>Belum Bayar</p>
              <p className='text-2xl pt-2'>{buyerOrders.akan_berlangsung}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-1/3 bg-yellow-200 rounded-md'>
              <p className='text-2xl'>Berlangsung</p>
              <p className='text-2xl pt-2'>{buyerOrders.berlangsung}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-1/3 bg-green-200 rounded-md'>
              <p className='text-2xl'>Selesai</p>
              <p className='text-2xl pt-2'>{buyerOrders.selesai}</p>
            </div>
          </div>
        </section>

        {/* SECTION CARD BELUM BAYAR */}
        <section className='flex flex-col mt-8'>
          <h2 className="text-xl font-semibold mb-6">Belum Bayar</h2>

          <div className="flex flex-row gap-4 overflow-x-auto">
            {getOrdersByStatus(0).length > 0 ? (
              getOrdersByStatus(0).map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  showPaymentButton={true}
                />
              ))
            ) : (
              <div className="text-gray-500">Tidak ada pesanan yang belum dibayar</div>
            )}
          </div>
        </section>

        {/* SECTION CARD BERLANGSUNG */}
        <section className='flex flex-col mt-8'>
          <h2 className="text-xl font-semibold mb-6">Berlangsung</h2>

          <div className="flex flex-row gap-4 overflow-x-auto pb-2">
            {getOrdersByStatus(1).length > 0 ? (
              getOrdersByStatus(1).map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                />
              ))
            ) : (
              <div className="text-gray-500">Tidak ada pesanan yang sedang berlangsung</div>
            )}
          </div>
        </section>

        {/* SECTION CARD BERLANGSUNG */}
        <section className='flex flex-col mt-8'>
          <h2 className="text-xl font-semibold mb-6">Selesai</h2>

          <div className="flex flex-row gap-4 overflow-x-auto">
            {getOrdersByStatus(2).length > 0 ? (
              getOrdersByStatus(2).map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  showCompletedButton={true}
                />
              ))
            ) : (
              <div className="text-gray-500">Tidak ada pesanan yang selesai</div>
            )}

            {/* Rating Modal */}
            {isRatingModalOpen && selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                {/* Modal Content */}
                <div className="bg-white rounded-2xl shadow-2xl max-h-screen overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                      <button
                        onClick={closeRatingModal}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <ArrowLeft size={20} className="text-gray-700" />
                      </button>
                      <h1 className="text-xl font-bold text-gray-800">Penilaian Pesanan</h1>
                    </div>

                    <button
                      onClick={closeRatingModal}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex gap-6 flex-col lg:flex-row">
                      {/* Left Side - Order Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={DogImage}
                          alt="Pet grooming service"
                          className="w-full lg:w-48 h-36 object-cover rounded-lg"
                        />
                      </div>

                      {/* Middle - Order Details */}
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Order #{selectedOrder.order_id}</h2>

                        <div className="space-y-2 text-gray-600">
                          <div className="flex">
                            <span className="font-medium w-24">Service ID:</span>
                            <span>{selectedOrder.service_id}</span>
                          </div>

                          <div className="flex">
                            <span className="font-medium w-24">Tanggal:</span>
                            <span>{formatDate(selectedOrder.start_dt)} - {formatDate(selectedOrder.end_dt)}</span>
                          </div>

                          <div className="flex">
                            <span className="font-medium w-24">Alamat:</span>
                            <span>{selectedOrder.address}</span>
                          </div>

                          <div className="flex">
                            <span className="font-medium w-24">Seller ID:</span>
                            <span>{selectedOrder.seller_id}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <span className="text-xl font-bold text-gray-800">Rp. {formatPrice(selectedOrder.price)}</span>
                        </div>
                      </div>

                      {/* Right Side - Rating Section */}
                      <div className="flex-shrink-0 w-full lg:w-72 bg-gray-50 rounded-lg p-6">
                        {/* Status Badge */}
                        <div className="mb-4">
                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                            Selesai
                          </span>
                        </div>

                        {/* Service Quality */}
                        <div className="mb-6">
                          <h3 className="font-bold text-gray-800 mb-3">Beri Nilai Layanan</h3>

                          {/* Star Rating */}
                          <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => handleRatingHover(star)}
                                onMouseLeave={handleRatingLeave}
                                className="transition-colors duration-200"
                              >
                                <Star
                                  size={24}
                                  className={`${star <= (hoverRating || rating)
                                    ? 'fill-orange-400 text-orange-400'
                                    : 'text-gray-300'
                                    }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Feedback Section */}
                        <div className="mb-6">
                          <h3 className="font-bold text-gray-800 mb-3">Kritik dan Saran</h3>
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Masukkan kritik dan saran anda"
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={closeRatingModal}
                            className="flex-1 bg-white border border-orange-500 text-orange-500 py-3 px-4 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            onClick={handleSubmitRating}
                            className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                          >
                            Nilai
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
