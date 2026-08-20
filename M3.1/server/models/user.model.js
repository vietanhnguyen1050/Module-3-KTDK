import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    identity: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      default: "TEACHER",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
