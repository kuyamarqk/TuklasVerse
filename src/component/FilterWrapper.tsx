'use client';

import { useState } from 'react';

interface FilterWrapperProps {
  genres: { id: number; name: string }[];
  onGenreChange: (genre: string) => void;
}

export default function FilterWrapper({ genres, onGenreChange }: FilterWrapperProps) {
  const [activeGenre, setActiveGenre] = useState('All');

  const handleClick = (genre: string) => {
    setActiveGenre(genre);
    onGenreChange(genre);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4">
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => handleClick(g.name)}
            className={`px-3 py-1 rounded-full border transition ${
              activeGenre === g.name
                ? 'bg-[#FBE9E7] text-[#121212]'
                : 'bg-[#1a1a1a] text-[#FBE9E7] border-[#333]'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}
