import sharp from "sharp";
import path from "path";
import fs from "fs";

interface SaveImagesOptions {
  folder?: string;
  width?: number;
  height?: number;
  quality?: number;
}

export const saveImages = async (
  files: Express.Multer.File[],
  options: SaveImagesOptions = {}
): Promise<string[]> => {
  const {
    folder = "uploads",
    width = 800,
    height = 800,
    quality = 80
  } = options;

  const uploadDir = path.join(__dirname, `../public/uploads/${folder}`);
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const imageUrls: string[] = [];

  for (const file of files) {
    if (!file) continue;

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const ext = file.originalname.split('.').pop() || 'jpg';
    const filename = `${folder}-${timestamp}-${random}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Process image with sharp
    await sharp(file.buffer)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toFile(filepath);

    // Return URL path
    imageUrls.push(`/uploads/${folder}/${filename}`);
  }

  return imageUrls;
};