import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import Dashboard from './Pages/Admin/Dashboard';
import LandingPage from './Pages/LandingPage/LandingPage';


function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
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
