
import express from "express";
import mongoose from "mongoose";
import Depense from "../models/Depense.js";
import Achat from "../models/Achat.js";

const router = express.Router();

 // route sert à créer une nouvelle catégorie de dépense
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

export default router;
