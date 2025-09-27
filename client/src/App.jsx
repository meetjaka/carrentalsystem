import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";
import Favorites from "./pages/Favorites";
import Footer from "./components/Footer";
import Layout from "./pages/Owner/Layout";
import Dashboard from "./pages/Owner/Dashboard";
import AddCar from "./pages/Owner/AddCar";
import ManageCars from "./pages/Owner/ManageCars";
import ManageBookings from "./pages/Owner/ManageBookings";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import ConfirmEmail from "./pages/ConfirmEmail";
import OwnerCars from "./pages/OwnerCars";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
const App = () => {
  const { showLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/confirm/:token" element={<ConfirmEmail />} />
        <Route path="/owner-cars/:ownerId" element={<OwnerCars />} />
        <Route path="/chat/:ownerId" element={<Chat />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>
      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
