import dbConnect from "@/lib/dbConnect";
import Doctor from "@/models/Doctor";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  const { name, email, password, phone, licenseNumber, specialization } =
    await req.json();

  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    return new Response(JSON.stringify({ error: "Doctor already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Doctor.create({
    name,
    email,
    password: hashedPassword,
    phone,
    licenseNumber,
    specialization,
    status: "offline",
  });

  return new Response(JSON.stringify({ message: "Doctor registered" }), {
    status: 201,
  });
}