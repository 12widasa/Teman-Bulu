import React, { useState } from 'react'
import { Facebook, Instagram, Linkedin, Loader2, Twitter, Youtube } from 'lucide-react';
import Header from './../../Component/Auth/Header';
import Footer from './../../Component/Auth/Footer';
import DOG5 from './../../assets/dog5.jpg';
import ModalOpen from '../../Component/Auth/ModalOpen';
import { AUTH_SERVICE } from '../../Services/Auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loginAuth, setLoginAuth] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const { id, value } = e.target;
    setLoginAuth((prev) => ({
      ...prev,
      [id]: value,
    }));
  }
  const [isOnline, setIsOnline] = useState(true);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await AUTH_SERVICE.loginUser({
        email: loginAuth.email,
        password: loginAuth.password
      });

      localStorage.setItem('token', response.data.token);
      setShowSuccessModal(true);
      setShowErrorModal(false);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setShowErrorModal(true);
      setShowSuccessModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const handleToggle = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    updateStatusAPI(newStatus);
  };
  const updateStatusAPI = async (status) => {
    try {
      setIsLoading(true);

      // Template API call - ganti dengan endpoint API Anda
      // const response = await fetch('https://api.example.com/user/status', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer YOUR_TOKEN_HERE' // Ganti dengan token Anda
      //   },
      //   body: JSON.stringify({
      //     status: status ? 'online' : 'offline',
      //     timestamp: new Date().toISOString()
      //   })
      // });

      setLastUpdated(new Date().toLocaleTimeString());
      // if (response.ok) {
      //   const data = await response.json();
      //   console.log('Status berhasil diupdate:', data);
      // } else {
      //   throw new Error('Gagal mengupdate status');
      // }
    } catch (error) {
      console.error('Error updating status:', error);
      // Rollback status jika API gagal
      setIsOnline(!status);
      alert('Gagal mengupdate status. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
            <div className="text-green-500 text-4xl mb-2">✓</div>
            <h2 className="text-lg font-semibold mb-4">Berhasil Masuk</h2>
            <p className="text-sm text-gray-600">Mohon tunggu sebentar lagi...</p>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
            <div className="text-red-500 text-4xl mb-2">✕</div>
            <h2 className="text-lg font-semibold mb-4">Gagal Masuk</h2>
            <p className="text-sm text-gray-600">Silahkan Coba Lagi.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {/* <!-- Header --> */}
      <Header />

      {/* <!-- Main Content --> */}
      <main className="flex-grow container mx-auto py-12 mb-6">
        <div className="flex">
          {/* <!-- Login Form --> */}
          <div className="w-full md:w-1/2">
            <div className="pr-8">
              <h2 className="text-2xl font-bold mb-4">Masuk</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input type="email" onChange={handleChange} id="email" value={loginAuth.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input type="password" onChange={handleChange} id="password" value={loginAuth.password} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"></input>
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
              {/* <ModalOpen
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                link="ini linknya"
              /> */}
            </div>
          </div>

          {/* <!-- Image Placeholder --> */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="h-32 overflow-hidden md:h-full rounded justify-center">
              <img src={DOG5} alt="" />
            </div>
          </div>

        </div>
        
      </main>

      {/* <!-- Footer --> */}
      <Footer />
    </div>
  )
}
