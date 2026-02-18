// routes/productRoutes.ts
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
import { uploadImages } from "../middlewares/testMulter";

const router = Router();

// PUBLIC ROUTES - SPECIFIC FIRST, PARAMETERIZED LAST
router.get("/published", getPublishedProducts);  // Specific route first
router.get("/featured", getFeaturedProducts);    // Specific route second
router.get("/:id", getProductDetails);           // Parameterized route last

// ADMIN ROUTES (all protected)
router.post("/", 
  authenticateJWT, 
  requireAdmin, 
  uploadImages.array('images', 10), 
  addProduct
);

router.put("/:id", 
  authenticateJWT, 
  requireAdmin, 
  uploadImages.array('images', 10), 
  updateProduct
);

router.delete("/:id", authenticateJWT, requireAdmin, deleteProduct);
router.get("/", authenticateJWT, requireAdmin, getAllProducts);

export default router;