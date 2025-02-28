import { Schema, model, Document } from 'mongoose';

export interface IImage extends Document {
  filename: string;
  contentType: string;
  uploadDate: Date;
  metadata: {
    size: number;
    uploadedBy?: string;
  };
  gridFSId: string;
}

const ImageSchema = new Schema<IImage>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  metadata: {
    size: { type: Number, required: true },
    uploadedBy: { type: String },
  },
  gridFSId: { type: String, required: true },
});

export const Image = model<IImage>('Image', ImageSchema); 