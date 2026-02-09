import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../public/uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create product-specific upload middleware (SIMPLE LIKE BLOG)
export const uploadProductImages = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Max 10 images
  }
}).array('images'); // Accept multiple images

export const processProductImages = async (req: any, res: any, next: any) => {
  console.log('=== PROCESS PRODUCT IMAGES START ===');
  console.log('Has files:', !!req.files);
  
  if (!req.files || req.files.length === 0) {
    console.log('No files to process');
    return next();
  }
  
  console.log('Number of files received:', req.files.length);
  
  try {
    const imageUrls = [];
    
    // Process each uploaded image
    for (const file of req.files) {
      console.log(`Processing image: ${file.originalname}`);
      
      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const originalName = file.originalname.replace(/\s+/g, '-').toLowerCase();
      const filename = `product-${timestamp}-${random}-${originalName}`;
      const filepath = path.join(uploadsDir, filename);
      
      // Resize and save image (optimize for web)
      await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(filepath);
      
      // Create URL (relative path)
      const imageUrl = `/uploads/products/${filename}`;
      imageUrls.push(imageUrl);
      console.log('Image saved:', imageUrl);
    }
    
    // Save URLs in request body
    req.body.images = imageUrls;
    
    // If thumbnail not provided, use first image
    if (!req.body.thumbnail && imageUrls.length > 0) {
      req.body.thumbnail = imageUrls[0];
    }
    
    console.log('=== PROCESS PRODUCT IMAGES COMPLETE ===');
    console.log('Images array:', req.body.images);
    console.log('Thumbnail:', req.body.thumbnail);
    
    next();
  } catch (error: any) {
    console.error('ERROR in processProductImages:', error);
    return res.status(400).json({ 
      error: 'Image processing failed',
      message: error.message
    });
  }
}

// In multer.ts, add:
export const uploadSingleImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single('image');
  
  export const processSingleImage = async (req: any, res: any, next: any) => {
    if (!req.file) {
      return next();
    }
    
    const uploadsDir = path.join(__dirname, '../public/uploads/crew');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const filename = `crew-${timestamp}-${random}.jpg`;
      const filepath = path.join(uploadsDir, filename);
      
      await sharp(req.file.buffer)
        .resize({ width: 400, height: 400, fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(filepath);
      
      req.body.image = `/uploads/crew/${filename}`;
      next();
    } catch (error: any) {
      return res.status(400).json({ 
        error: 'Image processing failed',
        message: error.message
      });
    }
  };