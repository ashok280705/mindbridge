// models/CounselorMessage.js

import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const CounselorMessageSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sender: { type: String, enum: ["user", "ai"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.CounselorMessage || model("CounselorMessage", CounselorMessageSchema);