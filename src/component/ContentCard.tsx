'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ContentCardType } from '@/src/types';

export default function ContentCard({ card }: { card: ContentCardType }) {
  return (
   <Link 
   href={`/${card.type}/${card.id}`} 
   className="block w-[180px] flex-shrink-0"
   >

      <div className="relative h-60 w-full rounded-md overflow-hidden shadow-md">
        <Image
  src={card.imageUrl || card.posterUrl}
  alt={card.title}
  width={200} // or whatever fits your layout
  height={300}
  className="object-cover transition-transform duration-300 hover:scale-105 rounded-md"
/>
      </div>
      <div className="mt-2 text-[#FBE9E7] text-sm">
        <h3 className="font-semibold truncate">{card.title}</h3>
        <p className="text-xs text-[#BCAAA4]">{card.genre} • {card.year}</p>
      </div>
    </Link>
  );
}
