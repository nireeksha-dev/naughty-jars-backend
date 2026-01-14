import Product from "../models/product";
import { Request, Response } from "express";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const images = req.body.images || [];
    const product = await Product.create({ name, description, price, images });
    res.status(201).json(product);
    if (!name || !price || !description) {
      res.status(404).json({ success: false, message: "all fields required" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try { 
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
