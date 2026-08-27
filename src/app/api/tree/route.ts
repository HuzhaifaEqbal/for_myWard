import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tree from '@/models/Tree';
import Beneficiary from '@/models/Beneficiary';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  try {
    const { searchParams } = new URL(request.url);
    const beneficiaryId = searchParams.get('beneficiaryId');

    const query: any = { userId };
    if (beneficiaryId && beneficiaryId !== 'all') {
      query.beneficiaryId = beneficiaryId;
    }

    if (!conn) {
      return NextResponse.json({ success: true, data: [] });
    }

    const trees = await Tree.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: trees });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  try {
    const body = await request.json();
    const {
      deedType,
      treeType,
      deedDetail,
      beneficiaryId,
      beneficiaryName,
      position,
      scale,
      rotation
    } = body;

    // Default random position in oasis if not provided
    const randomPos = {
      x: (Math.random() - 0.5) * 45,
      y: 0,
      z: (Math.random() - 0.5) * 45
    };

    if (!conn) {
      return NextResponse.json({
        success: true,
        data: {
          _id: 'local-' + Date.now(),
          userId,
          beneficiaryId: beneficiaryId || null,
          beneficiaryName: beneficiaryName || 'نفسي',
          deedType: deedType || 'quran',
          treeType: treeType || 'palm',
          deedDetail: deedDetail || 'عمل مبارك',
          position: position || randomPos,
          scale: scale || 1,
          rotation: rotation || Math.random() * Math.PI * 2,
          createdAt: new Date()
        }
      });
    }

    const tree = await Tree.create({
      userId,
      beneficiaryId: beneficiaryId || null,
      beneficiaryName: beneficiaryName || 'نفسي',
      deedType: deedType || 'quran',
      treeType: treeType || (deedType === 'quran' ? 'palm' : deedType === 'prayer' ? 'olive' : 'luminous'),
      deedDetail: deedDetail || 'عمل مبارك',
      position: position || randomPos,
      scale: scale || (0.85 + Math.random() * 0.35),
      rotation: rotation || Math.random() * Math.PI * 2
    });

    // If dedicated to a beneficiary, increment their tree count
    if (beneficiaryId && beneficiaryId !== 'self') {
      await Beneficiary.findOneAndUpdate(
        { _id: beneficiaryId, userId },
        { $inc: { totalTrees: 1 } }
      );
    }

    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
