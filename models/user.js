import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Le prénom est obligatoire"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, "Le salaire est obligatoire"],
    min: [0, "Le salaire doit être un nombre positif"],
  },
  job: {
    type: String,
    default: "Non renseigné",
    trim: true,
  }
});

export default mongoose.model("User", userSchema);
