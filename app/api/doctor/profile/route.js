// app/api/doctor/profile/route.js
import dbConnect from "@/lib/dbConnect";
import Doctor from "@/models/Doctor";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  await dbConnect();

  try {
    const { email, name, phone, licenseNumber, specialization, password } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return new Response(JSON.stringify({ message: "Doctor not found" }), { status: 404 });
    }

    // Update fields if provided
    if (name) doctor.name = name;
    if (phone) doctor.phone = phone;
    if (licenseNumber) doctor.licenseNumber = licenseNumber;
    if (specialization) doctor.specialization = specialization;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      doctor.password = await bcrypt.hash(password, salt);
    }

    await doctor.save();

    return new Response(JSON.stringify({ message: "Doctor profile updated successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}