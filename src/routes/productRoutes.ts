// routes/productRoutes.ts
import { Router } from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
} from "../controllers/product";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";
import { processAndUploadImages } from "../middlewares/multer";

const router = Router();

router.post("/", authenticateJWT, requireAdmin, processAndUploadImages, addProduct);
router.put("/:id", authenticateJWT, requireAdmin, processAndUploadImages, updateProduct);
router.delete("/:id", authenticateJWT, requireAdmin, deleteProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductDetails);

export default router;