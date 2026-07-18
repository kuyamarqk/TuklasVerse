// component/DramaRow.tsx
import type { DramaItem } from "@/lib/dramabox";
import DramaCard from "@/component/DramaCard";

type DramaRowProps = {
  title: string;
  items: DramaItem[];
};

export default function DramaRow({ title, items }: DramaRowProps) {
  // Gracefully drop the section if there's no data to slide through
  if (!items?.length) return null;

  return (
    <section className="mb-10">

      {/* Sleek header container, matching MediaRow's style */}
      <div className="flex items-center justify-between mb-4 px-6 select-none">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">
          {title}
        </h2>
      </div>

      {/* Slider viewport container */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-none snap-x snap-mandatory">
        {items.map((drama) => (
          <div key={drama.bookId} className="shrink-0 snap-start">
            <DramaCard drama={drama} />
          </div>
        ))}
      </div>
    </section>
  );
}