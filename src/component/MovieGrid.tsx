'use client';

import { useState } from 'react';
import ContentCard from '@/component/ContentCard';
import { ContentCardType } from '@/src/types'; // ✅ Import the correct type

export default function MovieGrid({
  popular,
  trending,
}: {
  popular: ContentCardType[]; // ✅ Use ContentCardType
  trending: ContentCardType[];
}) {
  const [filter, setFilter] = useState<'popular' | 'trending'>('popular');
  const movies = filter === 'popular' ? popular : trending;

  return (
    <div className="px-4 py-4 bg-[#121212] text-[#FBE9E7]">
      {/* Filter Toggle */}
      <div className="flex gap-3 mb-4">
        {['popular', 'trending'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as 'popular' | 'trending')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200
              ${
                filter === type
                  ? 'bg-[#FF8A65] text-[#1a1a1a] shadow-sm'
                  : 'bg-[#1a1a1a] text-[#BCAAA4] border border-[#333] hover:border-[#FFAB91]'
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <ContentCard key={movie.id} card={movie} />
        ))}
      </div>
    </div>
  );
}
