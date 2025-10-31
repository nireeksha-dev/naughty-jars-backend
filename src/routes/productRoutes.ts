import { Router } from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
} from "../controllers/product";
import { authenticateJWT } from "../middlewares/auth";
import { processAndUploadImages } from "../middlewares/multer";

const router = Router();

router.post("/", authenticateJWT, processAndUploadImages, addProduct); // Add with images
router.put("/:id", authenticateJWT, processAndUploadImages, updateProduct); // Update with images
router.delete("/:id", authenticateJWT, deleteProduct); // Delete
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductDetails); // Get product details

export default router;
