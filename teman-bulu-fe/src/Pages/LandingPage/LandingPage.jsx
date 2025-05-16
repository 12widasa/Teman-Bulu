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
      <main className='flex flex-col justify-center items-center w-full h-full'>
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
        <section className='flex-grow container mx-auto py-12 mb-6'>
          <div className='flex'>
            <div className='w-full md:w-1/2'>
              <p className='text-3xl pb-6 font-semibold'>Tentang ?</p>
              <p className='pb-2'>Subheading</p>
              <p className='text-gray-400'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, tempore.</p>
            </div>
            <div className='w-full md:w-1/2'>
              <div className="h-72 md:h-full rounded justify-center relative">
                <img className='' src={HamsterImage} alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className='flex-grow container mx-auto py-12 mb-6'>
          <div className='flex flex-col'>
            <div className='flex'>
              <p className='text-3xl pb-6 font-semibold'>Layanan</p>
            </div>
            <div className='flex gap-4'>
              <div className="flex gap-4">
                {/* Card 1 */}
                <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={CatImage3} alt="Cat 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-4 pr-4">
                    <h3 className="text-lg font-semibold mb-1">Walking</h3>
                    <p className="text-sm text-gray-600 mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam tenetur fugit similique laudantium nostrum eum perspiciatis, molestias nobis ratione quae odit officia autem officiis laborum modi dicta itaque debitis. Voluptatum.</p>
                    <button className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800">
                      Lihat Detail
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={CatImage4} alt="Cat 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-4 pr-4">
                    <h3 className="text-lg font-semibold mb-1">Grooming</h3>
                    <p className="text-sm text-gray-600 mb-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic ut nobis voluptatum velit. Quibusdam voluptatum explicabo expedita, vitae debitis, unde non recusandae aliquam, ratione magnam molestiae quaerat. Mollitia, non doloribus?</p>
                    <button className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800">
                      Lihat Detail
                    </button>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="w-1/3 bg-white rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={HamsterImage} alt="Hamster" className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-4 pr-4">
                    <h3 className="text-lg font-semibold mb-1">Boarding</h3>
                    <p className="text-sm text-gray-600 mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus in nulla, illo dolor autem deserunt consequuntur amet quam totam labore accusantium aliquam enim ipsa quod vitae pariatur cum numquam non?</p>
                    <button className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='flex-grow container mx-auto py-12'>
          <div className='flex flex-col'>
            <div className='flex'>
              <p className='text-3xl pb-6 font-semibold'>Penilaian</p>
            </div>
            <div className='flex gap-4'>
              <div className="flex gap-4">
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
            </div>
            <div className='flex justify-center mt-8'>
              <button
                type="submit"
                className="w-48 bg-black text-white py-2 px-4 rounded hover:bg-[#1d1f1f] transition duration-200 flex justify-center items-center gap-2"
              > Order
              </button>
            </div>
          </div>
        </section>

        <section className='flex-grow container mx-auto py-12 mb-6'>
          <p className='text-3xl pb-6 font-semibold'>Kontak Mitra</p>
          <div className='flex'>
            <div className='w-full md:w-1/2'>
              <div className="aspect-[3/4] overflow-hidden">
                <img className='object-cover' src={HamsterImage} alt="" />
              </div>
            </div>
            <div className='w-full md:w-1/2 pl-4'>
              <p className='pb-2'>Subheading</p>
              <p className='text-gray-400'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, tempore.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
