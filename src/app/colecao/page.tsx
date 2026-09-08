interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  watched: boolean;
  rating: number | null;
}

async function getMovies(): Promise<Movie[]> {
  const res = await fetch("http://localhost:3000/api/movies", {
    cache: "no-store",
  });
  return res.json();
}

export default async function ColecaoPage() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Minha Coleção</h1>
        <p className="text-neutral-400 mb-8">
          {movies.length}{" "}
          {movies.length === 1 ? "filme assistido" : "filmes assistidos"}
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
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 relative">
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
                <p className="text-sm mt-2 line-clamp-1">{movie.title}</p>
                <p className="text-neutral-500 text-xs">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
