import mongoose, { Schema, Document } from 'mongoose';

export interface IWirdSession extends Document {
  userId: string;
  date: Date;
  goalPages: number;
  startPage: number;
  currentPage: number;
  status: 'in-progress' | 'completed';
  pagesReadToday: number;
}

const WirdSessionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  goalPages: { type: Number, required: true, default: 10 },
  startPage: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  pagesReadToday: { type: Number, default: 0 }
});

export default mongoose.models.WirdSession || mongoose.model<IWirdSession>('WirdSession', WirdSessionSchema);
