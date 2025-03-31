import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/authContext.jsx";
import "../AllCss/Profile.css";
import Reservations from "./Reservations.jsx";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setToken } = useContext(AuthContext);

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      setMessage("Non connecté");
      navigate("/");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Réponse API:", response);
      setUser(response.data.user);
    } catch (error) {
      console.error("Erreur lors du fetch du profile:", error);
      setMessage(error.response?.data?.message || "Erreur d'accès");
      navigate("/");
    }
  };

  fetchProfile();
}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken(null);
    navigate("/");
  };

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="profile-title">Mon Profil</h2>
      {user ? (
        <div className="profile-content">
          <p className="welcome-message">
            Bienvenue, <span className="username">{user.username}</span>!
          </p>
          <Reservations /> {/* Affichage des réservations propres à l'utilisateur */}
          <button className="logout-button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      ) : (
        <p className="profile-message">{message}</p>
      )}
    </motion.div>
  );
};

export default Profile;