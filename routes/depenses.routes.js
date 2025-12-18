
import fs from "fs";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import Depense from "../models/depense.js";
import Achat from "../models/achat.js";

const router = express.Router();

 // route sert à créer une nouvelle catégorie de dépense                                                                                                                    Philippe
router.post("/", async (req, res, next) => {
  try {
    // On récupère ce qui est envoyé
    const { name, description } = req.body;

    // Vérifier que le nom existe
    if (!name) {
      const error = new Error("Le champ name est obligatoire");
      error.statusCode = 400;
      throw error;
    }

    // On crée la catégorie
    const newDepense = await Depense.create({
      name,
      description,
    });

    // On renvoie la catégorie créée
    res.status(201).json(newDepense);
  } catch (err) {
    next(err);
  }
});

 // route sert à afficher toutes les catégories
router.get("/", async (req, res, next) => {
  try {
    const depenses = await Depense.find();
    res.json(depenses);
  } catch (err) {
    next(err);
  }
});

 //  route sert à chercher une catégorie par son nom
router.get("/search", async (req, res, next) => {
  try {
    const { name } = req.query;

    const filter = {};

    // Si on envoie un nom, on filtre 
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const depenses = await Depense.find(filter);
    res.json(depenses);
  } catch (err) {
    next(err);
  }
});

//pipeline stats d'utilisation des categories
router.get("/stats/usage", async (req, res, next) => {
  try {
    const stats = await Achat.aggregate([
      {
        $group: {
          _id: "$depense",
          totalAmount: { $sum: "$amount" },
          countAchats: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "depenses",       
          localField: "_id",
          foreignField: "_id",
          as: "depenseInfo"
        }
      },
      { $unwind: "$depenseInfo" },
      {
        $project: {
          _id: 0,
          depenseId: "$depenseInfo._id",
          depenseName: "$depenseInfo.name",
          totalAmount: 1,
          countAchats: 1
        }
      }
    ]);

    res.json(stats);

  } catch (err) {
    next(err);
  }
});

// Route pour IMPORTER des catégories de dépenses depuis un fichier JSON
router.post("/import", async (req, res, next) => {
  try {
    // 1. Définir le chemin vers le fichier JSON
    const filePath = path.join(process.cwd(), "data", "depenses_import.json");
    
    // 2. Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      const error = new Error("Le fichier depenses_import.json n'existe pas dans le dossier data/");
      error.statusCode = 404;
      throw error;
    }
    
    // 3. Lire le contenu du fichier
    const fileContent = fs.readFileSync(filePath, "utf-8");
    
    // 4. Parser le JSON
    let depenses;
    try {
      depenses = JSON.parse(fileContent);
    } catch (parseError) {
      const error = new Error("Le fichier JSON est invalide ou mal formaté");
      error.statusCode = 400;
      throw error;
    }
    
    // 5. Vérifier que c'est un tableau
    if (!Array.isArray(depenses)) {
      const error = new Error("Le fichier JSON doit contenir un tableau");
      error.statusCode = 400;
      throw error;
    }
    
    // 6. Vérifier que le tableau n'est pas vide
    if (depenses.length === 0) {
      const error = new Error("Le fichier JSON ne contient aucune donnée");
      error.statusCode = 400;
      throw error;
    }
    
    // 7. Insérer toutes les dépenses dans MongoDB
    const result = await Depense.insertMany(depenses);
    
    // 8. Renvoyer la réponse de succès
    res.status(201).json({
      success: true,
      message: `${result.length} catégorie(s) importée(s) avec succès`,
      count: result.length,
      data: result
    });
    
  } catch (error) {
    // Si c'est une erreur MongoDB (ex: doublon)
    if (error.code === 11000) {
      error.message = "Certaines catégories existent déjà dans la base";
      error.statusCode = 400;
    }
    
    next(error);
  }
});

 // route sert à modifier une catégorie
router.put("/:id", async (req, res, next) => {
  try {
    const depenseId = req.params.id;

    // Vérifier que l'id est valide
    if (!mongoose.Types.ObjectId.isValid(depenseId)) {
      const error = new Error("id invalide");
      error.statusCode = 400;
      throw error;
    }

    const { name, description } = req.body;

    // On met à jour ce qu'on reçoit
    const updated = await Depense.findByIdAndUpdate(
      depenseId,
      { name, description },
      { new: true }
    );

    if (!updated) {
      const error = new Error("Catégorie non trouvée");
      error.statusCode = 404;
      throw error;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

 // route sert à supprimer une catégorie
router.delete("/:id", async (req, res, next) => {
  try {
    const depenseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(depenseId)) {
      const error = new Error("id invalide");
      error.statusCode = 400;
      throw error;
    }

    const deleted = await Depense.findByIdAndDelete(depenseId);

    if (!deleted) {
      const error = new Error("Catégorie non trouvée");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "Catégorie supprimée" });

  } catch (err) {
    next(err);
  }
});

export default router;

