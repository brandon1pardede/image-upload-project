"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const imageController_1 = require("../controllers/imageController");
const router = (0, express_1.Router)();
const imageController = new imageController_1.ImageController();
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
// Routes
router.post('/upload', upload.single('image'), imageController.upload);
router.get('/:id', imageController.getImage);
router.get('/', imageController.getAllImages);
router.delete('/:id', imageController.deleteImage);
exports.default = router;
