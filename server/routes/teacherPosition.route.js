import express from "express";
import { getPositions, createPosition } from "../controllers/teacherPosition.controller.js";

const router = express.Router();

router.get("/", getPositions);
router.post("/", createPosition);

export default router;
