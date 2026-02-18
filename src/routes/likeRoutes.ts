// routes/likeRoutes.ts
import { Router } from "express";
import { 
  likeProduct, 
  unlikeProduct, 
  checkUserLike,
  getUserLikedProducts 
} from "../controllers/like";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

// All like routes require authentication
router.use(authenticateJWT);

// Like/unlike routes
router.post("/:productId/like", likeProduct);
router.delete("/:productId/like", unlikeProduct);
router.get("/:productId/check", checkUserLike);

// Get user's liked products
router.get("/user/liked", getUserLikedProducts);

export default router;