import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { watched, timesWatched, rating, notes, overview } = body;

  const data: Record<string, unknown> = {};

  if (watched !== undefined) {
    data.watched = watched;
    data.watchedAt = watched ? new Date() : null;
    if (!watched) data.timesWatched = 0;
  }
  if (timesWatched !== undefined) data.timesWatched = timesWatched;
  if (rating !== undefined) data.rating = rating;
  if (notes !== undefined) data.notes = notes;
  if (overview !== undefined) data.overview = overview;

  try {
    const movie = await prisma.movie.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(movie);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.movie.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove movie" },
      { status: 500 },
    );
  }
}
