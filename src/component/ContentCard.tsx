'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ContentCardType } from '@/src/types';

export default function ContentCard({ card }: { card: ContentCardType }) {
  // Determine if the score is high enough to highlight (e.g., above 7.0)
  const isHighlyRated = card.score && card.score > 7;

  return (
    <Link 
      href={`/${card.type}/${card.id}`} 
      className="group block w-full sm:w-[180px] flex-shrink-0 transition-all duration-300"
    >
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-lg bg-[#1a1a1a] border border-[#333] group-hover:border-[#FF8A65]/50">
        
        {/* 1. Score Badge (Optional but looks great) */}
        {card.score && card.score > 0 && (
          <div className={`absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md ${
            isHighlyRated ? 'bg-[#FF8A65] text-black' : 'bg-black/60 text-white border border-white/20'
          }`}>
            {card.score.toFixed(1)}
          </div>
        )}

        {/* 2. Optimized Image with 'fill' for better responsiveness */}
        <Image
          src={card.posterUrl || card.imageUrl} // Prefer posterUrl for cards
          alt={card.title}
          fill
          sizes="(max-width: 768px) 50vw, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* 3. Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
           <span className="text-[10px] font-bold text-[#FF8A65] uppercase tracking-widest">View Details</span>
        </div>
      </div>

      {/* 4. Info Section */}
      <div className="mt-3 space-y-1 px-1">
        <h3 className="font-bold text-[#FBE9E7] text-sm truncate group-hover:text-[#FF8A65] transition-colors">
          {card.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-[#BCAAA4]">
          <span>{card.year}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#333]">
            {card.genre}
          </span>
        </div>
      </div>
    </Link>
  );
}