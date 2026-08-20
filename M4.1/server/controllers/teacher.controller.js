import Teacher from "../models/teacher.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getTeachers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const data = await Teacher.find({ isDeleted: false })
    .skip(skip)
    .limit(limit)
    .populate("userId")
    .populate("teacherPositions");

  const total = await Teacher.countDocuments({ isDeleted: false });

  res.json({
    data,
    meta: { page, limit, total }
  });
  console.log("Get teachers");
};

export const createTeacher = async (req, res) => {
  const body = req.body;

  const missing = ["name", "email", "identity", "phoneNumber", "address", "dob"];
  for (const f of missing) {
    if (!body[f]) return res.status(400).json({ message: `${f} is required` });
  }

  if (!body.teacherPositions || !body.teacherPositions.length) {
    return res.status(400).json({ message: "At least one position required" });
  }

  if (!body.degrees || !body.degrees.length) {
    return res.status(400).json({ message: "Degrees required" });
  }

  const emailExists = await User.findOne({ email: body.email });
  if (emailExists) return res.status(400).json({ message: "Email already exists" });

  const identityExists = await User.findOne({ identity: body.identity });
  if (identityExists) return res.status(400).json({ message: "Identity already exists" });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = await User.create(
      [
        {
          name: body.name,
          email: body.email,
          phoneNumber: body.phoneNumber,
          address: body.address,
          identity: body.identity,
          dob: body.dob
        }
      ],
      { session }
    );

    const teacherCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const newTeacher = await Teacher.create(
      [
        {
          userId: newUser[0]._id,
          code: teacherCode,
          teacherPositions: body.teacherPositions,
          degrees: body.degrees,
          isActive: body.isActive ?? true
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newTeacher[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};
