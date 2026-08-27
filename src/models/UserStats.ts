import mongoose, { Schema, Document } from 'mongoose';

export interface IUserStats extends Document {
  userId: string;
  totalQuranPages: number;
  totalPrayers: number;
  totalDhikr: number;
  spiritualCounter: number;
  lastActive: Date;
}

const UserStatsSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  totalQuranPages: { type: Number, default: 0 },
  totalPrayers: { type: Number, default: 0 },
  totalDhikr: { type: Number, default: 0 },
  spiritualCounter: { type: Number, default: 26298000000 }, // Initial Judgment Day minutes
  lastActive: { type: Date, default: Date.now }
});

export default mongoose.models.UserStats || mongoose.model<IUserStats>('UserStats', UserStatsSchema);
