// component/GenreGrid.tsx
"use client";

import { Film, Tv } from "lucide-react";

type Genre = {
  id: number;
  name: string;
};

type GenreGridProps = {
  title: string;
  mediaType: "movie" | "tv";
  genres: Genre[];
  onGenreClick: (term: string) => void;
};

export default function GenreGrid({ title, mediaType, genres, onGenreClick }: GenreGridProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold tracking-wide text-violet-400 uppercase select-none">
        {mediaType === "tv" ? <Tv size={16} /> : <Film size={16} />}
        <span>{title}</span>
      </div>
      <hr className="border-white/10 mb-4" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreClick(genre.name)}
            className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 hover:border-violet-500/30 transition-all duration-200 cursor-pointer text-left truncate"
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}