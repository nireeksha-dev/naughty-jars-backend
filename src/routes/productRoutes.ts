import { Router } from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  getFeaturedProducts,
  uploadProductImages
} from "../controllers/product";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";
import { upload, processAndUploadImages } from "../middlewares/multer";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductDetails);

// Image upload endpoint (for separate image uploads)
router.post("/upload", 
  authenticateJWT, 
  requireAdmin,
  upload,
  processAndUploadImages,
  uploadProductImages
);

// Admin routes
router.post("/", 
  authenticateJWT, 
  requireAdmin,
  upload,
  processAndUploadImages,
  addProduct
);

router.put("/:id", 
  authenticateJWT, 
  requireAdmin,
  upload,
  processAndUploadImages,
  updateProduct
);

router.delete("/:id", authenticateJWT, requireAdmin, deleteProduct);

export default router;