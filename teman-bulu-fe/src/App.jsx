import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import Login from './Pages/Auth/Login'
import Dashboard from './Pages/Admin/Dashboard';
import LandingPage from './Pages/LandingPage/LandingPage';
import RegisterBuyer from './Pages/Auth/RegisterBuyer';
import RegisterSeller from './Pages/Auth/RegisterSeller';


function App() {
  const router = createBrowserRouter([
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
      path: "/admin",
      element: <Dashboard />,
    },
    {
      path: "/landingpage",
      element: <LandingPage />,
    }
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
