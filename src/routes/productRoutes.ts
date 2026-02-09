import { Router } from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  getFeaturedProducts,
  getPublishedProducts
} from "../controllers/product";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";
import { uploadSingleImage, processSingleImage } from "../middlewares/multer";
import { uploadImages } from "../middlewares/testMulter";


const router = Router();

// Public routes
router.get("/published", getPublishedProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductDetails);

// Admin routes with image upload support
// Admin routes with image upload support
router.post("/", 
  uploadImages.fields([
  { name: "image", maxCount: 1 }
]),
  addProduct
);

router.put("/:id", authenticateJWT, requireAdmin, uploadImages.fields([
  { name: "image", maxCount: 1 }
]), updateProduct);

router.delete("/:id", authenticateJWT, requireAdmin, deleteProduct);
router.get("/", authenticateJWT, requireAdmin, getAllProducts);

export default router;