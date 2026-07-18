// app/bingehin/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/component/Navbar";
import DramaPlayer from "@/component/DramaPlayer";
import SupportCard from "@/component/SupportCard";
import { getDramaByBookId, getAllEpisodes } from "@/lib/dramabox";
import { Metadata } from "next";
import { Flame, Users } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const drama = await getDramaByBookId(id);

  if (!drama) return { title: "Drama Not Found - TuklasVerse" };

  return {
    title: `${drama.title} - Bingehin - TuklasVerse`,
    description: drama.synopsis?.slice(0, 150) || "Watch short dramas on TuklasVerse.",
    openGraph: {
      images: [drama.coverUrl],
    },
  };
}

export default async function DramaDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [drama, episodes] = await Promise.all([
    getDramaByBookId(id),
    getAllEpisodes(id),
  ]);

  if (!drama || episodes.length === 0) return notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Navbar />

      <main className="pt-24 pb-16">
        <DramaPlayer bookId={drama.bookId} title={drama.title} initialEpisodes={episodes} />

        <div className="max-w-3xl mx-auto px-6 mt-10">
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="hidden sm:block shrink-0 w-32 aspect-2/3 rounded-xl overflow-hidden border border-white/10 shadow-xl">
              <Image
                src={drama.coverUrl}
                alt={drama.title}
                width={128}
                height={192}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-orange-400 font-bold uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Flame size={11} />
                  Short Drama
                </span>
                {drama.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
                {drama.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-white/40 mb-4">
                <span>{drama.episodeCount} Episodes</span>
                {drama.hotCode && (
                  <span className="flex items-center gap-1">
                    <Flame size={13} className="text-orange-400" />
                    {drama.hotCode} views
                  </span>
                )}
              </div>

              {drama.cast && (
                <p className="flex items-center gap-1.5 text-sm text-white/50 mb-4">
                  <Users size={14} />
                  {drama.cast}
                </p>
              )}

              <p className="text-sm text-white/60 leading-relaxed">{drama.synopsis}</p>
            </div>
          </div>

          <SupportCard variant="banner" />
        </div>
      </main>
    </div>
  );
}