// app/loading.tsx

function HomeRowSkeleton() {
  return (
    <section className="mb-10">
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
    </section>
  );
}

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 animate-pulse">
      {/* Navbar placeholder — matches h-14 of the real fixed Navbar */}
      <div className="h-14 bg-white/5 border-b border-white/5" />

      <main className="pt-14">
        {/* Hero banner placeholder — matches HeroBanner's h-[55vh] min-h-90 */}
        <div className="relative h-[55vh] min-h-90 w-full overflow-hidden bg-white/5">
          <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 max-w-lg space-y-3">
            <div className="h-3 bg-white/10 rounded-md w-40" />
            <div className="h-9 sm:h-10 bg-white/10 rounded-lg w-full" />
            <div className="space-y-2 pt-1">
              <div className="h-3.5 bg-white/10 rounded-md w-full" />
              <div className="h-3.5 bg-white/10 rounded-md w-2/3" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-32 bg-white/10 rounded-xl" />
              <div className="h-10 w-32 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Content rows */}
        <div className="py-8 space-y-2 px-4 sm:px-8 md:px-12 lg:px-16 max-w-480 mx-auto">
          <HomeRowSkeleton />
          <HomeRowSkeleton />
          <HomeRowSkeleton />
          <HomeRowSkeleton />
        </div>
      </main>
    </div>
  );
}