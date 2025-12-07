// routes/users.routes.js

import express from "express";
import validator from "validator";
import User from "../models/User.js";

const router = express.Router();

 // route qui sert à créer un utilisateur
router.post("/", async (req, res, next) => {
  try {
    // On récupère les infos envoyées
    const { firstName, lastName, salary, job } = req.body;

    // Vérifier que les champs obligatoires sont là
    if (!firstName || !lastName || salary === undefined) {
      const error = new Error("Il manque firstName, lastName ou salary");
      error.statusCode = 400;
      throw error;
    }

    // Vérifier que le salaire est un nombre positif
    const isNumeric = validator.isNumeric(String(salary), { no_symbols: true });

    if (!isNumeric || Number(salary) < 0) {
      const error = new Error("Le salaire doit être un nombre positif");
      error.statusCode = 400;
      throw error;
    }

    // On crée l'utilisateur dans la base
    const newUser = await User.create({
      firstName,
      lastName,
      salary: Number(salary),
      job,
    });

    // On renvoie l'utilisateur créé
    res.status(201).json(newUser);

  } catch (err) {
    next(err);
  }
});


 // route qui sert à afficher tous les utilisateurs
router.get("/", async (req, res, next) => {
  try {
    // On récupère tous les utilisateurs
    const users = await User.find();

    // On renvoie la liste
    res.json(users);

  } catch (err) {
    next(err);
  }
});

 // Cette route sert à filtrer les utilisateurs
router.get("/search", async (req, res, next) => {
  try {
    const { job, minSalary, maxSalary } = req.query;

    const filter = {};

    // Filtre par job
    if (job) {
      filter.job = { $regex: job, $options: "i" };
    }

    // Filtre par salaire min / max
    if (minSalary || maxSalary) {
      filter.salary = {};

      if (minSalary) {
        if (!validator.isNumeric(String(minSalary), { no_symbols: true })) {
          const error = new Error("minSalary doit être un nombre");
          error.statusCode = 400;
          throw error;
        }
        filter.salary.$gte = Number(minSalary);
      }

      if (maxSalary) {
        if (!validator.isNumeric(String(maxSalary), { no_symbols: true })) {
          const error = new Error("maxSalary doit être un nombre");
          error.statusCode = 400;
          throw error;
        }
        filter.salary.$lte = Number(maxSalary);
      }
    }

    // On récupère les users qui correspondent aux filtres
    const users = await User.find(filter);

    res.json(users);

  } catch (err) {
    next(err);
  }
});

 // route qui sert à avoir des stats sur les salaires
 // (moyenne, minimum, maximum, nombre d'utilisateurs)
router.get("/stats/salary", async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          avgSalary: { $avg: "$salary" },
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" },
          countUsers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avgSalary: 1,
          minSalary: 1,
          maxSalary: 1,
          countUsers: 1,
        },
      },
    ]);

    // On renvoie le tableau de stats
    res.json(stats[0] || { avgSalary: 0, minSalary: 0, maxSalary: 0, countUsers: 0 });

  } catch (err) {
    next(err);
  }
});

 // route qui sert à afficher un utilisateur précis avec son id
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Utilisateur non trouvé");
      error.statusCode = 404;
      throw error;
    }

    res.json(user);

  } catch (err) {
    next(err);
  }
});

 // route qui sert à modifier un utilisateur
router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, salary, job } = req.body;

    // Si un salaire est envoyé, on vérifie qu'il est correct
    if (salary !== undefined) {
      const isNumeric = validator.isNumeric(String(salary), { no_symbols: true });

      if (!isNumeric || Number(salary) < 0) {
        const error = new Error("Le salaire doit être un nombre positif");
        error.statusCode = 400;
        throw error;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, salary, job },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      const error = new Error("Utilisateur non trouvé");
      error.statusCode = 404;
      throw error;
    }

    res.json(updatedUser);

  } catch (err) {
    next(err);
  }
});

  // route qui sert à supprimer un utilisateur
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      const error = new Error("Utilisateur non trouvé");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "Utilisateur supprimé" });

  } catch (err) {
    next(err);
  }
});

export default router;
