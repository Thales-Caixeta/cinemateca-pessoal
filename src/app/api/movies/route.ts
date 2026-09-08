import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { tmdbId, title, posterPath, releaseDate, runtime } = body;

  if (!tmdbId || !title) {
    return NextResponse.json(
      { error: "tmdbId e title são obrigatórios" },
      { status: 400 },
    );
  }

  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId },
      update: {},
      create: {
        tmdbId,
        title,
        posterPath: posterPath || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        runtime: runtime || null,
        watched: true,
        watchedAt: new Date(),
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao salvar filme" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const movies = await prisma.movie.findMany({
    orderBy: { watchedAt: "desc" },
  });
  return NextResponse.json(movies);
}
