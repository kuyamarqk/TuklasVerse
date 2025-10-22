'use client';

import { useRef } from 'react';
import ContentCard from './ContentCard';
import { ContentCardType } from '@/src/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface ContentRowProps {
  items: ContentCardType[];
}

export default function ContentRow({ items }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] p-2 rounded-full hover:bg-[#2a2a2a] transition"
      >
        <ChevronLeftIcon className="h-5 w-5 text-[#FBE9E7]" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] p-2 rounded-full hover:bg-[#2a2a2a] transition"
      >
        <ChevronRightIcon className="h-5 w-5 text-[#FBE9E7]" />
      </button>

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#1a1a1a] to-transparent z-0 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#1a1a1a] to-transparent z-0 pointer-events-none" />

      {/* Scrollable Row */}
      <div
  ref={scrollRef}
  className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scroll-smooth scrollbar-hide"
>
        {items.map((item) => (
          <div key={item.id} className="snap-start">
            <ContentCard card={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
