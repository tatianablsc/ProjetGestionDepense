// On importe les modules dont on a besoin
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

// On importe les routes
import usersRoutes from "./routes/users.routes.js";
import depensesRoutes from "./routes/depenses.routes.js";
import achatsRoutes from "./routes/achats.routes.js";

// On charge les variables d'environnement (.env)
dotenv.config();

// On crée l'application Express
const app = express();

// Pour pouvoir lire le JSON dans les requêtes
app.use(express.json());

// On se connecte à MongoDB
connectDB();

// Route de test pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Gestion de Dépenses',
    status: 'En ligne ✅',
    routes: {
      users: '/api/users',
      depenses: '/api/depenses',
      achats: '/api/achats'
    }
  });
});

// Routes de l'API

// Routes pour les utilisateurs
app.use("/api/users", usersRoutes);

// Routes pour les catégories de dépense
app.use("/api/depenses", depensesRoutes);

// Routes pour les achats
app.use("/api/achats", achatsRoutes);

// Middleware d'erreurs
// Si une route appelle next(err), ça arrive ici
app.use((err, req, res, next) => {
  console.error("Erreur :", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Erreur serveur",
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
