'use client';

import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'; // ⭐ Imported MagnifyingGlassIcon

export default function FilterBar({
  genres,
  onSelectGenre,
  onSearch, // ⭐ Used in handleSearch
}: {
  genres: { id: number; name: string }[];
  onSelectGenre: (genre: string) => void;
  onSearch: (query: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [search, setSearch] = useState(''); // ⭐ Used in handleSearch and input value

  const handleGenreClick = (genre: string) => {
    setActiveGenre(genre);
    onSelectGenre(genre);
    // Optionally clear search when a genre is selected
    setSearch('');
    onSearch(''); 
  };
  
  // ⭐ NEW: Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
    // Optionally clear active genre when searching
    setActiveGenre(null); 
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="relative flex flex-col gap-4 px-6 py-4 bg-[#121212]">
      
      {/* Search Input (New Section) */}
      <form onSubmit={handleSearch} className="flex items-center w-full max-w-lg mx-auto">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for a movie or TV series..."
            value={search} // ⭐ Used 'search'
            onChange={(e) => setSearch(e.target.value)} // ⭐ Used 'setSearch'
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1a1a1a] text-[#FBE9E7] placeholder-[#BCAAA4] border border-[#333] focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#BCAAA4]" />
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-[#FF8A65] text-[#121212] font-semibold rounded-full hover:bg-[#FFAB91] transition"
        >
          Go
        </button>
      </form>
      
      {/* Genre Scroll Bar */}
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 bg-[#1a1a1a] p-2 rounded-full hover:bg-[#2a2a2a] transition shadow-lg"
        >
          <ChevronLeftIcon className="h-5 w-5 text-[#FBE9E7]" />
        </button>

        {/* Scrollable Genre Buttons */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-10 scrollbar-hide w-full"
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
              {/* Removed the second active indicator span for cleaner look, as border is already used */}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 bg-[#1a1a1a] p-2 rounded-full hover:bg-[#2a2a2a] transition shadow-lg"
        >
          <ChevronRightIcon className="h-5 w-5 text-[#FBE9E7]" />
        </button>
      </div>
    </div>
  );
}