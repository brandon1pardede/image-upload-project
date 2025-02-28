"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const Image_1 = require("../models/Image");
const logger_1 = require("../config/logger");
class ImageService {
    constructor() {
        this.bucket = null;
        // Initialize bucket when needed
        this.initializeBucket();
    }
    initializeBucket() {
        if (!mongoose_1.default.connection.db) {
            logger_1.logger.warn('Database connection not established yet, waiting for connection...');
            mongoose_1.default.connection.once('connected', () => {
                if (mongoose_1.default.connection.db) {
                    this.bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
                        bucketName: 'images',
                    });
                    logger_1.logger.info('GridFS bucket initialized successfully');
                }
            });
        }
        else {
            this.bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
                bucketName: 'images',
            });
            logger_1.logger.info('GridFS bucket initialized successfully');
        }
    }
    getBucket() {
        if (!this.bucket) {
            throw new Error('GridFS bucket not initialized');
        }
        return this.bucket;
    }
    async uploadImage(file) {
        try {
            const uploadStream = this.getBucket().openUploadStream(file.originalname);
            return new Promise((resolve, reject) => {
                uploadStream.on('error', (error) => {
                    logger_1.logger.error('Error uploading file to GridFS:', error);
                    reject(error);
                });
                uploadStream.on('finish', async () => {
                    try {
                        const image = new Image_1.Image({
                            filename: file.originalname,
                            contentType: file.mimetype,
                            metadata: {
                                size: file.size,
                            },
                            gridFSId: uploadStream.id.toString(),
                        });
                        await image.save();
                        resolve(image);
                    }
                    catch (error) {
                        logger_1.logger.error('Error saving image metadata:', error);
                        reject(error);
                    }
                });
                uploadStream.end(file.buffer);
            });
        }
        catch (error) {
            logger_1.logger.error('Error in uploadImage:', error);
            throw error;
        }
    }
    async getImage(imageId) {
        try {
            const image = await Image_1.Image.findById(imageId);
            if (!image) {
                throw new Error('Image not found');
            }
            const downloadStream = this.getBucket().openDownloadStream(new mongodb_1.ObjectId(image.gridFSId));
            return {
                stream: downloadStream,
                contentType: image.contentType,
            };
        }
        catch (error) {
            logger_1.logger.error('Error in getImage:', error);
            throw error;
        }
    }
    async getAllImages() {
        try {
            return await Image_1.Image.find().sort({ uploadDate: -1 });
        }
        catch (error) {
            logger_1.logger.error('Error in getAllImages:', error);
            throw error;
        }
    }
    async deleteImage(imageId) {
        try {
            const image = await Image_1.Image.findById(imageId);
            if (!image) {
                throw new Error('Image not found');
            }
            await this.getBucket().delete(new mongodb_1.ObjectId(image.gridFSId));
            await Image_1.Image.deleteOne({ _id: imageId });
        }
        catch (error) {
            logger_1.logger.error('Error in deleteImage:', error);
            throw error;
        }
    }
}
exports.ImageService = ImageService;
