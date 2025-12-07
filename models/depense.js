import mongoose from "mongoose";

const depenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de la dépense est obligatoire"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  }
});

export default mongoose.model("Depense", depenseSchema);