import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Beneficiary from '@/models/Beneficiary';

export const dynamic = 'force-dynamic';

export async function GET() {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  if (!conn) {
    return NextResponse.json({
      success: true,
      data: [
        { _id: 'self', name: 'نفسي', relationship: 'أنا', intention: 'general', intentionText: 'طلب التوفيق والمغفرة', totalQuranPages: 0, totalDhikr: 0, totalTrees: 0 }
      ]
    });
  }

  try {
    let beneficiaries = await Beneficiary.find({ userId }).sort({ createdAt: -1 });

    // Seed default "نفسي" if database is empty
    if (beneficiaries.length === 0) {
      const defaultSelf = await Beneficiary.create({
        userId,
        name: 'نفسي',
        relationship: 'أنا',
        intention: 'general',
        intentionText: 'طلب التوفيق والرحمة',
        totalQuranPages: 0,
        totalDhikr: 0,
        totalTrees: 0
      });
      beneficiaries = [defaultSelf];
    }

    return NextResponse.json({ success: true, data: beneficiaries });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  try {
    const body = await request.json();
    const { name, relationship, intention, intentionText } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'الاسم مطلوب' }, { status: 400 });
    }

    if (!conn) {
      return NextResponse.json({
        success: true,
        data: {
          _id: 'local-' + Date.now(),
          userId,
          name,
          relationship: relationship || 'قريب',
          intention: intention || 'general',
          intentionText: intentionText || 'طلب الرحمة والمغفرة',
          totalQuranPages: 0,
          totalDhikr: 0,
          totalTrees: 0,
          createdAt: new Date()
        }
      });
    }

    const newBeneficiary = await Beneficiary.create({
      userId,
      name,
      relationship: relationship || 'قريب',
      intention: intention || 'general',
      intentionText: intentionText || 'طلب الرحمة والمغفرة',
      totalQuranPages: 0,
      totalDhikr: 0,
      totalTrees: 0
    });

    return NextResponse.json({ success: true, data: newBeneficiary });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'المعرف مطلوب' }, { status: 400 });
    }

    if (!conn) {
      return NextResponse.json({ success: true, message: 'Deleted locally' });
    }

    await Beneficiary.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
