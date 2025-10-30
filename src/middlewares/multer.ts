import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary";

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
