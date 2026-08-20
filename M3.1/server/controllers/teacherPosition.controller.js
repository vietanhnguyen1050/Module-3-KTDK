import TeacherPosition from "../models/teacherPosition.model.js";

export const getPositions = async (req, res) => {
  const positions = await TeacherPosition.find({ isDeleted: false });
  res.json(positions);
};

export const createPosition = async (req, res) => {
  const { code, name, des, isActive } = req.body;

  if (!code || !name || !des || typeof isActive === "undefined") {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const exists = await TeacherPosition.findOne({ code });
  if (exists) {
    return res.status(400).json({ message: "Code already exists" });
  }

  const pos = await TeacherPosition.create({ code, name, des, isActive });
  res.status(201).json(pos);
};
