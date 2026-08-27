import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tree from '@/models/Tree';

export const dynamic = 'force-dynamic';

export async function GET() {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  if (!conn) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const trees = await Tree.find({ userId });
    return NextResponse.json({ success: true, data: trees });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const conn = await dbConnect();
  const userId = 'boss_admin';

  if (!conn) {
    return NextResponse.json({
      success: true,
      data: {
        _id: 'temp-' + Date.now(),
        userId,
        deedType: 'quran',
        position: { x: (Math.random() - 0.5) * 15, y: 0, z: (Math.random() - 0.5) * 15 },
        scale: 1,
        rotation: 0
      }
    });
  }

  try {
    const { deedType, position, scale, rotation, modelType } = await request.json();

    const tree = await Tree.create({
      userId,
      deedType,
      position,
      scale,
      rotation,
      modelType
    });

    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
