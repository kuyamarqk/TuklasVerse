// app/api/dramabox/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEpisodeStream } from "@/lib/dramabox";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bookId = searchParams.get("bookId");
  const episode = searchParams.get("episode");

  if (!bookId || !episode) {
    return NextResponse.json(
      { error: "Missing bookId or episode parameter" },
      { status: 400 }
    );
  }

  const episodeNumber = Number(episode);
  if (Number.isNaN(episodeNumber)) {
    return NextResponse.json({ error: "Invalid episode number" }, { status: 400 });
  }

  const result = await getEpisodeStream(bookId, episodeNumber);

  if (!result) {
    return NextResponse.json({ error: "Stream not available" }, { status: 502 });
  }

  return NextResponse.json(result);
}