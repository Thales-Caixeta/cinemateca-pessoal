"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  watched: boolean;
  rating: number | null;
}

export default function ColecaoPage() {
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
    await fetch(`/api/movies/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: !movie.watched }),
    });
    loadMovies();
  }

  async function removeMovie(movie: Movie) {
    if (!confirm(`Remover "${movie.title}" da coleção?`)) return;
    await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
    loadMovies();
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-neutral-500">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Minha Coleção</h1>
        <p className="text-neutral-400 mb-8">
          {movies.length}{" "}
          {movies.length === 1 ? "filme salvo" : "filmes salvos"}
        </p>

        {movies.length === 0 ? (
          <p className="text-neutral-500">
            Nenhum filme na coleção ainda. Vá em{" "}
            <a href="/buscar" className="text-emerald-400 hover:underline">
              Buscar
            </a>{" "}
            para adicionar.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {movies.map((movie) => (
              <div key={movie.id} className="group">
                <Link href={`/filme/${movie.id}`}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 relative">
                    {movie.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs p-2 text-center">
                        Sem poster
                      </div>
                    )}

                    {movie.watched && (
                      <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                        Assistido
                      </span>
                    )}
                  </div>
                </Link>

                <Link href={`/filme/${movie.id}`}>
                  <p className="text-sm mt-2 line-clamp-2 leading-tight hover:text-emerald-400 transition">
                    {movie.title}
                  </p>
                </Link>
                <p className="text-neutral-500 text-xs mb-2">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : "—"}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWatched(movie)}
                    className={`flex-1 text-xs py-1.5 rounded transition ${
                      movie.watched
                        ? "bg-white/5 text-neutral-400 hover:bg-white/10"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {movie.watched ? "Desmarcar" : "Marcar assistido"}
                  </button>
                  <button
                    onClick={() => removeMovie(movie)}
                    aria-label="Remover"
                    className="px-3 text-xs rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
