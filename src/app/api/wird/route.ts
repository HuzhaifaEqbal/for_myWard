import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WirdSession from '@/models/Wird';
import UserStats from '@/models/UserStats';
import Beneficiary from '@/models/Beneficiary';
import Tree from '@/models/Tree';

export const dynamic = 'force-dynamic';

export async function GET() {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  if (!conn) {
    return NextResponse.json({
      success: true,
      data: {
        _id: 'default-wird',
        userId,
        goalPages: 10,
        startPage: 1,
        currentPage: 1,
        pagesReadToday: 0,
        status: 'in-progress'
      }
    });
  }

  try {
    let session = await WirdSession.findOne({ userId, status: 'in-progress' }).sort({ date: -1 });
    
    if (!session) {
      session = await WirdSession.create({
        userId,
        goalPages: 10,
        startPage: 1,
        currentPage: 1,
      });
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  try {
    const { action, pagesRead, currentPage, beneficiaryId, beneficiaryName, pageNum } = await request.json();

    if (!conn) {
      return NextResponse.json({
        success: true,
        data: {
          _id: 'local-session',
          userId,
          currentPage,
          pagesReadToday: pagesRead,
          status: action === 'finish_wird' ? 'completed' : 'in-progress'
        }
      });
    }

    if (action === 'update_progress') {
      const session = await WirdSession.findOneAndUpdate(
        { userId, status: 'in-progress' },
        { $set: { currentPage }, $inc: { pagesReadToday: pagesRead } },
        { new: true }
      );

      const minutesSpent = (pagesRead || 1) * 2;
      const judgmentDayReduction = minutesSpent * 417;

      // 1. Update overall UserStats
      await UserStats.findOneAndUpdate(
        { userId },
        { 
          $inc: { 
            totalQuranPages: pagesRead || 1,
            spiritualCounter: -judgmentDayReduction
          }
        }
      );

      // 2. Automatically plant a Palm Tree for this verified reading
      const randomPos = {
        x: (Math.random() - 0.5) * 40,
        y: 0,
        z: (Math.random() - 0.5) * 40
      };

      const pageDesc = pageNum ? `قراءة صفحة ${pageNum} من المصحف الشريف` : `قراءة صفحة من الورد القرآني`;

      await Tree.create({
        userId,
        beneficiaryId: beneficiaryId || null,
        beneficiaryName: beneficiaryName || 'نفسي',
        deedType: 'quran',
        treeType: 'palm',
        deedDetail: pageDesc,
        position: randomPos,
        scale: 0.9 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2
      });

      // 3. Update Beneficiary stats if dedicated
      if (beneficiaryId && beneficiaryId !== 'self') {
        await Beneficiary.findOneAndUpdate(
          { _id: beneficiaryId, userId },
          { 
            $inc: { 
              totalQuranPages: pagesRead || 1,
              totalTrees: 1
            } 
          }
        );
      }

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
