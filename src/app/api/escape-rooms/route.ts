import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const rooms = await prisma.escapeRoom.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const parsedRooms = rooms.map(room => ({
      ...room,
      hotspots: JSON.parse(room.hotspots),
    }));
    return NextResponse.json(parsedRooms);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hotspots, ...rest } = body;
    const newRoom = await prisma.escapeRoom.create({
      data: {
        ...rest,
        hotspots: JSON.stringify(hotspots),
      },
    });

    return NextResponse.json({
      ...newRoom,
      hotspots: JSON.parse(newRoom.hotspots)
    });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}