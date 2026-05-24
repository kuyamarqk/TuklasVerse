// app/media/[type]/[id]/loading.tsx
export default function MediaLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 animate-pulse">
      <div className="h-16 bg-white/5 border-b border-white/5" />
      <main className="max-w-5xl mx-auto px-6 pt-22">
        <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/10 mb-10" />
        <div className="flex gap-8">
          <div className="hidden sm:block w-44 aspect-2/3 rounded-2xl bg-white/5" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-white/5 rounded-lg w-1/3" />
            <div className="h-4 bg-white/5 rounded-lg w-1/4" />
            <div className="h-20 bg-white/5 rounded-lg w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}