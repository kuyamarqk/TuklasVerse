// src/components/MediaRow.tsx
import Link from "next/link";
import MediaCard from "./MediaCard";
import { Media, MediaType } from "@/lib/tmdb";

type Props = {
  title: string;
  items: Media[];
  mediaType?: MediaType;
};

export default function MediaRow({ title, items, mediaType }: Props) {
  // Gracefully drop the section if there's no data to slide through
  if (!items?.length) return null;

  // Determine the target routing page based on explicit props or first item's type properties
  const fallbackType = mediaType || items[0]?.media_type || "movie";
  
  // Build the redirection path based on media type slugs (e.g., /movie or /tv)
  const seeMoreLink = `/${fallbackType}`;

  return (
    <section className="mb-10">
      
      {/* Sleek header container aligning title and the link */}
      <div className="flex items-center justify-between mb-4 px-6 select-none">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">
          {title}
        </h2>
        
        {/* Dynamic Interactive Redirection Link */}
        <Link 
          href={seeMoreLink}
          className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-widest flex items-center gap-1 group/row"
        >
          See More 
          <span className="inline-block transition-transform duration-200 group-hover/row:translate-x-1">
            →
          </span>
        </Link>
      </div>
      
      {/* Slider viewport container */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-none snap-x snap-mandatory">
        {items.map((item) => (
          // wrap or pass properties into the card cleanly
          <div key={item.id} className="shrink-0 snap-start">
            <MediaCard media={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </section>
  );
}