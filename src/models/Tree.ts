import mongoose, { Schema, Document } from 'mongoose';

export interface ITree extends Document {
  userId: string;
  deedType: 'quran' | 'prayer' | 'dhikr';
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: number;
  modelType: number; // For variety in 3D tree models
  createdAt: Date;
}

const TreeSchema: Schema = new Schema({
  userId: { type: String, required: true },
  deedType: { type: String, enum: ['quran', 'prayer', 'dhikr'], required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  scale: { type: Number, default: 1 },
  rotation: { type: Number, default: 0 },
  modelType: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Tree || mongoose.model<ITree>('Tree', TreeSchema);
