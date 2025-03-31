"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import "../AllCss/cars.css"
import VideoLux from '../images/lux.mp4'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'


const Cars = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reservationError, setReservationError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isStartFocused, setIsStartFocused] = useState(false)
  const [isEndFocused, setIsEndFocused] = useState(false)
  const [animateStart, setAnimateStart] = useState(false)
  const [animateEnd, setAnimateEnd] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleDatesSelected = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    console.log("Dates selected:", start, end);
  };

  useEffect(() => {
    if (startDate) {
      setAnimateStart(true)
      const timer = setTimeout(() => setAnimateStart(false), 500)
      return () => clearTimeout(timer)
    }
  }, [startDate])

  useEffect(() => {
    if (endDate) {
      setAnimateEnd(true)
      const timer = setTimeout(() => setAnimateEnd(false), 500)
      return () => clearTimeout(timer)
    }
  }, [endDate])

  useEffect(() => {
    // Faire remonter la page tout en haut
    window.scrollTo(0, 0);
  
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/cars");
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des voitures");
        setLoading(false);
        console.error("Erreur:", err);
      }
    };
  
    fetchCars();
  }, []);

  // Extraction des catégories uniques
  const categories = ["Tous", ...new Set(cars.map((car) => car.brand))]

  // Filtrer les voitures par catégorie et recherche
  const filteredCars = cars.filter((car) => {
    const matchesCategory = selectedCategory === "Tous" || car.brand === selectedCategory
    const matchesSearch =
      (car.brand + " " + car.model).toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Fonction pour gérer la réservation
  const handleReserve = async (carId) => {
    // Vérifier que les dates sont valides
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner une date de début et une date de fin.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("La date de début doit être antérieure à la date de fin.");
      return;
    }

    // Récupérer le token (selon ton système d'authentification)
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setShowLoginModal(true);
      return;
    }
  
    try {
      // Appel API pour créer la réservation (avec le token)
      const response = await axios.post(
        "http://localhost:3001/reservations",
        { carId, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      alert("Réservation effectuée avec succès!");
      console.log("Réservation créée:", response.data);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      if (error.response && error.response.status === 400) {
        setReservationError(error.response.data.message);
      } else {
        setReservationError("Une erreur s'est produite lors de la réservation.");
      }
    }
  };

  // Animation variants pour Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="cars-page">
      <div className="video-container"></div>
      <video className="background-video" src={VideoLux} autoPlay loop muted playsInline />
      <div className="video-overlay"></div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher une voiture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="search-icon">🔍</i>
        </div>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Nouveau sélecteur de dates élégant */}
      <div className="date-selection-container">
        <div className={`date-input-wrapper ${isStartFocused ? 'focused' : ''} ${animateStart ? 'animate' : ''}`}>
          <Calendar className="date-icon" />
          <label className="date-label">
            Date de début
            <div className="input-container">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={() => setIsStartFocused(true)}
                onBlur={() => setIsStartFocused(false)}
              />
              <ChevronLeft className="chevron-icon left" />
              <ChevronRight className="chevron-icon right" />
            </div>
          </label>
        </div>

        <div className="date-separator">
          <div className="separator-line"></div>
        </div>

        <div className={`date-input-wrapper ${isEndFocused ? 'focused' : ''} ${animateEnd ? 'animate' : ''}`}>
          <Calendar className="date-icon" />
          <label className="date-label">
            Date de fin
            <div className="input-container">
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={() => setIsEndFocused(true)}
                onBlur={() => setIsEndFocused(false)}
              />
              <ChevronLeft className="chevron-icon left" />
              <ChevronRight className="chevron-icon right" />
            </div>
          </label>
        </div>
      </div>

      {reservationError && (
        <div className="reservation-error">
          <p>{reservationError}</p>
        </div>
      )}

      <motion.div className="cars-grid" variants={containerVariants} initial="hidden" animate="visible">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <motion.div className="car-card" key={car.id} variants={itemVariants}>
              <div className="car-image">
                <img
                  src={car.image_url || "/placeholder.svg"}
                  alt={`${car.brand} ${car.model}`}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg"
                  }}
                />
                <div className="car-price">
                  {car.price}€<span>/jour</span>
                </div>
              </div>
              <div className="car-details">
                <h2>
                  {car.brand} {car.model}
                </h2>
                <p className="car-year">Année: {car.year}</p>
                <p className="car-description">{car.description}</p>
                <div className="car-specs">
                  <div className="spec">
                    <i className="spec-icon">🚗</i>
                    <span>{car.brand}</span>
                  </div>
                  <div className="spec">
                    <i className="spec-icon">📅</i>
                    <span>{car.year}</span>
                  </div>
                  <div className="spec">
                    <i className="spec-icon">💰</i>
                    <span>{car.price}€/jour</span>
                  </div>
                </div>
                <button className="reserve-btn" onClick={() => handleReserve(car.id)}>
                  Réserver maintenant
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-results">
            <h3>Aucune voiture ne correspond à votre recherche</h3>
            <p>Veuillez modifier vos critères de recherche</p>
          </div>
        )}
      </motion.div>
     
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Veuillez vous connecter</h2>
            <p>Pour effectuer une réservation, vous devez être connecté.</p>
            <button
              className="close-modal-btn"
              onClick={() => setShowLoginModal(false)}
            >
              Fermer
            </button>
            <button
              className="login-btn"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Se connecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cars
