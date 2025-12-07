import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { hotspots, ...rest } = body;
    if ('id' in rest) delete rest.id;

    const updatedRoom = await prisma.escapeRoom.update({
      where: { id },
      data: {
        ...rest,
        hotspots: JSON.stringify(hotspots),
      },
    });

    return NextResponse.json({
      ...updatedRoom,
      hotspots: JSON.parse(updatedRoom.hotspots)
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.escapeRoom.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}