import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import Login from './Pages/Auth/Login'
import LandingPage from './Pages/LandingPage/LandingPage';
import RegisterBuyer from './Pages/Auth/RegisterBuyer';
import RegisterSeller from './Pages/Auth/RegisterSeller';
import DataBuyer from './Pages/Admin/DataBuyer';
import DataSeller from './Pages/Admin/DataSeller';
import PageNotFound from './Pages/PageNotFound/PageNotFound';
import VerificationData from './Pages/Admin/VerificationData';
import PesanLayanan from './Pages/Pembeli/PesanLayanan/PesanLayanan';
import DetailPesanan from './Pages/Pembeli/DetailPesanan/DetailPesanan';
import Pembayaran from './Pages/Pembeli/Pembayaran/Pembayaran';
import DaftarTransaksi from './Pages/Pembeli/DaftarTransaksi/DaftarTransaksi';
import DaftarPesanan from './Pages/Penjual/DaftarPesanan/DaftarPesanan';

function App() {
  const router = createBrowserRouter([
    {
      path: "*",
      element: < PageNotFound />,
    },
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/landingpage",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register-seller",
      element: <RegisterSeller />,
    },
    {
      path: "/register-buyer",
      element: <RegisterBuyer />,
    },
    {
      path: "/admin-data-buyer",
      element: <DataBuyer />,
    },
    {
      path: "/admin-data-seller",
      element: <DataSeller />,
    },
    {
      path: "/admin-verification-data",
      element: <VerificationData />,
    },
    {
      path: "/pesan-layanan",
      element: <PesanLayanan />,
    },
    {
      path: "/detail-pesanan/:id",
      element: <DetailPesanan />,
    },
    {
      path: "/konfirmasi-pembayaran",
      element: <Pembayaran />,
    },
    {
      path: "/daftar-transaksi",
      element: <DaftarTransaksi />,
    },
    {
      path: "/daftar-pesanan",
      element: <DaftarPesanan />,
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
