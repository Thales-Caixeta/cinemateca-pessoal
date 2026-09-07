"use client";

import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-neutral-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎬 Cinemateca Pessoal</h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filme..."
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 outline-none focus:border-neutral-400 transition"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition rounded-lg px-6 py-2 font-medium"
          >
            Buscar
          </button>
        </form>

        {loading && <p className="text-neutral-400">Buscando...</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 transition group"
            >
              <div className="aspect-[2/3] bg-neutral-800 relative">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm p-2 text-center">
                    Sem poster
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-neutral-500 text-xs mt-1">
                  {movie.release_date?.slice(0, 4) || "—"}
                </p>
                <button className="mt-2 w-full bg-neutral-800 hover:bg-blue-600 transition text-xs py-1.5 rounded">
                  + Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
