// src/components/Footer.jsx
import React from 'react';
import "../AllCss/Footer.css"; // ou le fichier CSS contenant les styles du footer


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="footer-logo">
              <h3>DJB<span>DRIVE</span></h3>
            </div>
            <p className="footer-description">
              Votre partenaire de confiance pour la location de véhicules premium.
            </p>
            <div className="footer-social">
              {/* Ici, ajoute les icônes de réseaux sociaux */}
            </div>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Liens Rapides</h4>
            <ul className="footer-links">
              <li><a href="/">Accueil</a></li>
              <li><a href="/cars">Nos Voitures</a></li>
              <li><a href="/profile">Réservations</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Nos Services</h4>
            <ul className="footer-links">
              <li><a href="#">Location courte durée</a></li>
              <li><a href="#">Location longue durée</a></li>
              <li><a href="#">Location avec chauffeur</a></li>
              <li><a href="#">Transfert aéroport</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-contact">
              <li>
                {/* Par exemple, avec FontAwesome */}
                <span>150 Avenue de la Street</span>
              </li>
              <li>
                <span>+33 6 52 74 64 30</span>
              </li>
              <li>
                <span>contact@djbdrive.fr</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} LUXEDRIVE. Tous droits réservés.</p>
          </div>
          <div className="footer-bottom-links">
            <a href="#">Conditions Générales</a>
            <a href="#">Politique de Confidentialité</a>
            <a href="#">Mentions Légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;