import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary";

// Export multer for use in other files
export { multer };

const storage = multer.memoryStorage();
// array of upto 5 images
export const upload = multer({ storage }).array("images", 5);

export const processAndUploadImages = async (req: any, res: any, next: any) => {
  if (!req.files) return next();
  req.body.images = [];

  for (const file of req.files) {
    const resizedBuffer = await sharp(file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();
    const cloudRes = await cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error: any, result: any) => {
        if (error) return next(error);
        req.body.images.push(result.secure_url);
      }
    );
    cloudRes.end(resizedBuffer);
  }
  next();
};
// Crew-specific upload middleware
export const uploadCrewImage = multer({ storage }).single("crewImage");

export const processAndUploadCrewImage = async (req: any, res: any, next: any) => {
  if (!req.file) return next();
  
  try {
    const resizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 400, height: 400, fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();
      
    const imageUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "crew" },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      ).end(resizedBuffer);
    });
    
    req.body.image = imageUrl;
    
    next();
  } catch (error: any) {
    next(error);
  }
};