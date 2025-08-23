import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { JwtPayload } from '../interface/auth-interface';

export const imageUploadOptions = (subfolder: 'profile' | 'arts' | 'news') => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (subfolder === 'profile' || subfolder === 'arts') {
        const user = req.user as JwtPayload;
        const studentId = req.body?.studentId || user.studentId;
        if (!studentId) {
          return cb(new BadRequestException('studentId is required'), '');
        }
        const folder = join(process.cwd(), 'uploads', studentId, subfolder);
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
      }
      else {
        const folder = join(process.cwd(), 'uploads', 'Admin' , subfolder );
        fs.mkdirSync(folder, { recursive: true})
        cb(null, folder)
      }
    },
    filename: (req, file, callback) => {
      if (subfolder === 'profile') {
        const ext = extname(file.originalname);
        const user = req.user as JwtPayload;
        const studentId = req.body?.studentId || user.studentId;
        const username = req.body?.username?.th || user.username?.th;
        const filename = `${studentId}-${username}${ext}`;
        callback(null, filename);
      } else if (subfolder === 'arts') {
        const ext = extname(file.originalname);
        const artname = req.body?.artname;
        const artId = req.body?.artId;
        const filename = `${artId}-${artname}${ext}`;
        callback(null, filename);
      } else if (subfolder === 'news'){
        const ext = extname(file.originalname)
        const newstitle = req.body?.title
        const filename = `${newstitle}${ext}`;
        callback(null, filename)
      }
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(
        new BadRequestException('Only image files are allowed'),
        false,
      );
    }
    callback(null, true);
  },
});
