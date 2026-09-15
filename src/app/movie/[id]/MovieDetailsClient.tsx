"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import WatchedStamp from "@/components/WatchedStamp";
import TicketRating, { ratingColor } from "@/components/TicketRating";

const editBtnClass =
  "inline-flex items-center gap-1.5 text-[11px] text-neutral-400 bg-white/5 border border-white/10 rounded px-2 py-1 hover:text-white hover:border-[#d4af37]/40 hover:bg-[#d4af37]/10 transition";

const doneBtnClass =
  "inline-flex items-center gap-1.5 text-[11px] font-semibold text-white rounded px-2.5 py-1.5 mt-2 transition hover:opacity-90";

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-2.5 h-2.5"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function DoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className="w-2.5 h-2.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
  watched: boolean;
  watchedAt: string | null;
  timesWatched: number;
  rating: number | null;
  notes: string | null;
  overview: string | null;
}

interface TmdbDetails {
  overview: string;
  tagline: string | null;
  genres: { id: number; name: string }[];
  runtime: number | null;
  backdrop_path: string | null;
  director: string | null;
  cast: { id: number; name: string; character: string }[];
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
  const [overview, setOverview] = useState(
    movie.overview ?? details?.overview ?? "",
  );
  const [editingOverview, setEditingOverview] = useState(false);
  const [editingRating, setEditingRating] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [watched, setWatched] = useState(movie.watched);
  const [watchedAt, setWatchedAt] = useState(movie.watchedAt);
  const [timesWatched, setTimesWatched] = useState(movie.timesWatched || 0);
  const [animateStamp, setAnimateStamp] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  async function handleMark() {
    setWatched(true);
    setWatchedAt(new Date().toISOString());
    setTimesWatched(1);
    setAnimateStamp(true);
    setAnimKey((k) => k + 1);
    await fetch(`/api/movies/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: true, timesWatched: 1 }),
    });
    router.refresh();
  }

  async function handleRewatch() {
    const next = timesWatched + 1;
    setWatchedAt(new Date().toISOString());
    setTimesWatched(next);
    setAnimateStamp(true);
    setAnimKey((k) => k + 1);
    await fetch(`/api/movies/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: true, timesWatched: next }),
    });
    router.refresh();
  }

  async function handleUnmark() {
    setWatched(false);
    setWatchedAt(null);
    setTimesWatched(0);
    await fetch(`/api/movies/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: false }),
    });
    router.refresh();
  }

  async function patchMovie(data: Record<string, unknown>) {
    await fetch(`/api/movies/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function handleDoneRating() {
    setEditingRating(false);
    await patchMovie({ rating: rating || null });
  }

  async function handleDoneNotes() {
    setEditingNotes(false);
    await patchMovie({ notes: notes || null });
  }

  async function handleDoneOverview() {
    setEditingOverview(false);
    await patchMovie({ overview: overview || null });
  }

  async function handleRemove() {
    if (!confirm(`Remove "${movie.title}" from your collection?`)) return;
    await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
    router.push("/collection");
  }

  return (
    <main className="relative min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-neutral-400 hover:text-white text-sm mb-6"
        >
          ← Back
        </button>

        {/* ---- hero: backdrop band + overlapping poster + title/credits ---- */}
        <div className="relative mb-16">
          <div className="relative h-[320px] rounded-2xl overflow-hidden bg-white/5">
            {details?.backdrop_path && (
              <div
                className="absolute inset-0 bg-cover"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
                  backgroundPosition: "center 20%",
                }}
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(23,27,36,0.4) 0%, rgba(23,27,36,1) 100%)",
              }}
            />
          </div>

          <div className="relative flex gap-8 px-8 -mt-24">
            <div className="w-[170px] flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border-4 border-[#171b24] shadow-2xl">
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                  No poster
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-24">
              <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold mb-2">
                {movie.title}
              </h1>
              {details?.tagline && (
                <p className="text-neutral-400 text-sm italic mb-3">
                  “{details.tagline}”
                </p>
              )}
              <p className="text-neutral-400 text-sm mb-4">
                {movie.releaseDate
                  ? new Date(movie.releaseDate).getFullYear()
                  : "—"}
                {details?.genres?.length
                  ? ` · ${details.genres.map((g) => g.name).join(", ")}`
                  : ""}
                {details?.runtime ? ` · ${details.runtime} min` : ""}
              </p>
              {(details?.director || details?.cast?.length) && (
                <div className="flex flex-wrap gap-x-10 gap-y-2">
                  {details?.director && (
                    <div>
                      <p className="text-neutral-400 text-xs mb-1">
                        Director
                      </p>
                      <p className="text-neutral-200 text-sm">
                        {details.director}
                      </p>
                    </div>
                  )}
                  {details?.cast?.length ? (
                    <div>
                      <p className="text-neutral-400 text-xs mb-1">Cast</p>
                      <p className="text-neutral-200 text-sm">
                        {details.cast.map((c) => c.name).join(", ")}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---- status bar: watch actions + stamp + rating, equal weight ---- */}
        <div className="flex items-center justify-between gap-6 flex-wrap bg-white/5 rounded-2xl px-8 py-6 mb-10">
          <div className="flex items-center gap-5">
            {watched ? (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleUnmark}
                  className="text-sm px-4 py-2 rounded-lg bg-[#d4af37]/12 text-[#d4af37] hover:bg-[#d4af37]/20 transition"
                >
                  Unmark
                </button>
                <button
                  onClick={handleRewatch}
                  className="text-sm px-4 py-2 rounded-lg text-white font-medium transition"
                  style={{ backgroundColor: "#c2402f" }}
                >
                  Watched again
                </button>
              </div>
            ) : (
              <button
                onClick={handleMark}
                className="text-sm px-4 py-2 rounded-lg text-white font-medium transition flex-shrink-0"
                style={{ backgroundColor: "#c2402f" }}
              >
                Mark as watched
              </button>
            )}
            {watched && (
              <div
                key={animKey}
                className={`w-[160px] drop-shadow-[0_6px_14px_rgba(194,64,47,0.3)] ${
                  animateStamp ? "animate-stamp-slam" : ""
                }`}
              >
                <WatchedStamp watchedAt={watchedAt} timesWatched={timesWatched} />
              </div>
            )}
          </div>

          {watched && (
            <div className="text-right">
              {editingRating ? (
                <>
                  <p className="text-neutral-400 text-xs mb-2">
                    Your rating
                  </p>
                  <TicketRating value={rating} onChange={setRating} />
                  <button
                    onClick={handleDoneRating}
                    className={doneBtnClass}
                    style={{ backgroundColor: "#c2402f" }}
                  >
                    <DoneIcon />
                    Done editing
                  </button>
                </>
              ) : (
                <>
                  <p className="text-neutral-400 text-xs mb-1">
                    Your rating
                  </p>
                  {rating > 0 ? (
                    <p
                      className="font-[family-name:var(--font-fraunces)] font-bold text-[44px] leading-none"
                      style={{ color: ratingColor(rating) }}
                    >
                      {rating >= 10 ? "10" : rating.toFixed(1)}
                      <span className="text-neutral-500 text-xs font-normal ml-0.5">
                        /10
                      </span>
                    </p>
                  ) : (
                    <p className="text-neutral-600 text-xs italic mb-1">
                      Not rated yet.
                    </p>
                  )}
                  <button
                    onClick={() => setEditingRating(true)}
                    className="text-[11px] text-neutral-500 hover:text-[#d4af37] transition mt-1"
                  >
                    {rating > 0 ? "Edit rating" : "Rate this movie"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ---- body: description (main) + facts/notes (sidebar) ---- */}
        <div className="grid grid-cols-[1fr_300px] gap-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-neutral-400 text-xs">Description</p>
              {!editingOverview && (
                <button
                  onClick={() => setEditingOverview(true)}
                  className={editBtnClass}
                >
                  <EditIcon />
                  Edit
                </button>
              )}
            </div>
            {editingOverview ? (
              <>
                <textarea
                  autoFocus
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="No description available."
                  className="w-full bg-white/5 border border-[#d4af37]/35 rounded-lg p-3 text-sm text-neutral-300 leading-relaxed outline-none focus:border-[#d4af37]/60 transition h-32 resize-none"
                />
                <button
                  onClick={handleDoneOverview}
                  className={doneBtnClass}
                  style={{ backgroundColor: "#c2402f" }}
                >
                  <DoneIcon />
                  Done editing
                </button>
              </>
            ) : (
              <p className="text-neutral-300 text-[15px] leading-relaxed">
                {overview || (
                  <span className="text-neutral-600">
                    No description available.
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white/5 rounded-lg p-3.5 text-xs text-neutral-400 flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Year</span>
                <span className="text-neutral-200">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : "—"}
                </span>
              </div>
              {details?.genres?.length ? (
                <div className="flex justify-between gap-3">
                  <span className="flex-shrink-0">Genre</span>
                  <span className="text-neutral-200 text-right">
                    {details.genres.map((g) => g.name).join(", ")}
                  </span>
                </div>
              ) : null}
              {details?.runtime ? (
                <div className="flex justify-between">
                  <span>Runtime</span>
                  <span className="text-neutral-200">
                    {details.runtime} min
                  </span>
                </div>
              ) : null}
            </div>

            {watched && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-neutral-400 text-xs">Your notes</p>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      className={editBtnClass}
                    >
                      <EditIcon />
                      {notes ? "Edit" : "Add"}
                    </button>
                  )}
                </div>
                {editingNotes ? (
                  <>
                    <textarea
                      autoFocus
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write whatever you want about this movie..."
                      className="w-full bg-white/5 border border-[#d4af37]/35 rounded-lg p-3 text-sm outline-none focus:border-[#d4af37]/60 transition h-24 resize-none"
                    />
                    <button
                      onClick={handleDoneNotes}
                      className={doneBtnClass}
                      style={{ backgroundColor: "#c2402f" }}
                    >
                      <DoneIcon />
                      Done editing
                    </button>
                  </>
                ) : (
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {notes || (
                      <span className="text-neutral-600 italic">
                        No notes yet.
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleRemove}
              className="bg-red-500/10 text-red-400 text-sm px-5 py-2.5 rounded-lg hover:bg-red-500/20 transition"
            >
              Remove from collection
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
