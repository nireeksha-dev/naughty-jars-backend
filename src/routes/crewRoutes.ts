import express from "express";
import {
  createCrew,
  getAllCrew,
  getCrewById,
  updateCrew,
  deleteCrew,
} from "../controllers/crew";

const router = express.Router();

router.post("/", createCrew);
router.get("/", getAllCrew);
router.get("/:id", getCrewById);
router.put("/:id", updateCrew);
router.delete("/:id", deleteCrew);

export default router;
