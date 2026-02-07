import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary";

// Create blog-specific upload middleware
export const blogUpload = multer({ 
  storage: multer.memoryStorage() 
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'thumbnailImage', maxCount: 1 }
]);

export const processBlogImages = async (req: any, res: any, next: any) => {
  if (!req.files) return next();
  
  try {
    // Process main image
    if (req.files.image) {
      const file = req.files.image[0];
      const resizedBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 400, fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();
        
      const cloudRes = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blog-images" },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(resizedBuffer);
      });
      
      req.body.image = (cloudRes as any).secure_url;
    }
    
    // Process thumbnail image
    if (req.files.thumbnailImage) {
      const file = req.files.thumbnailImage[0];
      const resizedBuffer = await sharp(file.buffer)
        .resize({ width: 400, height: 200, fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();
        
      const cloudRes = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blog-images/thumbnails" },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(resizedBuffer);
      });
      
      req.body.thumbnailImage = (cloudRes as any).secure_url;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};