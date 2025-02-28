import { Router } from 'express';
import multer from 'multer';
import { ImageController } from '../controllers/imageController';

const router = Router();
const imageController = new ImageController();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Routes
router.post('/upload', upload.single('image'), imageController.upload);
router.get('/:id', imageController.getImage);
router.get('/', imageController.getAllImages);
router.delete('/:id', imageController.deleteImage);

export default router; 