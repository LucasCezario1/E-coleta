import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
      destination: path.resolve(__dirname, '..' , '..' ,'uploads' ),
      filename(req , file, callback) {
          const hash = crypto.randomBytes(6).toString('hex'); //caracteres aleatorias para crytograiaf
          const fileName = `${hash}-${file.originalname}`;
          callback(null, fileName);
        }
    }),
};