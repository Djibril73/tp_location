"use client"

import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import "../AllCss/home-page.css";
import TeslaImage from "../images/tesla.jpg";
import AudiA6 from "../images/a6.jpg";
import ClassE from "../images/mercedesclasse.jpg";
import Serie5 from "../images/serie5.jpg";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';


// Sample car data - replace with your actual data
const cars = [
  {
    id: 1,
    name: "Tesla Model S",
    description: "Voiture électrique de luxe avec une autonomie exceptionnelle",
    price: "120€",
    image: TeslaImage
  },
  {
    id: 2,
    name: "BMW Série 5",
    description: "Berline premium alliant confort et performances",
    price: "150€",
    image: Serie5,
  },
  {
    id: 3,
    name: "Mercedes Classe E",
    description: "L'élégance et la technologie au service du confort",
    price: "165€",
    image: ClassE,
  },
  {
    id: 4,
    name: "Audi A6",
    description: "Design raffiné et technologie de pointe",
    price: "155€",
    image: AudiA6,
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-advance the slideshow
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAnimating) {
        nextSlide()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentSlide, isAnimating])

  const nextSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === cars.length - 1 ? 0 : prev + 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const prevSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? cars.length - 1 : prev - 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  return (
    <>
      <main className="main">
        {/* Hero Slideshow Section */}
        <section className="hero-section">
          {/* Slides */}
          <div className="slides-container">
            {cars.map((car, index) => (
              <div key={car.id} className={`slide ${currentSlide === index ? "slide-active" : "slide-hidden"}`}>
                {/* Background Image */}
                <div className="slide-background" style={{ backgroundImage: `url(${car.image})` }}>
                  <div className="slide-overlay"></div>
                </div>

                {/* Content */}
                <div className="slide-content">
                  <div className="slide-text">
                    <h1 className="slide-title">{car.name}</h1>
                    <p className="slide-description">{car.description}</p>
                    <div className="price-container">
                      <span className="price">{car.price}</span>
                      <span className="price-period">/ jour</span>
                    </div>
                    <div className="buttons-container">
                      <button className="btn btn-primary">Réserver maintenant</button>
                      <button className="btn btn-outline">En savoir plus</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button onClick={prevSlide} className="nav-arrow nav-arrow-left" aria-label="Précédent">
            <ChevronLeft className="arrow-icon" />
          </button>

          <button onClick={nextSlide} className="nav-arrow nav-arrow-right" aria-label="Suivant">
            <ChevronRight className="arrow-icon" />
          </button>

          {/* Slide Indicators */}
          <div className="slide-indicators">
            {cars.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`indicator ${currentSlide === index ? "indicator-active" : ""}`}
                aria-label={`Aller à la diapositive ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Nos véhicules populaires</h2>

            <div className="car-grid">
              {cars.map((car) => (
                <div key={car.id} className="car-card">
                  <div className="car-image-container">
                    <img src={car.image || "/placeholder.svg"} alt={car.name} className="car-image" />
                  </div>
                  <div className="car-details">
                    <h3 className="car-name">{car.name}</h3>
                    <p className="car-description">{car.description}</p>
                    <div className="car-footer">
                      <div>
                        <span className="car-price-period">{car.price} / jour</span>
                      </div>
                      <button className="btn btn-small">Détails</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all">
              <Link to="/cars">
                <button className="btn btn-large">Voir tous nos véhicules</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="container text-center">
            <h2 className="cta-title">Prêt à prendre la route ?</h2>
            <p className="cta-text">
              Réservez dès maintenant et profitez de nos offres spéciales. Nous proposons une large gamme de véhicules
              pour tous vos besoins.
            </p>
            <Link to="/cars">
            <button className="btn btn-primary btn-large">Réserver maintenant</button>
            </Link>
          </div>
        </section>
      </main>
      
    </>
  )
}