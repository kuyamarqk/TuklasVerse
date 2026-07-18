// app/genre/[slug]/[type]/loading.tsx
import MediaGridSkeleton from "@/component/component/MediaGridSkeleton";

export default function GenreLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 animate-pulse">
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        <div className="h-3.5 bg-white/5 rounded-md w-56 mb-4" />

        <div className="mb-6">
          <div className="h-9 bg-white/5 rounded-lg w-56 mb-4" />

          {/* Movie/TV toggle tabs placeholder */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
            <div className="h-9 w-24 bg-white/5 rounded-lg" />
            <div className="h-9 w-24 bg-white/5 rounded-lg" />
          </div>
        </div>

        <MediaGridSkeleton count={15} />
      </main>
    </div>
  );
}