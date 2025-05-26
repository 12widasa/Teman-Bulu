import React, { useEffect, useRef, useState } from 'react'
import Header from './../../Component/Auth/Header';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DogImage1 from './../../assets/dog1.jpg';
import DogImage2 from './../../assets/dog2.jpg';
import CatImage1 from './../../assets/cat1.jpg';
import CatImage2 from './../../assets/cat2.jpg';
import CatImage3 from './../../assets/cat3.jpg';
import CatImage4 from './../../assets/cat4.jpg';
import HamsterImage from './../../assets/hamster1.jpg';
import RabbitImage1 from './../../assets/rabbit1.jpg';
import RabbitImage2 from './../../assets/rabbit2.jpg';
import RabbitImage3 from './../../assets/rabbit3.jpg';
import CSImage1 from './../../assets/cs1.jpg';
import CSImage2 from './../../assets/cs2.jpg';
import Call from './../../assets/emergency-call.png';
import Footer from './../../Component/Auth/Footer';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const images = [
    DogImage1,
    DogImage2,
    CatImage1,
    CatImage2,
  ];

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });
  return (
    <div>
      <Header />
      <main className='flex flex-col justify-center items-center w-full p-2 h-full'>
        {/* Carousel */}
        <section ref={sliderRef} className='keen-slider max-w-5xl mb-16'>
          {images.map((url, id) => (
            <div key={id} className="keen-slider__slide number-slide">
              <img
                src={url}
                alt={`Slide ${id + 1}`}
                className="w-full h-[400px] object-cover rounded-md"
              />
            </div>

          ))}
          <button
            onClick={() => slider.current?.prev()}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-opacity-50 text-white p-2 rounded-full cursor-pointer hover:bg-opacity-80"
          >
            <ChevronLeft size={30} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => slider.current?.next()}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-opacity-50 text-white p-2 rounded-full cursor-pointer hover:bg-opacity-80"
          >
            <ChevronRight size={30} strokeWidth={1.5} />
          </button>
        </section>
        {/* About */}
        <section className='flex-grow container mx-auto pb-12 mb-2'>
          <div className='flex'>
            <div className='w-full md:w-1/2'>
              <p className='text-3xl pb-6 font-semibold'>Tentang Kami</p>
              <p className='pb-2 font-bold'>Teman Bulu</p>
              <p className='text-gray-400 pb-4'>Teman Bulu adalah solusi perawatan hewan kesayangan Anda yang penuh kasih dan profesional. Kami menyediakan layanan grooming, penitipan aman, dan grooming panggilan ke rumah, didukung tim berpengalaman dan fasilitas terbaik demi kenyamanan dan kesehatan hewan Anda.</p>
              <p className='pb-2 font-bold'>Mitra Teman Bulu</p>
              <p className='text-gray-400 pb-4'>Teman Bulu bermitra dengan Animal Center untuk memberikan perawatan dan layanan kesehatan terbaik bagi hewan kesayangan Anda.</p>
              <button className='bg-[#EF7800] text-white px-6 py-2 rounded'>Selengkapnya</button>
            </div>
            <div className='w-full md:w-1/2'>
              <div className="h-72 md:h-full rounded justify-center relative">
                <img className='' src={HamsterImage} alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className='flex-grow container mx-auto pb-12 mb-2'>
          <div className='flex flex-col'>
            <div className='flex'>
              <p className='text-3xl pb-6 font-semibold'>Layanan Kami</p>
            </div>
            <div className='flex gap-4'>

              <div className="flex gap-4">
                {/* Card 1 */}
                <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={CatImage3} alt="Cat 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-4 pr-4">
                    <h3 className="text-lg font-semibold mb-1">🛁 Grooming</h3>
                    <p className="text-sm text-gray-600 mb-3">Manjakan hewan Anda dengan grooming profesional di tempat kami yang nyaman dan higienis.</p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={CatImage4} alt="Cat 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-4 pr-4">
                    <h3 className="text-lg font-semibold mb-1">🚚 Grooming di rumah</h3>
                    <p className="text-sm text-gray-600 mb-3">Grooming praktis di rumah Anda, tanpa stres dan tetap dalam perawatan tangan profesional.</p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={HamsterImage} alt="Hamster" className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-4 pr-4">
                    <h3 className="text-lg font-semibold mb-1">🏠 Penitipan</h3>
                    <p className="text-sm text-gray-600 mb-3">Titipkan hewan kesayangan dengan tenang, aman, nyaman, dan tetap aktif selama Anda pergi.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className='flex-grow container mx-auto pb-12'>
          <div className='flex flex-col'>
            <div className='flex'>
              <p className='text-3xl pb-6 font-semibold'>Pesan Layanan</p>
            </div>
            {/* INI AKAN ADA MAPPING AN DATA BUAT DITAMPILKAN SEBAGAI CARD */}
            <div className='flex gap-4'>

              {/* Card 1 */}
              <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                <div className="aspect-[6/4] overflow-hidden">
                  <img src={RabbitImage1} alt="Cat 1" className="w-full h-full object-cover" />
                </div>
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-1">Walking</h3>
                  <p className="text-sm text-gray-600 mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam tenetur fugit similique laudantium nostrum eum perspiciatis, molestias nobis ratione quae odit officia autem officiis laborum modi dicta itaque debitis. Voluptatum.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                <div className="aspect-[6/4] overflow-hidden">
                  <img src={RabbitImage2} alt="Cat 2" className="w-full h-full object-cover" />
                </div>
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-1">Grooming</h3>
                  <p className="text-sm text-gray-600 mb-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic ut nobis voluptatum velit. Quibusdam voluptatum explicabo expedita, vitae debitis, unde non recusandae aliquam, ratione magnam molestiae quaerat. Mollitia, non doloribus?</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                <div className="aspect-[6/4] overflow-hidden">
                  <img src={RabbitImage3} alt="Hamster" className="w-full h-full object-cover" />
                </div>
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-1">Boarding</h3>
                  <p className="text-sm text-gray-600 mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus in nulla, illo dolor autem deserunt consequuntur amet quam totam labore accusantium aliquam enim ipsa quod vitae pariatur cum numquam non?</p>
                </div>
              </div>

            </div>

            <div className='flex justify-center mt-8'>
              {/* NANTI AKAN NGELINK KE PESAN LAYANAN */}
              <Link className='w-full' to="/pesan-layanan">
                <button
                  type="submit"
                  className="w-full bg-[#Ef7800] text-white py-2 px-4 rounded flex justify-center items-center gap-2"
                > Lihat Selengkapnya
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className='flex-grow container mx-auto py-12 mb-6'>
          <h2 className="text-3xl font-bold mb-8">Kontak</h2>
          <div className='flex'>

            <div className="w-2/3">
              <img src={CSImage2} alt="Dokter Hewan" className="w-full object-cover" />
            </div>

            <div className='flex-grow flex flex-col'>

              <div className="flex flex-col flex-grow items-center text-center md:text-left space-y-2">
                <p className="text-lg font-medium">Ingin Bertanya?</p>
                <p className="text-sm text-gray-600">
                  Tim Teman Bulu selalu siap mendengarkan Anda.
                </p>
                <p className="text-sm text-gray-600">
                  Hubungi kami untuk info layanan, pemesanan, atau konsultasi seputar perawatan hewan.
                </p>
                <p className="text-sm text-[#Ef7800]">Hubungi kami</p>
                <a
                  href="https://wa.me/+6285642032487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#Ef7800] w-72 text-center text-white px-6 py-2 rounded-md mt-2"
                >
                  WhatsApp Kami
                </a>
              </div>

              <div className="flex flex-row flex-grow items-center text-center md:text-left space-y-2">
                <div className='pl-12 pr-4'>
                  <img className='w-72' src={Call} alt="" />
                </div>
                <div className='flex flex-col items-center flex-grow w-full'>
                  <p className="text-lg self-start font-bold">Layanan Darurat Kesehatan Hewan</p>
                  <p className="text-sm text-justify text-gray-600">
                    Kami bekerja sama dengan klinik dan rumah sakit hewan terpercaya untuk menangani kondisi darurat atau kebutuhan medis hewan kesayangan Anda.
                  </p>
                  <p className="text-sm items-center text-[#Ef7800]">Hubungi kami</p>
                  <a
                    href="https://wa.me/+6285642032487"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-center bg-[#Ef7800] w-72 text-white px-6 py-2 rounded-md mt-2"
                  >
                    WhatsApp Kami
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
