import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { JwtPayload } from '../interface/auth-interface';
import { Request } from 'express';

interface UploadRequest extends Request {
  user: JwtPayload;
  body: {
    studentId?: string;
    username?: { th?: string };
    artname?: string;
    artId?: string;
    title?: string;
  };
}

export const imageUploadOptions = (subfolder: 'profile' | 'arts' | 'news') => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const typedReq = req as UploadRequest;
      const user = typedReq.user;
      const studentId = typedReq.body?.studentId || user.studentId;
      if (subfolder === 'profile' || subfolder === 'arts') {
        if (!studentId) {
          return cb(new BadRequestException('studentId is required'), '');
        }
        const folder = join(process.cwd(), 'uploads', studentId, subfolder);
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
      } else {
        const folder = join(process.cwd(), 'uploads', 'Admin', subfolder);
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
      }
    },
    filename: (req, file, callback) => {
      const typedReq = req as UploadRequest;
      const ext = extname(file.originalname);
      if (subfolder === 'profile') {
        const user = typedReq.user;
        const studentId = typedReq.body?.studentId || user.studentId;
        const username = typedReq.body?.username?.th || user.username?.th;
        const filename = `${studentId}-${username}${ext}`;
        callback(null, filename);
      } else if (subfolder === 'arts') {
        const artname = typedReq.body?.artname;
        const artId = typedReq.body?.artId;
        const filename = `${artId}-${artname}${ext}`;
        callback(null, filename);
      } else if (subfolder === 'news') {
        const newstitle = typedReq.body?.title;
        const filename = `${newstitle}${ext}`;
        callback(null, filename);
      }
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  fileFilter: (
    req: UploadRequest,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Only JPEG, PNG, and WEBP images are allowed'),
        false,
      );
    }
    callback(null, true);
  },
});
