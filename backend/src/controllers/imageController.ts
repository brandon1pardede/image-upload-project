import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';
import { logger } from '../config/logger';

export class ImageController {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  upload = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const image = await this.imageService.uploadImage(req.file);
      res.status(201).json(image);
    } catch (error) {
      logger.error('Error in upload controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { stream, contentType } = await this.imageService.getImage(id);

      res.set('Content-Type', contentType);
      stream.pipe(res);
    } catch (error) {
      logger.error('Error in getImage controller:', error);
      if (error instanceof Error && error.message === 'Image not found') {
        res.status(404).json({ error: 'Image not found' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  getAllImages = async (_req: Request, res: Response): Promise<void> => {
    try {
      const images = await this.imageService.getAllImages();
      res.json(images);
    } catch (error) {
      logger.error('Error in getAllImages controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.imageService.deleteImage(id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error in deleteImage controller:', error);
      if (error instanceof Error && error.message === 'Image not found') {
        res.status(404).json({ error: 'Image not found' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}
