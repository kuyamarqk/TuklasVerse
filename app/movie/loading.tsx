// app/movie/loading.tsx
import MediaGridSkeleton from "@/component/component/MediaGridSkeleton";

export default function MovieCatalogLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 px-6 pt-28 pb-10 selection:bg-violet-500/30 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="h-3.5 bg-white/5 rounded-md w-40 mb-6" />
      </div>

      <header className="max-w-7xl mx-auto mb-10 border-b border-white/5 pb-6">
        <div className="h-9 bg-white/5 rounded-lg w-64 mb-3" />
        <div className="h-3 bg-white/5 rounded-md w-48" />
      </header>

      <main className="max-w-7xl mx-auto">
        <MediaGridSkeleton count={15} />
      </main>
    </div>
  );
}