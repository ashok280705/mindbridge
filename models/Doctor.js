import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  specialization: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
  },
});

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);