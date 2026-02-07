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
import { upload, processAndUploadImages } from "../middlewares/multer";
const router = express.Router();

// Admin routes with image upload support
router.post("/", 
  authenticateJWT, 
  requireAdmin,
  upload,
  processAndUploadImages,
  createCrew
);

router.put("/:id", 
  authenticateJWT, 
  requireAdmin,
  upload,
  processAndUploadImages,
  updateCrew
);

// Bulk status update
router.put("/status/bulk", 
  authenticateJWT, 
  requireAdmin,
  updateCrewStatus
);

// Public routes (can add authentication if needed)
router.get("/", getAllCrew);
router.get("/:id", getCrewById);

router.delete("/:id", authenticateJWT, requireAdmin, deleteCrew);

export default router;