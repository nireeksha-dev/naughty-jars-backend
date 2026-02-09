import sharp from "sharp";
import fs from "fs";
import path from "path";

interface SaveImagesOptions {
  folder: string;     
  resize?: number;        
  quality?: number;        
}

export const saveImages = async (
  files: Express.Multer.File[],
  options: SaveImagesOptions
): Promise<string[]> => {
  const { folder, resize = 1200, quality = 80 } = options;
  const uploadDir = path.join(process.cwd(), "uploads", folder);
  const { v4: uuid } = await import("uuid");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const imageUrls: string[] = [];

  for (const file of files) {
    const filename = `${uuid()}.webp`;
    const filepath = path.join(uploadDir, filename);

    await sharp(file.buffer)
      .resize({ width: resize, withoutEnlargement: true })
      .webp({ quality })
      .toFile(filepath);

    imageUrls.push(`uploads/${folder}/${filename}`);
  }

  return imageUrls;
};