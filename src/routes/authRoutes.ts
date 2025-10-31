import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
} from "../controllers/user";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);

export default router;