import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  guilds: { type: [String], default: [] },
  username: { type: String },
  discriminator: { type: String },
  avatar: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});

authUserSchema.index({ guilds: 1 });

export const AuthUser = mongoose.model("AuthUser", authUserSchema);
