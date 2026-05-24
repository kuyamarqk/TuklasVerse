// src/components/MediaRow.tsx
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

  return (
    <section className="mb-10">
      {/* Sleek, muted, tracked headers matching the glassmorphic theme */}
      <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 px-6 select-none">
        {title}
      </h2>
      
      {/* Slider viewport container */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-none snap-x snap-mandatory">
        {items.map((item) => (
          // wrap or pass properties into the card cleanly
          <div key={item.id} className="flex-shrink-0 snap-start">
            <MediaCard media={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </section>
  );
}