import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Image, IImage } from '../models/Image';
import { logger } from '../config/logger';

export class ImageService {
  private bucket: GridFSBucket | null = null;

  constructor() {
    // Initialize bucket when needed
    this.initializeBucket();
  }

  private initializeBucket(): void {
    if (!mongoose.connection.db) {
      logger.warn('Database connection not established yet, waiting for connection...');
      mongoose.connection.once('connected', () => {
        if (mongoose.connection.db) {
          this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'images',
          });
          logger.info('GridFS bucket initialized successfully');
        }
      });
    } else {
      this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images',
      });
      logger.info('GridFS bucket initialized successfully');
    }
  }

  private getBucket(): GridFSBucket {
    if (!this.bucket) {
      throw new Error('GridFS bucket not initialized');
    }
    return this.bucket;
  }

  async uploadImage(file: Express.Multer.File): Promise<IImage> {
    try {
      const uploadStream = this.getBucket().openUploadStream(file.originalname);

      return new Promise((resolve, reject) => {
        uploadStream.on('error', (error) => {
          logger.error('Error uploading file to GridFS:', error);
          reject(error);
        });

        uploadStream.on('finish', async () => {
          try {
            const image = new Image({
              filename: file.originalname,
              contentType: file.mimetype,
              metadata: {
                size: file.size,
              },
              gridFSId: uploadStream.id.toString(),
            });

            await image.save();
            resolve(image);
          } catch (error) {
            logger.error('Error saving image metadata:', error);
            reject(error);
          }
        });

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      logger.error('Error in uploadImage:', error);
      throw error;
    }
  }

  async getImage(imageId: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    try {
      const image = await Image.findById(imageId);
      if (!image) {
        throw new Error('Image not found');
      }

      const downloadStream = this.getBucket().openDownloadStream(new ObjectId(image.gridFSId));
      return {
        stream: downloadStream,
        contentType: image.contentType,
      };
    } catch (error) {
      logger.error('Error in getImage:', error);
      throw error;
    }
  }

  async getAllImages(): Promise<IImage[]> {
    try {
      return await Image.find().sort({ uploadDate: -1 });
    } catch (error) {
      logger.error('Error in getAllImages:', error);
      throw error;
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    try {
      const image = await Image.findById(imageId);
      if (!image) {
        throw new Error('Image not found');
      }

      await this.getBucket().delete(new ObjectId(image.gridFSId));
      await Image.deleteOne({ _id: imageId });
    } catch (error) {
      logger.error('Error in deleteImage:', error);
      throw error;
    }
  }
}
