import mongoose from "mongoose";

const PeriodEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    flowLevel: { type: String, enum: ["light", "medium", "heavy"], default: "medium" },
    painLevel: { type: Number, min: 0, max: 10 },
    mood: { type: String },
    symptoms: [{ type: String }], // cramps, fatigue, etc.
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.PeriodEntry ||
  mongoose.model("PeriodEntry", PeriodEntrySchema);