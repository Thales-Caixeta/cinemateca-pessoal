import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MovieDetailsClient from "./MovieDetailsClient";

interface TmdbDetails {
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number | null;
}

async function getTmdbDetails(tmdbId: number): Promise<TmdbDetails | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=pt-BR`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: "application/json",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function FilmeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: { id: Number(id) },
  });

  if (!movie) notFound();

  const details = await getTmdbDetails(movie.tmdbId);

  return <MovieDetailsClient movie={movie} details={details} />;
}
