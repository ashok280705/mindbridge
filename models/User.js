// File: models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    googleId: String,
    phone: String,
    emergency: String,
    birthdate: String, // new field
    gender: String     // new field
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);