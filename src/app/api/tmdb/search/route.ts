import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  // If someone types "lala" instead of "la la", TMDB won't return the movie
  // at all, because their search matches exact tokens, not text proximity.
  // We detect "glued" words that are a repeated syllable (lala -> la la,
  // haha -> ha ha) and run a second search with the spaced-out variant.
  function spaceOutReduplicated(text: string): string {
    return text
      .split(" ")
      .map((word) => {
        const half = word.length / 2;
        if (
          word.length >= 4 &&
          Number.isInteger(half) &&
          word.slice(0, half).toLowerCase() === word.slice(half).toLowerCase()
        ) {
          return `${word.slice(0, half)} ${word.slice(half)}`;
        }
        return word;
      })
      .join(" ");
  }

  async function fetchTmdb(q: string) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      q,
    )}&language=en-US&page=1&include_adult=false`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: "application/json",
      },
    });
    if (!res.ok) return null;
    return res.json();
  }

  const data = await fetchTmdb(query);
  if (!data) {
    return NextResponse.json(
      { error: "Failed to fetch from TMDB" },
      { status: 502 },
    );
  }

  const spacedQuery = spaceOutReduplicated(query);
  if (spacedQuery !== query) {
    const extra = await fetchTmdb(spacedQuery);
    if (extra?.results?.length) {
      const seenIds = new Set(
        (data.results || []).map((m: { id: number }) => m.id),
      );
      for (const movie of extra.results) {
        if (!seenIds.has(movie.id)) {
          data.results.push(movie);
          seenIds.add(movie.id);
        }
      }
    }
  }

  // TMDB sorts by pure text relevance, so a well-known movie can lose its
  // spot to an obscure title that matches the query more literally
  // (e.g. "Lala Land" -> "Lala's Land" ranking above "La La Land"). We
  // re-sort by popularity, which is a much stronger "this is what the
  // person wants" signal than exact spelling.
  if (Array.isArray(data.results)) {
    data.results.sort(
      (a: { popularity?: number }, b: { popularity?: number }) =>
        (b.popularity ?? 0) - (a.popularity ?? 0),
    );
  }

  return NextResponse.json(data);
}
