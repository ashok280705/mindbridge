// models/Room.js

import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const RoomSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    counselorMessages: [{ type: Schema.Types.ObjectId, ref: "CounselorMessage" }],
    doctorPatientMessages: [{ type: Schema.Types.ObjectId, ref: "DoctorPatientMessage" }],
    dangerCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Room || model("Room", RoomSchema);