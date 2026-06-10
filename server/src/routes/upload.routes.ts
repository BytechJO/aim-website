import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/authenticate';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    cb(null, /\.(jpe?g|png|gif|webp|svg|avif|bmp|tiff?)$/i.test(file.originalname));
  },
});

const router = Router();

router.post('/', authenticate, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file provided' }); return; }
  res.json({ url: `/uploads/${req.file.filename}` });
});

export { uploadsDir };
export default router;
