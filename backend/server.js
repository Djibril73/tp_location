const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'secretkey';

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARES
// ─────────────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// ─────────────────────────────────────────────────────────────────────────────
// CONNEXION À LA BASE DE DONNÉES
// ─────────────────────────────────────────────────────────────────────────────
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce',
  port: 3308, // Assure-toi que c'est bien le port de MySQL, pas le port de ton serveur Node
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES DE TEST ET AUTH
// ─────────────────────────────────────────────────────────────────────────────

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur backend opérationnel avec Node.js et Express !');
});

// Route pour récupérer tous les utilisateurs (simple démo)
app.get('/user', (req, res) => {
  const sql = 'SELECT * FROM user';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INSCRIPTION
// ─────────────────────────────────────────────────────────────────────────────
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO user (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Erreur SQL :", err);
          return res
            .status(500)
            .json({ message: "Erreur serveur ou email déjà utilisé." });
        }
        res.status(201).json({ message: "Inscription réussie" });
      }
    );
  } catch (err) {
    console.error("Erreur lors du hashing :", err);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// CONNEXION
// ─────────────────────────────────────────────────────────────────────────────
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Email non trouvé' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Génération du token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h',
    });
    // On renvoie le token et l’utilisateur (pour le front)
    res.json({ token, user: { id: user.id, email: user.email } });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE POUR OBTENIR LES VOITURES
// ─────────────────────────────────────────────────────────────────────────────
app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      res.status(500).json({ message: "Erreur serveur" });
    } else {
      res.json(results);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE DE VÉRIFICATION DU TOKEN
// ─────────────────────────────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  // Récupère le header Authorization
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Accès interdit' });

  // Vérifie la validité du token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide' });
    req.user = decoded; // On stocke l’objet décodé (id, email) dans req.user
    next();
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES PROTÉGÉES (EXEMPLES)
// ─────────────────────────────────────────────────────────────────────────────

// Route profil (exemple)
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Profil utilisateur sécurisé', user: req.user });
});

// ─────────────────────────────────────────────────────────────────────────────
// RÉSERVATIONS
// ─────────────────────────────────────────────────────────────────────────────

// 1) Création d’une réservation (protégée par token)
app.post('/reservations', verifyToken, (req, res) => {
  const { carId, startDate, endDate } = req.body;
  const userId = req.user.id;

  // Vérifier s'il y a une réservation existante pour la même voiture
  // et des dates qui se chevauchent
  const checkSql = `
    SELECT * FROM reservations
    WHERE car_id = ? AND start_date <= ? AND end_date >= ?
  `;
  db.query(checkSql, [carId, endDate, startDate], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Erreur lors de la vérification de la réservation :", checkErr);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de la vérification de la réservation." });
    }

    if (checkResults.length > 0) {
      return res
        .status(400)
        .json({ message: "La voiture est déjà réservée pour la période demandée." });
    }

    // Si aucune réservation ne chevauche, on insère la nouvelle réservation
    const sql = `
      INSERT INTO reservations (car_id, user_id, start_date, end_date)
      VALUES (?, ?, ?, ?)
    `;
    const values = [carId, userId, startDate, endDate];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erreur lors de la création de la réservation :", err);
        return res
          .status(500)
          .json({ message: "Erreur serveur lors de la création de la réservation." });
      }
      res.status(201).json({
        message: "Réservation créée avec succès !",
        reservationId: result.insertId,
      });
    });
  });
});

// 2) Récupérer les réservations de l'utilisateur connecté
app.get('/reservations', verifyToken, (req, res) => {
    const userId = req.user.id;
  
    // Jointure pour récupérer la marque et le modèle
    const sql = `
      SELECT r.start_date, r.end_date, 
             c.brand, c.model
      FROM reservations AS r
      JOIN cars AS c ON r.car_id = c.id
      WHERE r.user_id = ?
    `;
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des réservations :", err);
        return res
          .status(500)
          .json({ message: "Erreur serveur lors de la récupération des réservations." });
      }
      res.json(results);
    });
  });

// ─────────────────────────────────────────────────────────────────────────────
// LANCEMENT DU SERVEUR
// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});