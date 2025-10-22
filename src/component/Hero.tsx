'use client';

import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  backdropUrl: string;
  title: string;
  overview: string;
  id: string | number;
  type: string;
}

export default function Hero({ backdropUrl, title, overview, id, type }: HeroProps) {
  return (
    <section className="relative h-[80vh] w-full bg-[#121212] text-[#FBE9E7]">
      {/* Background Image */}
      <Image
        src={backdropUrl}
        alt={title || 'Backdrop image'}
        fill
        priority
        className="object-cover brightness-[.4]"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]" />

      {/* Hero Content */}
      <div className="absolute bottom-20 left-10 max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">{title}</h1>
        <p className="text-sm md:text-base text-[#BCAAA4] line-clamp-3">{overview}</p>
        <Link
          href={`/${type}/${id}`}
          className="inline-block bg-[#FF8A65] hover:bg-[#FFAB91] transition px-6 py-3 rounded-md text-[#1a1a1a] font-semibold shadow-md"
        >
          ▶ Watch Now
        </Link>
      </div>
    </section>
  );
}
