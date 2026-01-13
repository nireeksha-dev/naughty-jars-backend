// middlewares/adminAuth.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = (req as any).user;
    
    if (!userData) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch fresh user data to check role
    const user = await User.findById(userData.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};