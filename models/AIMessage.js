import mongoose from "mongoose";

const AIMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  from: { type: String, enum: ["user", "ai"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AIMessage || mongoose.model("AIMessage", AIMessageSchema);