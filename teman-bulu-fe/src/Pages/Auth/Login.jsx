import React, { useState } from 'react'
import { Facebook, Instagram, Linkedin, Loader2 } from 'lucide-react';
import Header from './../../Component/Auth/Header';
import Footer from './../../Component/Auth/Footer';
import DOG5 from './../../assets/dog5.jpg';
import { AUTH_SERVICE } from '../../Services/Auth';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../Utils/auth.js'

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await AUTH_SERVICE.loginUser({
        email: loginAuth.email,
        password: loginAuth.password
      });
      localStorage.setItem('token', response.data.token);
      
      const role = getUserRole();

      setShowSuccessModal(true);
      setShowErrorModal(false);

      setTimeout(() => {
        setShowSuccessModal(false);
        if (role === 1) {
          navigate('/admin-data-buyer');
        } else if (role === 2) {
          navigate('/daftar-pesanan');
        } else {
          navigate('/landingpage');
        }
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setShowErrorModal(true);
      setShowSuccessModal(false);
    } finally {
      setIsSubmitting(false);
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
      <Header />

      <main className="flex-grow container mx-auto py-12 mb-6">
        <div className="flex">
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
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="h-32 overflow-hidden md:h-full rounded justify-center">
              <img src={DOG5} alt="" />
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
