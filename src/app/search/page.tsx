"use client";

import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingIds, setAddingIds] = useState<number[]>([]);
  const [savedTmdbIds, setSavedTmdbIds] = useState<number[]>([]);

  useEffect(() => {
    loadSavedIds();
  }, []);

  async function loadSavedIds() {
    try {
      const res = await fetch("/api/movies", { cache: "no-store" });
      const data = await res.json();
      setSavedTmdbIds(data.map((m: { tmdbId: number }) => m.tmdbId));
    } catch (error) {
      console.error("Failed to load collection:", error);
    }
  }

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
      console.error("Failed to search movies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(movie: Movie) {
    setAddingIds((prev) => [...prev, movie.id]);
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSavedTmdbIds((prev) => [...prev, movie.id]);
    } catch (error) {
      console.error("Failed to add movie:", error);
    } finally {
      setAddingIds((prev) => prev.filter((id) => id !== movie.id));
    }
  }

  return (
    <main className="min-h-screen text-neutral-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold mb-6">
          Search Movies
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-[#c2402f]/60 transition"
          />
          <button
            type="submit"
            className="bg-[#c2402f] hover:bg-[#a3362b] transition rounded-lg px-6 py-2 font-medium"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-neutral-400">Searching...</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => {
            const isAdding = addingIds.includes(movie.id);
            const isSaved = savedTmdbIds.includes(movie.id);

            return (
              <div
                key={movie.id}
                className="bg-white/5 rounded-lg overflow-hidden border border-white/10 shadow-lg shadow-black/30 hover:border-[#c2402f]/40 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition group"
              >
                <div className="aspect-[2/3] bg-white/5 relative">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm p-2 text-center">
                      No poster
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
                  <button
                    onClick={() => handleAdd(movie)}
                    disabled={isAdding || isSaved}
                    className={`mt-2 w-full transition text-xs py-1.5 rounded ${
                      isSaved
                        ? "bg-[#d4af37]/15 text-[#d4af37] cursor-default"
                        : "bg-white/10 hover:bg-[#c2402f]"
                    }`}
                  >
                    {isSaved
                      ? "✓ Already in collection"
                      : isAdding
                        ? "Adding..."
                        : "+ Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
