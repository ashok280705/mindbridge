import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const MessageSchema = new Schema({
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
  sender: {
    type: String,
    enum: ["user", "ai", "doctor"],
    required: true,
  },
  text: { type: String, required: true },
}, { timestamps: true });

export default models.Message || model("Message", MessageSchema);