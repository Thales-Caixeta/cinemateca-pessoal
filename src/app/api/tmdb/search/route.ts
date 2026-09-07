import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query,
  )}&language=en-US&page=1`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from TMDB" },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
