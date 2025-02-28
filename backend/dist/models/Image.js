"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    metadata: {
        size: { type: Number, required: true },
        uploadedBy: { type: String },
    },
    gridFSId: { type: String, required: true },
});
exports.Image = (0, mongoose_1.model)('Image', ImageSchema);
