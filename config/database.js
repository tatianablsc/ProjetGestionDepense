import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // L'URL vient du fichier .env (variable MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connecté à MongoDB");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error.message);
    process.exit(1);
  }
};
