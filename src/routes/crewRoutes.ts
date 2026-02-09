// crewRoutes.ts
import express from "express";
import {
  createCrew,
  getAllCrew,
  getCrewById,
  updateCrew,
  deleteCrew,
  updateCrewStatus
} from "../controllers/crew";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";
import { uploadImages } from "../middlewares/testMulter";

const router = express.Router();

// Public routes (no authentication needed)
router.get("/", getAllCrew);
router.get("/:id", getCrewById);

// Protected routes (require authentication)
router.post("/", 
  authenticateJWT, // Add authentication
  requireAdmin, // Add admin check
  uploadImages.fields([{ name: "image", maxCount: 1 }]),
  createCrew
);

router.put("/:id", 
  authenticateJWT, // Add authentication
  requireAdmin, // Add admin check
  uploadImages.fields([{ name: "image", maxCount: 1 }]),
  updateCrew
);

router.delete("/:id", 
  authenticateJWT, // Already has this
  requireAdmin, // Already has this
  deleteCrew
);



export default router;