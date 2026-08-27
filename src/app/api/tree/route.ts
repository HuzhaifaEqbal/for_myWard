import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tree from '@/models/Tree';

export async function GET(request: Request) {
  await dbConnect();
  const userId = 'boss_admin';

  try {
    const trees = await Tree.find({ userId });
    return NextResponse.json({ success: true, data: trees });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const userId = 'boss_admin';

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
