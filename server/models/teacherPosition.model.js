import mongoose from "mongoose";

const TeacherPositionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    des: { type: String, required: true },
    isActive: { type: Boolean, default: true, required: true },
    isDeleted: { type: Boolean, default: false },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("TeacherPosition", TeacherPositionSchema);
