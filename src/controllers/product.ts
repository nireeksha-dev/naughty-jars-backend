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
      stock,
      tags,
      isFeatured,
      status
    } = req.body;
    
    const images = req.body.images || [];
    const thumbnailImage = req.body.thumbnailImage || (images.length > 0 ? images[0] : null);

    // Validation
    if (!name || !price || !description || !weight || !type) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, price, description, weight, and type are required fields" 
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Create product with all fields
    const product = await Product.create({ 
      name,
      slug,
      description, 
      price: parseFloat(price),
      weight,
      type,
      images,
      thumbnailImage,
      stock: parseInt(stock) || 0,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      isFeatured: isFeatured === 'true' || isFeatured === true,
      status: status || "draft"
    });

    // Format response to match UI structure
    const formattedProduct = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
      weight: product.weight,
      reviews: product.reviews,
      type: product.type,
      stock: product.stock,
      isFeatured: product.isFeatured,
      tags: product.tags,
      status: product.status,
      createdAt: product.createdAt.toISOString()
    };

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: formattedProduct
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
    
    // Handle status changes
    if (updateData.status === "published" && !req.body.publishedAt) {
      updateData.publishedAt = new Date();
    }
    
    // If new images are uploaded, update thumbnailImage if not explicitly set
    if (updateData.images && updateData.images.length > 0 && !updateData.thumbnailImage) {
      updateData.thumbnailImage = updateData.images[0];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    
    if (!product) return res.status(404).json({ 
      success: false,
      message: "Product not found" 
    });

    // Format response to match UI structure
    const formattedProduct = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
      weight: product.weight,
      reviews: product.reviews,
      type: product.type,
      stock: product.stock,
      isFeatured: product.isFeatured,
      tags: product.tags,
      status: product.status,
      createdAt: product.createdAt.toISOString()
    };
    
    res.json({
      success: true,
      message: "Product updated successfully",
      product: formattedProduct
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

    // Format response to match UI structure
    const formattedProduct = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
      weight: product.weight,
      reviews: product.reviews,
      type: product.type,
      stock: product.stock,
      isFeatured: product.isFeatured,
      tags: product.tags,
      status: product.status,
      createdAt: product.createdAt.toISOString()
    };
    
    res.json({
      success: true,
      product: formattedProduct
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
      tags,
      status
    } = req.query;
    
    const filter: any = {};
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    // Apply filters
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (featured === 'true') filter.isFeatured = true;
    if (status) filter.status = status;
    
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      Product.countDocuments(filter)
    ]);

    // Format products to match UI structure
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
      weight: product.weight,
      reviews: product.reviews,
      type: product.type,
      stock: product.stock,
      isFeatured: product.isFeatured,
      tags: product.tags,
      status: product.status,
      createdAt: product.createdAt.toISOString()
    }));
    
    res.json({
      success: true,
      products: formattedProducts,
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

// Get published products for frontend
export const getPublishedProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      type,
      minPrice,
      maxPrice,
      search,
      featured
    } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const filter: any = { status: "published" };
    
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      Product.countDocuments(filter)
    ]);

    // Format products
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
      weight: product.weight,
      reviews: product.reviews,
      type: product.type,
      stock: product.stock,
      isFeatured: product.isFeatured,
      tags: product.tags,
      createdAt: product.createdAt.toISOString()
    }));

    res.json({
      success: true,
      products: formattedProducts,
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

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ 
      isFeatured: true,
      status: "published"
    })
    .limit(10);

    // Format products
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
      weight: product.weight,
      reviews: product.reviews,
      type: product.type,
      createdAt: product.createdAt.toISOString()
    }));
    
    res.json({
      success: true,
      products: formattedProducts
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};