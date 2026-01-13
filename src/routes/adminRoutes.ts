// routes/adminRoutes.ts
import { Router } from "express";
import User from "../models/user";
import { authenticateJWT } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/adminAuth";

const router = Router();

// Promote user to admin (only accessible by existing admins)
router.patch("/promote/:userId", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: "admin" },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ 
      message: "User promoted to admin", 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get all users (admin only)
router.get("/users", authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;