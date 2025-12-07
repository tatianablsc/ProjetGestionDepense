import mongoose from "mongoose";

const achatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "L'utilisateur est obligatoire pour un achat"],
  },
  depense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Depense",
    required: [true, "La catégorie de dépense est obligatoire"],
  },
  amount: {
    type: Number,
    required: [true, "Le montant de l'achat est obligatoire"],
    min: [0, "Le montant doit être un nombre positif"],
  },
  date: {
    type: Date,
    required: [true, "La date de l'achat est obligatoire"],
  },
  description: {
    type: String,
    trim: true,
  }
});

export default mongoose.model("Achat", achatSchema);