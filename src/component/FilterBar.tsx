'use client';

import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function FilterBar({
  genres,
  onSelectGenre,
  onSearch,
}: {
  genres: { id: number; name: string }[];
  onSelectGenre: (genre: string) => void;
  onSearch: (query: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleGenreClick = (genre: string) => {
    setActiveGenre(genre);
    onSelectGenre(genre);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="relative flex flex-col gap-4 px-6 py-4 bg-[#121212]">
      
      {/* Genre Scroll Bar */}
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 bg-[#1a1a1a] p-2 rounded-full hover:bg-[#2a2a2a] transition"
        >
          <ChevronLeftIcon className="h-5 w-5 text-[#FBE9E7]" />
        </button>

        {/* Scrollable Genre Buttons */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-10 scrollbar-hide"
        >
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.name)}
              className={`relative whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all duration-200
                ${
                  activeGenre === genre.name
                    ? 'bg-[#1a1a1a] text-[#FBE9E7] border border-[#FF8A65]'
                    : 'bg-[#1a1a1a] text-[#BCAAA4] border border-[#333] hover:border-[#FFAB91]'
                }`}
            >
              {genre.name}
              {activeGenre === genre.name && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF8A65] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 bg-[#1a1a1a] p-2 rounded-full hover:bg-[#2a2a2a] transition"
        >
          <ChevronRightIcon className="h-5 w-5 text-[#FBE9E7]" />
        </button>
      </div>
    </div>
  );
}
