import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserStats from '@/models/UserStats';
import Beneficiary from '@/models/Beneficiary';
import Tree from '@/models/Tree';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  try {
    const { count, dhikrText, beneficiaryId, beneficiaryName } = await request.json();

    if (!count || count < 33) {
      return NextResponse.json({ success: false, error: 'الحد الأدنى لتوثيق التسبيح هو 33 تسبيحة' }, { status: 400 });
    }

    const minutesSpent = Math.ceil(count / 30);
    const judgmentDayReduction = minutesSpent * 417;

    if (!conn) {
      return NextResponse.json({ success: true, message: 'Recorded locally' });
    }

    // 1. Update UserStats
    await UserStats.findOneAndUpdate(
      { userId },
      { 
        $inc: { 
          totalDhikr: count,
          spiritualCounter: -judgmentDayReduction
        }
      }
    );

    // 2. Auto-plant a luminous flower
    const randomPos = {
      x: (Math.random() - 0.5) * 35,
      y: 0,
      z: (Math.random() - 0.5) * 35
    };

    await Tree.create({
      userId,
      beneficiaryId: beneficiaryId || null,
      beneficiaryName: beneficiaryName || 'نفسي',
      deedType: 'dhikr',
      treeType: 'luminous',
      deedDetail: `${count} تسبيحة (${dhikrText || 'أذكار واستغفار'})`,
      position: randomPos,
      scale: 0.7 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2
    });

    // 3. Update Beneficiary if dedicated
    if (beneficiaryId && beneficiaryId !== 'self') {
      await Beneficiary.findOneAndUpdate(
        { _id: beneficiaryId, userId },
        { 
          $inc: { 
            totalDhikr: count,
            totalTrees: 1
          } 
        }
      );
    }

    return NextResponse.json({ success: true, message: 'تم توثيق الذكر وغرس زهرة مضيئة في الغابة بنجاح' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
