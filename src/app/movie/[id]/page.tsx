import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MovieDetailsClient from "./MovieDetailsClient";

interface TmdbDetails {
  overview: string;
  tagline: string | null;
  genres: { id: number; name: string }[];
  runtime: number | null;
  backdrop_path: string | null;
  director: string | null;
  cast: { id: number; name: string; character: string }[];
}

interface TmdbCreditsResponse {
  cast?: { id: number; name: string; character: string }[];
  crew?: { job: string; name: string }[];
}

async function getTmdbDetails(tmdbId: number): Promise<TmdbDetails | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US&append_to_response=credits`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: "application/json",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;

    const raw = await res.json();
    const credits: TmdbCreditsResponse = raw.credits || {};
    const director =
      credits.crew?.find((member) => member.job === "Director")?.name ??
      null;

    return {
      overview: raw.overview,
      tagline: raw.tagline,
      genres: raw.genres,
      runtime: raw.runtime,
      backdrop_path: raw.backdrop_path,
      director,
      cast: (credits.cast || []).slice(0, 6),
    };
  } catch {
    return null;
  }
}

export default async function MovieDetailsPage({
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
