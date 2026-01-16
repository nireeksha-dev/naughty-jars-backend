import { Request, Response } from "express";
import Crew from "../models/crew";

export const createCrew = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.create(req.body);
    res.status(201).json(crew);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// export const createCrew = async (req: Request, res: Response) => {
//   try {
//     const { name, position, contact, email, status } = req.body;

//     // 1️⃣ Validate input
//     if (!name || !position || !contact || !email) {
//       return res.status(400).json({
//         message: "All fields (name, position, contact, email) are required",
//       });
//     }

//     // 2️⃣ Check duplicate email in Crew collection
//     const existingCrew = await Crew.findOne({ email });
//     if (existingCrew) {
//       return res.status(409).json({ message: "Crew with this email already exists" });
//     }

//     // 3️⃣ Create Crew document (no password)
//     const crew = await Crew.create({ name, position, contact, email, status });

//     // 4️⃣ Create User document for login
    // const defaultPassword = "Crew@123"; // plain text, User model will hash it automatically
    // const user = await User.create({
    //   username: name,
    //   email,
    //   password: defaultPassword,
    //   role: "crew",
    // });

//     res.status(201).json({
//       message: "Crew and user account created successfully",
//       crew,
//       user,
//       defaultPassword, // so admin can share with crew
//     });
//   } catch (err) {
//     console.error("🔥 Create crew error:", err);
//     res.status(500).json({ message: "Internal Server Error", error: (err as Error).message });
//   }
// };

export const getAllCrew = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.find();
    // console.log("Crew fetched:", crew);
    res.json(crew);
  } catch (err) {
    // console.error("Error fetching crew:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getCrewById = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.findById(req.params.id);
    if (!crew) return res.status(404).json({ message: "Crew not found" });
    res.json(crew);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateCrew = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crew) return res.status(404).json({ message: "Crew not found" });
    res.json(crew);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteCrew = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    if (!crew) return res.status(404).json({ message: "Crew not found" });
    res.json({ message: "Crew deleted" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
