import { Request, Response } from "express";
import Crew from "../models/crew";
import User from "../models/user"; // Assuming you have a User model

export const createCrew = async (req: Request, res: Response) => {
  try {
    const { name, position, contact, email, description, image, status } = req.body;

    // Validate input
    if (!name || !position || !contact || !email || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, position, contact, email, description) are required",
      });
    }

    // Check duplicate email
    const existingCrew = await Crew.findOne({ email });
    if (existingCrew) {
      return res.status(409).json({ 
        success: false,
        message: "Crew with this email already exists" 
      });
    }

    // Create crew member
    const crew = await Crew.create({ 
      name, 
      position, 
      contact, 
      email, 
      description,
      image: image || "https://picsum.photos/200/200?random=" + Math.random(), // Default image if none provided
      status: status || "active"
    });

    // Optional: Create user account for crew member
    // Uncomment if you want to create login credentials
    /*
    const defaultPassword = "Crew@123";
    const user = await User.create({
      username: name,
      email,
      password: defaultPassword,
      role: "crew",
    });
    */

    res.status(201).json({
      success: true,
      message: "Crew member created successfully",
      crew,
      // user, // Uncomment if creating user account
      // defaultPassword, // Uncomment if creating user account
    });
  } catch (err) {
    console.error("Create crew error:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error", 
      error: (err as Error).message 
    });
  }
};

export const getAllCrew = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    
    let filter: any = {};
    
    // Apply status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Apply search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const crew = await Crew.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      crew,
      total: crew.length
    });
  } catch (err) {
    console.error("Error fetching crew:", err);
    res.status(500).json({ 
      success: false,
      error: (err as Error).message 
    });
  }
};

export const getCrewById = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.findById(req.params.id);
    if (!crew) return res.status(404).json({ 
      success: false,
      message: "Crew member not found" 
    });
    
    res.json({
      success: true,
      crew
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: (err as Error).message 
    });
  }
};

export const updateCrew = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!crew) return res.status(404).json({ 
      success: false,
      message: "Crew member not found" 
    });
    
    res.json({
      success: true,
      message: "Crew member updated successfully",
      crew
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: (err as Error).message 
    });
  }
};

export const deleteCrew = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    if (!crew) return res.status(404).json({ 
      success: false,
      message: "Crew member not found" 
    });
    
    // Optional: Also delete associated user account
    // await User.findOneAndDelete({ email: crew.email });
    
    res.json({ 
      success: true,
      message: "Crew member deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: (err as Error).message 
    });
  }
};

// New endpoint for bulk status update
export const updateCrewStatus = async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body;
    
    if (!ids || !status) {
      return res.status(400).json({
        success: false,
        message: "IDs and status are required"
      });
    }
    
    const result = await Crew.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} crew members updated`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: (err as Error).message 
    });
  }
};