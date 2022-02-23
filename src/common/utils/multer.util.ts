import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';

interface UploadOptions {
  fileSize?: number;
  uploadPath: string;
  ext?: string[];
}

export const multerOptions = (option: UploadOptions): MulterOptions => ({
  limits: {
    fileSize: option.fileSize ? +option.fileSize : +process.env.MAX_FILE_SIZE,
  },

  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: any) => {
    if (option.ext) {
      const ext = Array.from(option.ext);
      const allowExt = ext.join('|');
      const regex = new RegExp(`(${allowExt})$`);

      if (file.mimetype.match(regex)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            `Không hỗ trợ file định dạng ${extname(file.originalname)}`,
          ),
          false,
        );
      }
    } else {
      cb(null, true);
    }
  },

  storage: diskStorage({
    destination: async (
      req: Express.Request,
      file: Express.Multer.File,
      cb: any,
    ) => {
      if (!existsSync(option.uploadPath)) {
        mkdirSync(option.uploadPath);
      }
      cb(null, option.uploadPath);
    },

    filename: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
});
