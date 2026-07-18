// app/media/[type]/[id]/loading.tsx
export default function MediaLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 animate-pulse">
      {/* Navbar placeholder — matches h-14 of the real fixed Navbar */}
      <div className="h-14 bg-white/5 border-b border-white/5" />

      {/* Full-bleed video player wrapper, matching the real page's w-full section */}
      <div className="w-full bg-black/40 border-b border-white/5 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/10" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        <div className="flex flex-col sm:flex-row gap-8 mb-12">
          {/* Poster placeholder */}
          <div className="hidden sm:block shrink-0 w-44 aspect-2/3 rounded-2xl bg-white/5 border border-white/10" />

          <div className="flex-1 space-y-4">
            {/* Genre chip row */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-white/5 rounded-md" />
              <div className="h-6 w-16 bg-white/5 rounded-md" />
              <div className="h-6 w-16 bg-white/5 rounded-md" />
            </div>

            {/* Title */}
            <div className="h-9 bg-white/5 rounded-lg w-2/3" />

            {/* Meta row (year, runtime, rating) */}
            <div className="h-4 bg-white/5 rounded-lg w-1/3" />

            {/* Overview lines */}
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-white/5 rounded-lg w-full" />
              <div className="h-4 bg-white/5 rounded-lg w-full" />
              <div className="h-4 bg-white/5 rounded-lg w-2/3" />
            </div>

            {/* Watchlist button placeholder */}
            <div className="h-11 w-40 bg-white/5 rounded-xl mt-2" />
          </div>
        </div>
      </main>
    </div>
  );
}