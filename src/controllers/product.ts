import Product from "../models/product";
import { Request, Response } from "express";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      description, 
      price, 
      weight, 
      type, 
      category,
      stock,
      tags,
      isFeatured 
    } = req.body;
    
    const images = req.body.images || [];
    const thumbnail = req.body.thumbnail || (images.length > 0 ? images[0] : null);

    // Validation
    if (!name || !price || !description || !weight || !type) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, price, description, weight, and type are required fields" 
      });
    }

    // Create product with all fields
    const product = await Product.create({ 
      name, 
      description, 
      price: parseFloat(price),
      weight,
      type,
      images,
      thumbnail,
      category: category || undefined,
      stock: parseInt(stock) || 0,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      isFeatured: isFeatured === 'true' || isFeatured === true
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try { 
    const updateData = { ...req.body };
    
    // Handle numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.reviews) updateData.reviews = parseInt(updateData.reviews);
    
    // Handle tags if provided as string
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }
    
    // Handle boolean field
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }
    
    // If new images are uploaded, update thumbnail if not explicitly set
    if (updateData.images && updateData.images.length > 0 && !updateData.thumbnail) {
      updateData.thumbnail = updateData.images[0];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    
    if (!product) return res.status(404).json({ 
      success: false,
      message: "Product not found" 
    });
    
    res.json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ 
      success: false,
      message: "Product not found" 
    });
    res.json({ 
      success: true,
      message: "Product deleted successfully" 
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ 
      success: false,
      message: "Product not found" 
    });
    
    // Increment view count or similar analytics could be added here
    
    res.json({
      success: true,
      product
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      type, 
      minPrice, 
      maxPrice, 
      search,
      page = 1,
      limit = 20,
      featured,
      tags
    } = req.query;
    
    const filter: any = {};
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    // Apply filters
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (featured === 'true') filter.isFeatured = true;
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }
    
    // Tag filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .select('name price images thumbnail weight description type category stock isFeatured tags')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      Product.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string)),
        limit: parseInt(limit as string)
      }
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Additional controller for featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .select('name price thumbnail weight type')
      .limit(10);
    
    res.json({
      success: true,
      products
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Controller for uploading product images
export const uploadProductImages = async (req: any, res: Response) => {
  try {
    // This middleware will handle the upload via processAndUploadImages
    // Images will be available in req.body.images
    
    res.json({
      success: true,
      images: req.body.images || [],
      thumbnail: req.body.thumbnail || null,
      message: "Images uploaded successfully"
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};