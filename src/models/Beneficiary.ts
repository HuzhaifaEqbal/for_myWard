import mongoose, { Schema, Document } from 'mongoose';

export interface IBeneficiary extends Document {
  userId: string;
  name: string;
  relationship: string; // e.g. "الوالد", "الوالدة", "صديق", "نفسي"
  intention: 'deceased' | 'healing' | 'blessing' | 'parents' | 'general';
  intentionText: string;
  totalQuranPages: number;
  totalDhikr: number;
  totalTrees: number;
  createdAt: Date;
}

const BeneficiarySchema: Schema = new Schema({
  userId: { type: String, required: true, default: 'boss_admin' },
  name: { type: String, required: true },
  relationship: { type: String, default: 'قريب' },
  intention: { 
    type: String, 
    enum: ['deceased', 'healing', 'blessing', 'parents', 'general'], 
    default: 'general' 
  },
  intentionText: { type: String, default: 'طلب الرحمة والمغفرة' },
  totalQuranPages: { type: Number, default: 0 },
  totalDhikr: { type: Number, default: 0 },
  totalTrees: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Beneficiary || mongoose.model<IBeneficiary>('Beneficiary', BeneficiarySchema);
