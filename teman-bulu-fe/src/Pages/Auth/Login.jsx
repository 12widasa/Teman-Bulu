import React, { useState } from 'react'
import { Facebook, Instagram, Linkedin, Loader2, Twitter, Youtube } from 'lucide-react';
import Header from './../../Component/Auth/Header';
import Footer from './../../Component/Auth/Footer';
import DOG5 from './../../assets/dog5.jpg';
import ModalOpen from '../../Component/Auth/ModalOpen';
import { AUTH_SERVICE } from '../../Services/Auth';

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [loginAuth, setLoginAuth] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await AUTH_SERVICE.loginUser({ email: loginAuth.email, password: loginAuth.password })
      localStorage.setItem('token', response.data.token)
      setIsSubmitting(false);
      setShowModal(true);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
              <ModalOpen
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                link="ini linknya"
              />
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
