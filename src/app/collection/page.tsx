"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WatchedBadge from "@/components/WatchedBadge";

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  watched: boolean;
  rating: number | null;
}

export default function CollectionPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMovies() {
    const res = await fetch("/api/movies", { cache: "no-store" });
    const data = await res.json();
    setMovies(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  async function toggleWatched(movie: Movie) {
    const nextWatched = !movie.watched;
    await fetch(`/api/movies/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        watched: nextWatched,
        ...(nextWatched ? { timesWatched: 1 } : {}),
      }),
    });
    loadMovies();
  }

  async function removeMovie(movie: Movie) {
    if (!confirm(`Remove "${movie.title}" from your collection?`)) return;
    await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
    loadMovies();
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold mb-2">
          My Collection
        </h1>
        <p className="text-neutral-400 mb-10">
          {movies.length}{" "}
          {movies.length === 1 ? "movie saved" : "movies saved"}
        </p>

        {movies.length === 0 ? (
          <p className="text-neutral-500">
            No movies in your collection yet. Go to{" "}
            <a href="/search" className="text-[#d4af37] hover:underline">
              Search
            </a>{" "}
            to add one.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="rounded-2xl overflow-hidden shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition"
                style={{ backgroundColor: "#1e212c" }}
              >
                <Link href={`/movie/${movie.id}`}>
                  <div className="aspect-[2/3] bg-black/20">
                    {movie.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs p-2 text-center">
                        No poster
                      </div>
                    )}
                  </div>
                </Link>

                <div className="relative h-4">
                  <div
                    className="absolute inset-x-3 top-1/2 border-t border-dashed"
                    style={{ borderColor: "#3a3f4d" }}
                  />
                  <div
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: "#171b24" }}
                  />
                  <div
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: "#171b24" }}
                  />
                </div>

                <div className="p-4 pt-2">
                  <Link href={`/movie/${movie.id}`}>
                    <p className="font-[family-name:var(--font-fraunces)] font-semibold text-sm leading-snug line-clamp-2 hover:text-[#d4af37] transition">
                      {movie.title}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <p className="text-neutral-500 text-xs">
                      {movie.releaseDate
                        ? new Date(movie.releaseDate).getFullYear()
                        : "—"}
                    </p>
                    {movie.watched && <WatchedBadge />}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleWatched(movie)}
                      className={`flex-1 text-xs py-1.5 rounded-lg transition ${
                        movie.watched
                          ? "bg-[#d4af37]/12 text-[#d4af37] hover:bg-[#d4af37]/20"
                          : "bg-[#c2402f] hover:bg-[#a3362b] text-white font-medium"
                      }`}
                    >
                      {movie.watched ? "Unmark" : "Mark watched"}
                    </button>
                    <button
                      onClick={() => removeMovie(movie)}
                      aria-label="Remove"
                      className="px-3 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
