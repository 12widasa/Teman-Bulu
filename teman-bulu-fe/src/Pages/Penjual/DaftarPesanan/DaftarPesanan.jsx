import React, { useState, useEffect } from 'react'
import Header from './../../../Component/Auth/Header';
import Footer from '../../../Component/Auth/Footer';
import { ArrowLeft, Calendar, Package, Phone, Star, User, X } from 'lucide-react';
import DogImage from '../../../assets/dog1.jpg';
import { SELLER_SERVICE } from '../../../Services/Seller';

export default function DaftarPesanan() {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [sellerOrders, setSellerOrders] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        setIsLoading(true);
        // Ganti dengan API service yang sesuai
        const response = await SELLER_SERVICE.sellerOrders();
        setSellerOrders(response.data);
        console.log('Seller Orders:', response.data);
      } catch (error) {
        console.error('Error fetching seller orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  // Function to filter orders by status
  const getOrdersByStatus = (status) => {
    if (!sellerOrders.orders) return [];
    return sellerOrders.orders.filter(order => order.status === status);
  };

  // Function to format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Function to format price
  const formatPrice = (price) => {
    return price?.toLocaleString('id-ID');
  };

  // Function to handle complete order (for seller)
  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await SELLER_SERVICE.updateStatus({ order_id: orderId });

      if (response.status === "success") {
        const updatedOrders = await SELLER_SERVICE.sellerOrders();
        setSellerOrders(updatedOrders.data);
      } else {
        alert('Gagal menyelesaikan pesanan: ' + response.message);
      }

    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setSelectedOrderId(null);
    setRating(0);
    setHoverRating(0);
    setFeedback('');
  };

  // Component untuk render status badge
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

  // Component untuk render order card
  const OrderCard = ({ order, showCompleteButton = false }) => (
    <div key={order.id} className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
      {/* Pet Image */}
      <div className="relative">
        <img
          src={DogImage}
          alt="Pet grooming service"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Order Header */}
        <div className='flex items-center mb-4 justify-between'>
          <h2 className="text-xl font-bold text-gray-800">{order.animal_name}</h2>
          <StatusBadge status={order.status} />
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">Pembeli:</span><span className='font-bold'> {order.buyer_full_name}</span>
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">Tanggal:</span><span className='font-bold'> {formatDate(order.start_dt)} - {formatDate(order.end_dt)}</span>
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">Paket:</span> <span className='font-bold'> {order.skill_name}</span>
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">Address:</span> <span className='font-bold'> {order.address}</span>
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <span className="text-sm">
              <span className="font-medium">No Hp:</span> <span className='font-bold'> {order.buyer_phone_number}</span>
            </span>
          </div>

          {order.rating && (
            <div className="flex items-center text-gray-600">
              <span className="text-sm">
                <span className="font-medium">Rating:</span> {order.rating}/5 ⭐
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="space-y-1">
            <span className="text-lg font-bold text-gray-800">Rp. {formatPrice(order.total_price)}</span>
            {/* {order.total_price && (
              <div className="text-sm text-gray-600">
                Total: Rp. {formatPrice(order.total_price)}
              </div>
            )} */}
          </div>
        </div>

        {/* Action Button */}
        {showCompleteButton && (
          <button
            className="w-full bg-[#EF7800] hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            onClick={() => handleCompleteOrder(order.id)}
          >
            Selesaikan Pesanan
          </button>
        )}
      </div>
    </div>
  );

  const selectedOrder = sellerOrders.orders?.find(order => order.id === selectedOrderId);

  if (isLoading) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='container flex-grow mx-auto justify-center w-full px-4 py-8'>
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='container flex-grow mx-auto justify-center w-full px-4 py-8'>
        <section className='flex flex-col'>
          <h2 className="text-2xl font-semibold mb-6">Status Pemesanan</h2>
          <div className='flex flex-row w-full gap-6 h-32'>
            <div className='flex flex-col justify-center items-center w-1/3 bg-red-200 rounded-md'>
              <p className='text-2xl'>Belum Bayar</p>
              <p className='text-2xl pt-2'>{sellerOrders.akan_berlangsung || 0}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-1/3 bg-yellow-200 rounded-md'>
              <p className='text-2xl'>Berlangsung</p>
              <p className='text-2xl pt-2'>{sellerOrders.berlangsung || 0}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-1/3 bg-green-200 rounded-md'>
              <p className='text-2xl'>Selesai</p>
              <p className='text-2xl pt-2'>{sellerOrders.selesai || 0}</p>
            </div>
          </div>
        </section>

        {/* SECTION CARD BELUM BAYAR (Status 0) */}
        <section className='flex flex-col mt-8'>
          <h2 className="text-xl font-semibold mb-6">Belum Bayar</h2>

          <div className="flex flex-row gap-4 overflow-x-auto p-2">
            {getOrdersByStatus(0).length > 0 ? (
              getOrdersByStatus(0).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-gray-500">Tidak ada pesanan yang belum dibayar</div>
            )}
          </div>
        </section>

        {/* SECTION CARD BERLANGSUNG (Status 1) */}
        <section className='flex flex-col mt-8'>
          <h2 className="text-xl font-semibold mb-6">Berlangsung</h2>

          <div className="flex flex-row gap-4 overflow-x-auto p-2">
            {getOrdersByStatus(1).length > 0 ? (
              getOrdersByStatus(1).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showCompleteButton={true}
                />
              ))
            ) : (
              <div className="text-gray-500">Tidak ada pesanan yang sedang berlangsung</div>
            )}
          </div>
        </section>

        {/* SECTION CARD SELESAI (Status 2) */}
        <section className='flex flex-col mt-8'>
          <h2 className="text-xl font-semibold mb-6">Selesai</h2>

          <div className="flex flex-row gap-4 overflow-x-auto p-2">
            {getOrdersByStatus(2).length > 0 ? (
              getOrdersByStatus(2).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-gray-500">Tidak ada pesanan yang selesai</div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}