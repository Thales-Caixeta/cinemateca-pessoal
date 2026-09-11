import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface TmdbDetails {
  backdrop_path: string | null;
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

export default async function Home() {
  const [total, latestMovie, recentMovies] = await Promise.all([
    prisma.movie.count(),
    prisma.movie.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.movie.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const thisMonth = await prisma.movie.count({
    where: { createdAt: { gte: startOfMonth } },
  });

  const ratingAgg = await prisma.movie.aggregate({
    _avg: { rating: true },
  });

  const challengesCount = await prisma.challenge.count();

  const details = latestMovie ? await getTmdbDetails(latestMovie.tmdbId) : null;

  const hasMovies = total > 0;

  return (
    <main className="min-h-screen">
      {hasMovies && latestMovie && (
        <section className="relative h-[420px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: details?.backdrop_path
                ? `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`
                : latestMovie.posterPath
                  ? `url(https://image.tmdb.org/t/p/original${latestMovie.posterPath})`
                  : undefined,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #171b24 10%, rgba(23,27,36,0.6) 50%, rgba(23,27,36,0.2) 100%), linear-gradient(0deg, #171b24 0%, transparent 40%)",
            }}
          />
          <div className="absolute left-10 bottom-10 max-w-md">
            <span className="inline-block bg-white/10 text-neutral-200 text-xs font-medium px-3 py-1 rounded-full mb-3">
              adicionado recentemente
            </span>
            <Link href={`/filme/${latestMovie.id}`}>
              <h1 className="text-4xl font-bold mb-2 hover:text-neutral-300 transition">
                {latestMovie.title}
              </h1>
            </Link>
            <p className="text-neutral-300 text-sm mb-5">
              {latestMovie.releaseDate
                ? new Date(latestMovie.releaseDate).getFullYear()
                : "—"}
              {details?.genres?.length
                ? ` · ${details.genres
                    .slice(0, 2)
                    .map((g) => g.name)
                    .join(", ")}`
                : ""}
              {details?.runtime ? ` · ${details.runtime} min` : ""}
            </p>
            <div className="flex gap-3">
              <Link
                href={`/filme/${latestMovie.id}`}
                className="bg-white text-neutral-900 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-neutral-200 transition"
              >
                Ver detalhes
              </Link>
              <button className="bg-white/10 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-white/20 transition">
                + challenge
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="px-10 py-8">
        {!hasMovies && (
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Noctreel</h1>
            <p className="text-neutral-400">
              Ainda não há filmes cadastrados. Vá em{" "}
              <a href="/buscar" className="text-emerald-400 hover:underline">
                Buscar
              </a>{" "}
              para adicionar o primeiro.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-neutral-400 text-xs mb-1">Filmes salvos</p>
            <p className="text-2xl font-semibold">{total}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-neutral-400 text-xs mb-1">Este mês</p>
            <p className="text-2xl font-semibold">{thisMonth}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-neutral-400 text-xs mb-1">Nota média</p>
            <p className="text-2xl font-semibold">
              {ratingAgg._avg.rating ? ratingAgg._avg.rating.toFixed(1) : "—"}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-neutral-400 text-xs mb-1">Challenges ativos</p>
            <p className="text-2xl font-semibold">{challengesCount}</p>
          </div>
        </div>

        <h2 className="text-lg font-medium mb-4">Últimos adicionados</h2>
        {recentMovies.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            Nenhum filme cadastrado ainda.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {recentMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/filme/${movie.id}`}
                className="group"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5">
                  {movie.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs p-2 text-center">
                      Sem poster
                    </div>
                  )}
                </div>
                <p className="text-sm mt-2 line-clamp-2 leading-tight group-hover:text-emerald-400 transition">
                  {movie.title}
                </p>
                <p className="text-neutral-500 text-xs">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : "—"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
