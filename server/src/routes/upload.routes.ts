import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/authenticate';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    cb(null, /\.(jpe?g|png|gif|webp|svg|avif|bmp|tiff?)$/i.test(file.originalname));
  },
});

function streamUpload(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'aim', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    );
    stream.end(buffer);
  });
}

const router = Router();

router.post('/', authenticate, upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file provided' }); return; }
  try {
    const url = await streamUpload(req.file.buffer);
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message || 'Upload failed' });
  }
});

export default router;
