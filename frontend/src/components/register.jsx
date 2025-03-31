import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../AllCss/Register.css";

const Register = ({ closeRegister, switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:3001/register", {
        email,
        username,
        password,
      });

      setMessage("Inscription réussie ! Redirection en cours...");
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="register-fullscreen">
      <div className="register-container">
      {closeRegister && (
          <button className="close-btn" onClick={closeRegister}>
            &times;
          </button>
        )}
        <h2>Inscription</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">S'inscrire</button>
        </form>

        {/* Affichage du message de succès ou d'erreur */}
        {message && <p className="register-success">{message}</p>}
        {error && <p className="register-error">{error}</p>}

        <p className="login-redirect">
          Déjà un compte ? <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchToLogin();
            }}
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;