"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const imageService_1 = require("../services/imageService");
const logger_1 = require("../config/logger");
class ImageController {
    constructor() {
        this.upload = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({ error: 'No file uploaded' });
                    return;
                }
                const image = await this.imageService.uploadImage(req.file);
                res.status(201).json(image);
            }
            catch (error) {
                logger_1.logger.error('Error in upload controller:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.getImage = async (req, res) => {
            try {
                const { id } = req.params;
                const { stream, contentType } = await this.imageService.getImage(id);
                res.set('Content-Type', contentType);
                stream.pipe(res);
            }
            catch (error) {
                logger_1.logger.error('Error in getImage controller:', error);
                if (error instanceof Error && error.message === 'Image not found') {
                    res.status(404).json({ error: 'Image not found' });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.getAllImages = async (_req, res) => {
            try {
                const images = await this.imageService.getAllImages();
                res.json(images);
            }
            catch (error) {
                logger_1.logger.error('Error in getAllImages controller:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.deleteImage = async (req, res) => {
            try {
                const { id } = req.params;
                await this.imageService.deleteImage(id);
                res.status(204).send();
            }
            catch (error) {
                logger_1.logger.error('Error in deleteImage controller:', error);
                if (error instanceof Error && error.message === 'Image not found') {
                    res.status(404).json({ error: 'Image not found' });
                }
                else {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        };
        this.imageService = new imageService_1.ImageService();
    }
}
exports.ImageController = ImageController;
