import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserStats from '@/models/UserStats';

export const dynamic = 'force-dynamic';

export async function GET() {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  if (!conn) {
    return NextResponse.json({
      success: true,
      data: {
        userId,
        totalQuranPages: 0,
        totalPrayers: 0,
        totalDhikr: 0,
        spiritualCounter: 26298000000
      }
    });
  }

  try {
    let user = await UserStats.findOne({ userId });
    
    if (!user) {
      user = await UserStats.create({
        userId,
        totalQuranPages: 0,
        totalPrayers: 0,
        totalDhikr: 0,
        spiritualCounter: 26298000000
      });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
