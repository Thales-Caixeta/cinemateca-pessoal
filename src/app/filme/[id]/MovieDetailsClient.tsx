"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
  watched: boolean;
  watchedAt: string | null;
  rating: number | null;
  notes: string | null;
}

interface TmdbDetails {
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number | null;
}

export default function MovieDetailsClient({
  movie,
  details,
}: {
  movie: Movie;
  details: TmdbDetails | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(movie.rating || 0);
  const [notes, setNotes] = useState(movie.notes || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/movies/${movie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: rating || null, notes: notes || null }),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!confirm(`Remover "${movie.title}" da coleção?`)) return;
    await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
    router.push("/colecao");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-neutral-400 hover:text-white text-sm mb-6"
        >
          ← Voltar
        </button>

        <div className="flex gap-6">
          <div className="w-48 flex-shrink-0">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5">
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                  Sem poster
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-neutral-400 text-sm mb-4">
              {movie.releaseDate
                ? new Date(movie.releaseDate).getFullYear()
                : "—"}
              {details?.genres?.length
                ? ` · ${details.genres.map((g) => g.name).join(", ")}`
                : ""}
              {details?.runtime ? ` · ${details.runtime} min` : ""}
            </p>

            {details?.overview && (
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                {details.overview}
              </p>
            )}

            <div className="mb-4">
              <p className="text-neutral-400 text-xs mb-2">Sua nota</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star * 2)}
                    className={`text-2xl ${
                      rating >= star * 2 ? "text-amber-400" : "text-neutral-700"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-neutral-400 text-xs mb-2">Suas anotações</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escreva o que quiser sobre esse filme..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-white/20 transition h-24 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-neutral-900 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-neutral-200 transition"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={handleRemove}
                className="bg-red-500/10 text-red-400 text-sm px-5 py-2.5 rounded-lg hover:bg-red-500/20 transition"
              >
                Remover da coleção
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
