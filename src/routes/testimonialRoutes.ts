import { Router } from "express";
import { createTestimonial, getTestimonials } from "../controllers/testimonial";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";

const router = Router();
router.post("/", authenticateJWT, requireAdmin, createTestimonial);
router.get("/", getTestimonials);

export default router;