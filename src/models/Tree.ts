import mongoose, { Schema, Document } from 'mongoose';

export interface ITree extends Document {
  userId: string;
  beneficiaryId?: string;
  beneficiaryName: string;
  deedType: 'quran' | 'prayer' | 'dhikr';
  treeType: 'palm' | 'olive' | 'luminous';
  deedDetail: string;
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: number;
  createdAt: Date;
}

const TreeSchema: Schema = new Schema({
  userId: { type: String, required: true, default: 'boss_admin' },
  beneficiaryId: { type: String, default: null },
  beneficiaryName: { type: String, default: 'نفسي' },
  deedType: { type: String, enum: ['quran', 'prayer', 'dhikr'], required: true },
  treeType: { type: String, enum: ['palm', 'olive', 'luminous'], default: 'palm' },
  deedDetail: { type: String, default: 'عمل صالح' },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  scale: { type: Number, default: 1 },
  rotation: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Tree || mongoose.model<ITree>('Tree', TreeSchema);
