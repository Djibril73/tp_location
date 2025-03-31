import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import "../AllCss/Login.css"; // <-- Le fichier CSS qu'on va modifier

const Login = ({ closeLogin, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      setIsAuthenticated(true);
      if (closeLogin) {
        closeLogin();
      }
      navigate("/profile");
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setErrorMessage(error.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="login-fullscreen">
      <div className="login-container">
        {closeLogin && (
          <button
            className="close-btn"
            onClick={closeLogin}
          >
            &times;
          </button>
        )}
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" />
              Se souvenir de moi
            </label>
            <Link to="#" className="forgot-password">Mot de passe oublié ?</Link>
          </div>
          <button type="submit" className="signin-btn">Se Connecter</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <p className="register-text">
          Don’t have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchToRegister();
            }}
          >
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;