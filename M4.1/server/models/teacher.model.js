// server/models/teacher.model.js
import mongoose from "mongoose";

const DegreeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    school: { type: String, required: true },
    major: { type: String, required: true },
    year: { type: Number, required: true },
    isGraduated: { type: Boolean, required: true },
  },
  { _id: false }
);

const TeacherSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    code: { type: String, unique: true, index: true, required: true },
    startDate: { type: Date },
    endDate: { type: Date }, // optional
    teacherPositions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TeacherPosition", required: true }
    ],
    degrees: { type: [DegreeSchema], default: [], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", TeacherSchema);
