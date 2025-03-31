"use client"

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserCircle } from "react-icons/fa";
import "../AllCss/Header.css";
import logo from "../images/logo.png";
import { AuthContext } from '../context/authContext';

const Header = ({ setShowLogin }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      
      <header className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo || "/placeholder.svg"} alt="RentCar Logo" className="logo-image" />
          </Link>
        </div>

        <nav className="navigation">
          <Link to="/">Accueil</Link>
          <Link to="/cars">Nos voitures</Link>
          <Link to="/about">À propos</Link>
          <Link to="/contact">Contact</Link>
        </nav>

      
        <div className="login-icon">
          {!isAuthenticated ? (
            // Si non authentifié, on affiche l'icône qui ouvre la modal de connexion
            <div onClick={() => setShowLogin(true)}>
              <FaUserCircle size={40} />
            </div>
          ) : (
            // Si authentifié, l'icône redirige vers le profil (ou on peut afficher un menu de déconnexion)
            <Link to="/profile">
              <FaSignInAlt size={40} />
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;