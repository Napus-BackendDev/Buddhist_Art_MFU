import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";

export const imageUploadOptions = {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      }
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit 
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        return callback(new BadRequestException('Only image files are allowed'), false);
      }
      callback(null, true);
    }
  }