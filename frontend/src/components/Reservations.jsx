// src/components/Reservations.jsx
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext.jsx";
import "../AllCss/Reservations.css";

const Reservations = () => {
  const { token } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    if (!token) {
      setError("Token manquant, veuillez vous connecter.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3001/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des réservations :", err);
      setError("Erreur lors de la récupération des réservations.");
    }
  };

  // Optionnel : on récupère automatiquement les réservations dès que le token est disponible
  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h2 className="reservations-title">Mes réservations</h2>
        <div className="reservations-count">
          {reservations.length} {reservations.length <= 1 ? "réservation" : "réservations"}
        </div>
      </div>

      {error && (
        <div className="reservations-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="error-icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="reservations-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="empty-icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <p>Aucune réservation trouvée</p>
          <button className="btn-primary">Réserver maintenant</button>
        </div>
      ) : (
        <div className="reservations-grid">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-card-header">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="car-icon"
                >
                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
                  <circle cx="6.5" cy="16.5" r="2.5"></circle>
                  <circle cx="16.5" cy="16.5" r="2.5"></circle>
                </svg>
                <div className="car-model">
                  {reservation.brand} {reservation.model}
                </div>
              </div>

              <div className="reservation-card-body">
                <div className="reservation-dates">
                  <div className="date-group">
                    <div className="date-label">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="date-icon"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Début
                    </div>
                    <div className="date-value">{new Date(reservation.start_date).toLocaleDateString("fr-FR")}</div>
                  </div>

                  <div className="date-separator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="arrow-icon"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>

                  <div className="date-group">
                    <div className="date-label">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="date-icon"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Fin
                    </div>
                    <div className="date-value">{new Date(reservation.end_date).toLocaleDateString("fr-FR")}</div>
                  </div>
                </div>
              </div>

              <div className="reservation-card-footer">
                <button className="btn-secondary">Détails</button>
                <button className="btn-outline">Annuler</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reservations

