import express from "express";
import mongoose from "mongoose";
import Achat from "../models/Achat.js";

const router = express.Router();

  // Cette route sert à créer un achat
router.post("/", async (req, res, next) => {
  try {
    // On récupère ce qui est envoyé
    const { user, depense, amount, date, description } = req.body;

    // Vérifier les champs obligatoires (on ne fait pas plus compliqué)
    if (!user || !depense || amount === undefined || !date) {
      const error = new Error("user, depense, amount et date sont obligatoires");
      error.statusCode = 400;
      throw error;
    }

    // On vérifie vite fait les id (sans message compliqué)
    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(depense)) {
      const error = new Error("user ou depense a un id invalide");
      error.statusCode = 400;
      throw error;
    }

    // On convertit le montant en nombre
    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber < 0) {
      const error = new Error("amount doit être un nombre positif");
      error.statusCode = 400;
      throw error;
    }

    // On crée l'achat
    const newAchat = await Achat.create({
      user,
      depense,
      amount: amountNumber,
      date: new Date(date),
      description,
    });

    // On renvoie l'achat créé
    res.status(201).json(newAchat);
  } catch (err) {
    next(err);
  }
});

 // Cette route sert à afficher tous les achats
router.get("/", async (req, res, next) => {
  try {
    // On récupère tous les achats
    const achats = await Achat.find()
      .populate("user")
      .populate("depense");

    // On renvoie la liste
    res.json(achats);
  } catch (err) {
    next(err);
  }
});

 // Cette route sert à filtrer par user ou par depense
router.get("/filter", async (req, res, next) => {
  try {
    const { user, depense } = req.query;
    const filter = {};

    // Si on envoie un user, on filtre 
    if (user) {
      filter.user = user;
    }

    // Si on envoie une depense, on filtre 
    if (depense) {
      filter.depense = depense;
    }

    const achats = await Achat.find(filter)
      .populate("user")
      .populate("depense");

    res.json(achats);
  } catch (err) {
    next(err);
  }
});

 // Cette route sert à avoir le total de tous les achats
router.get("/stats/total", async (req, res, next) => {
  try {
    const stats = await Achat.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }, // somme de tous les montants
          countAchats: { $sum: 1 }          // nombre d'achats
        }
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          countAchats: 1,
        }
      }
    ]);

    // stats[0] si il y a des achats, sinon on renvoie des valeurs à 0
    res.json(stats[0] || { totalAmount: 0, countAchats: 0 });
  } catch (err) {
    next(err);
  }
});

 // Cette route sert à avoir le total par catégorie de dépense
router.get("/stats/by-category", async (req, res, next) => {
  try {
    const stats = await Achat.aggregate([
      {
        $group: {
          _id: "$depense",             // on regroupe par depense
          totalAmount: { $sum: "$amount" },
          countAchats: { $sum: 1 },
        }
      },
      {
        $lookup: {
          from: "depenses",            // nom de la collection des catégories
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
          countAchats: 1,
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

import fs from "fs";
import path from "path";

// totalement optionnel mais :
 // route sert à exporter des stats dans un fichier JSON
router.get("/export", async (req, res, next) => {
  try {
    // On calcule juste le total des achats
    const stats = await Achat.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          countAchats: { $sum: 1 }
        }
      }
    ]);

    // S'il n'y a pas d'achats, on met des valeurs par défaut
    const results = stats[0] || { totalAmount: 0, countAchats: 0 };

    // On crée le chemin vers data/stats_export.json
    const filePath = path.join("data", "stats_export.json");

    // On écrit les données dans le fichier
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));

    // On renvoie un message simple
    res.json({
      message: "Les statistiques ont été exportées dans data/stats_export.json",
      stats: results
    });

  } catch (err) {
    next(err);
  }
});

export default router;
