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

export const getAllCrew = async (req: Request, res: Response) => {
  try {
    const crew = await Crew.find();
    res.json(crew);
  } catch (err) {
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
