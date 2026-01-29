import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/discord-dashboard";

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};
