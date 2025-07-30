// models/DoctorPatientMessage.js

import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const DoctorPatientMessageSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    sender: { type: String, enum: ["doctor", "patient"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.DoctorPatientMessage || model("DoctorPatientMessage", DoctorPatientMessageSchema);