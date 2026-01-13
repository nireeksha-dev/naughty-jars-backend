import express from "express";
import {
  createCrew,
  getAllCrew,
  getCrewById,
  updateCrew,
  deleteCrew,
} from "../controllers/crew";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";

const router = express.Router();

router.post("/", authenticateJWT, requireAdmin, createCrew);
router.get("/", getAllCrew);
router.get("/:id", getCrewById);
router.put("/:id", authenticateJWT, requireAdmin, updateCrew);
router.delete("/:id", authenticateJWT, requireAdmin, deleteCrew);

export default router;