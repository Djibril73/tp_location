import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import Profile from "./components/profile.jsx";
import Header from "./components/header.jsx";
import HomePage from "./components/home-page.jsx";
import Cars from "./components/cars.jsx";
import "../src/App.css";
import authService from "./services/authService.js";
import { AuthContext } from '../src/context/authContext.jsx';
import Footer from "./components/Footer.jsx";
import Reservations from "./components/Reservations.jsx";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const savedToken = authService.getToken();
    if (savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
    }
  }, []);

  const openLoginModal = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegisterModal = () => {
    setShowRegister(true);
    setShowLogin(false);
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, token, setToken }}>
      <Header setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
      {/* Modal Login */}
      {showLogin && (
        <Login
          closeLogin={() => setShowLogin(false)}
          // si tu veux depuis la modale login basculer sur la modale register :
          switchToRegister={openRegisterModal}
        />
      )}
      {/* Modale Register */}
      {showRegister && (
        <Register
          closeRegister={() => setShowRegister(false)}
          switchToLogin={openLoginModal}
        />
      )}
      <Footer /> {/* Le footer s'affiche sur toutes les pages */}
    </AuthContext.Provider>
  );
}

export default App;