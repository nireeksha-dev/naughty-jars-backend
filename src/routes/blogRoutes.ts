import { Router } from "express";
import { 
  createBlog, 
  updateBlog, 
  getBlog, 
  getAllBlogs, 
  getPublishedBlogs, 
  deleteBlog 
} from "../controllers/blog";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";
import { uploadSingleImage, processSingleImage } from "../middlewares/multer";
import { uploadImages } from "../middlewares/testMulter";


const router = Router();

// Public routes
router.get("/published", getPublishedBlogs);
router.get("/:id", getBlog);

// Admin routes with image upload support
router.post("/", authenticateJWT, requireAdmin, uploadImages.fields([
  { name: "image", maxCount: 1 }
]), createBlog);

router.put("/:id", authenticateJWT, requireAdmin, uploadImages.fields([
  { name: "image", maxCount: 1 }
]), updateBlog);

router.delete("/:id", authenticateJWT, requireAdmin, deleteBlog);
router.get("/", authenticateJWT, requireAdmin, getAllBlogs);

export default router;