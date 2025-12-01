import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import teacherRoutes from "./routes/teacher.route.js";
import positionRoutes from "./routes/teacherPosition.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log("Mongo error:", err));

app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/teacher-positions", positionRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
