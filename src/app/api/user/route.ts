import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserStats from '@/models/UserStats';

export async function GET() {
  await dbConnect();
  const userId = 'boss_admin'; // Hardcoded for personal use

  try {
    let user = await UserStats.findOne({ userId });
    
    if (!user) {
      user = await UserStats.create({
        userId,
        totalQuranPages: 0,
        totalPrayers: 0,
        totalDhikr: 0,
        spiritualCounter: 26298000000 // Judgment day minutes
      });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
