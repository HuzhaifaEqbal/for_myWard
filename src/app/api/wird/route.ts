import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WirdSession from '@/models/Wird';
import UserStats from '@/models/UserStats';

export async function GET(request: Request) {
  await dbConnect();
  const userId = 'boss_admin';

  try {
    let session = await WirdSession.findOne({ userId, status: 'in-progress' }).sort({ date: -1 });
    
    if (!session) {
      // Create a fresh session if none exists
      session = await WirdSession.create({
        userId,
        goalPages: 10,
        startPage: 1, // Default, client will likely update this if continuing from past
        currentPage: 1,
      });
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const userId = 'boss_admin';

  try {
    const { action, pagesRead, currentPage } = await request.json();

    if (action === 'update_progress') {
      const session = await WirdSession.findOneAndUpdate(
        { userId, status: 'in-progress' },
        { $set: { currentPage }, $inc: { pagesReadToday: pagesRead } },
        { new: true }
      );

      // Also update total stats and reduce Judgment Day minutes (1 min reading = ~5 mins of judgment day roughly, or we use his exact formula)
      // His formula: 1 min of life = 417 mins of Judgment Day. Assuming 1 page takes 2 mins to read.
      const minutesSpent = pagesRead * 2;
      const judgmentDayReduction = minutesSpent * 417;

      await UserStats.findOneAndUpdate(
        { userId },
        { 
          $inc: { 
            totalQuranPages: pagesRead,
            spiritualCounter: -judgmentDayReduction
          }
        }
      );

      return NextResponse.json({ success: true, data: session });
    }

    if (action === 'finish_wird') {
      const session = await WirdSession.findOneAndUpdate(
        { userId, status: 'in-progress' },
        { $set: { status: 'completed' } },
        { new: true }
      );
      return NextResponse.json({ success: true, data: session });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
