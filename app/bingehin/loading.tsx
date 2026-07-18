// app/bingehin/loading.tsx
function DramaRowSkeleton() {
  return (
    <div className="mb-10">
      <div className="mb-4 px-6">
        <div className="h-3 bg-white/5 rounded-md w-32" />
      </div>
      <div className="flex gap-4 overflow-x-hidden px-6 pb-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="shrink-0 w-36 sm:w-44 lg:w-48">
            <div className="aspect-2/3 w-full rounded-xl bg-white/5 border border-white/5" />
            <div className="mt-2.5 space-y-1.5 px-0.5">
              <div className="h-3.5 bg-white/5 rounded-md w-4/5" />
              <div className="h-3 bg-white/5 rounded-md w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BingehinLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 animate-pulse">
      <main className="pt-28 pb-16 max-w-7xl mx-auto">
        <div className="mb-10 px-6">
          <div className="h-6 w-24 bg-white/5 rounded-full mb-3" />
          <div className="h-9 bg-white/5 rounded-lg w-2/3 max-w-md mb-2" />
          <div className="h-4 bg-white/5 rounded-md w-1/2 max-w-sm" />
        </div>

        <DramaRowSkeleton />
        <DramaRowSkeleton />
        <DramaRowSkeleton />
      </main>
    </div>
  );
}