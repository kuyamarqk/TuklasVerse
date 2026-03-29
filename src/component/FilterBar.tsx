'use client';

import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function FilterBar({
  genres,
  onSelectGenre,
  onSearch,
}: {
  genres: { id: number; name: string }[];
  onSelectGenre: (genreId: string) => void; // Changed to expect an ID string
  onSearch: (query: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const handleGenreClick = (id: number) => {
    setActiveGenreId(id);
    onSelectGenre(id.toString()); // Pass the ID to the API
    setSearch(''); // Clear search when a genre is picked
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSearch(search);
      setActiveGenreId(null);
    } else {
      
      onSelectGenre(''); 
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex flex-col gap-6 px-6 py-6 bg-[#121212] border-b border-[#1a1a1a]">
      
      {/* 1. Search Section */}
      <form onSubmit={handleSearch} className="flex items-center w-full max-w-2xl mx-auto group">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a1a] text-[#FBE9E7] placeholder-[#BCAAA4] border border-[#333] focus:border-[#FF8A65] focus:ring-1 focus:ring-[#FF8A65] outline-none transition-all"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BCAAA4] group-focus-within:text-[#FF8A65] transition-colors" />
        </div>
        <button
          type="submit"
          className="ml-3 px-6 py-3 bg-[#FF8A65] text-[#121212] font-bold rounded-xl hover:bg-[#FFAB91] active:scale-95 transition-all"
        >
          Search
        </button>
      </form>

      {/* 2. Genre Section */}
      <div className="relative flex items-center group/scroll">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-20 bg-gradient-to-r from-[#121212] via-[#121212] to-transparent p-2 pr-8 hover:scale-110 transition-transform opacity-0 group-hover/scroll:opacity-100"
        >
          <ChevronLeftIcon className="h-6 w-6 text-[#FBE9E7]" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-2 scrollbar-hide w-full mask-fade"
        >
          {/* Add an "All" button to clear filters */}
          <button
            onClick={() => { setActiveGenreId(null); onSelectGenre(''); }}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-medium border transition-all ${
              activeGenreId === null 
              ? 'bg-[#FF8A65] text-black border-[#FF8A65]' 
              : 'bg-[#1a1a1a] text-[#BCAAA4] border-[#333] hover:border-[#BCAAA4]'
            }`}
          >
            All
          </button>

          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-medium border transition-all ${
                activeGenreId === genre.id
                  ? 'bg-[#FF8A65] text-black border-[#FF8A65]'
                  : 'bg-[#1a1a1a] text-[#BCAAA4] border-[#333] hover:border-[#FFAB91]'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-20 bg-gradient-to-l from-[#121212] via-[#121212] to-transparent p-2 pl-8 hover:scale-110 transition-transform opacity-0 group-hover/scroll:opacity-100"
        >
          <ChevronRightIcon className="h-6 w-6 text-[#FBE9E7]" />
        </button>
      </div>
    </div>
  );
}