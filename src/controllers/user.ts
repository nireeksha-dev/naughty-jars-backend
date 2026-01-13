import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// registerUser function
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Prevent users from registering as admin by default
    const userRole = role === "admin" ? "user" : (role || "user");

    const user = await User.create({
      username,
      email,
      password: password,
      role: userRole,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.role === "admin"
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
// loginUser function
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin",
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
