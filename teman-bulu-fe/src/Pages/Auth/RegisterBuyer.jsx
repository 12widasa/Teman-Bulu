import React, { useState } from 'react'
import { Loader2 } from 'lucide-react';
import Header from './../../Component/Auth/Header';
import Footer from './../../Component/Auth/Footer';
import Image from './../../assets/auth-image.jpg';
import ModalOpen from '../../Component/Auth/ModalOpen';
import { AUTH_SERVICE } from '../../Services/Auth';

export default function RegisterBuyer() {
  const [showModal, setShowModal] = useState(false);
  const [registerBuyerAuth, setRegisterBuyerAuth] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (e) => {
    const { id, value } = e.target;
    setRegisterBuyerAuth((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await AUTH_SERVICE.registerBuyer({ full_name: registerBuyerAuth.full_name, email: registerBuyerAuth.email, password: registerBuyerAuth.password })
      setIsSubmitting(false);
      setShowModal(true);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || 'Jangan Salah Mbok an.';
      alert(errorMessage);
      // console.error('Error detail:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <!-- Header --> */}
      <Header />
      {/* <!-- Main Content --> */}
      <main className="flex-grow container mx-auto py-12 mb-6 md:px-4 lg:px-4 px-4">
        <div className="flex">
          {/* <!-- Login Form --> */}
          <div className="w-full md:w-1/2">
            <div className="pr-8">
              <h2 className="text-2xl font-bold mb-4">Daftar</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                  <input required type="text" onChange={handleChange} id="full_name" value={registerBuyerAuth.full_name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input required type="email" onChange={handleChange} id="email" value={registerBuyerAuth.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input required type="password" onChange={handleChange} id="password" value={registerBuyerAuth.password} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EF7800] text-white py-2 px-4 rounded hover:bg-[#1d1f1f] transition duration-200 flex justify-center items-center gap-2"
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
