// app/bingehin/page.tsx
import Navbar from "@/component/Navbar";
import DramaRow from "@/component/DramaRow";
import { getForYouDramas, getTrendingDramas, getLatestDramas } from "@/lib/dramabox";
import { Flame } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bingehin - TuklasVerse",
  description: "Discover your next short drama addiction. Trending and latest short dramas, all in one place.",
};

// Refresh this page's cached data periodically rather than on every request —
// the underlying API is a free community service, so we're deliberately gentle.
export const revalidate = 1800;

export default async function BingehinPage() {
  const [forYou, trending, latest] = await Promise.all([
    getForYouDramas(),
    getTrendingDramas(),
    getLatestDramas(),
  ]);

  const hasAnyContent = forYou.length > 0 || trending.length > 0 || latest.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-28 pb-16 max-w-7xl mx-auto">
        <div className="mb-10 px-6">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Flame size={13} className="text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Bingehin
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Your next short drama addiction
          </h1>
          <p className="text-white/50 max-w-xl">
            Bite-sized, binge-ready short dramas — new episodes drop fast, and so will you.
          </p>
        </div>

        {hasAnyContent ? (
          <div className="space-y-2">
            <DramaRow title="For You" items={forYou} />
            <DramaRow title="Trending Now" items={trending} />
            <DramaRow title="Latest Releases" items={latest} />
          </div>
        ) : (
          <div className="text-center py-20 px-6">
            <p className="text-white/40 text-sm">
              Couldn&apos;t load dramas right now — please try again in a bit.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}