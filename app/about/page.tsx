import { Compass, Sparkles, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About - TuklasVerse",
  description: "Learn more about TuklasVerse, your personal media universe.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
        About TuklasVerse
      </h1>
      <p className="text-white/60 leading-relaxed mb-10">
        TuklasVerse is a personal project built to make discovering movies and
        TV series simple and enjoyable. The name comes from the Filipino word
        &ldquo;tuklas&rdquo; — to discover — reflecting what this platform is
        all about: helping you explore your next favorite watch.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        <div className="p-5 rounded-xl bg-white/5 border border-white/5">
          <Compass size={20} className="text-violet-400 mb-3" />
          <h3 className="font-bold text-white mb-1.5">Discover</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            Browse trending, popular, and top-rated titles curated from a
            constantly updated catalog.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/5">
          <Sparkles size={20} className="text-violet-400 mb-3" />
          <h3 className="font-bold text-white mb-1.5">Personalize</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            Save titles to your list and pick up where you left off with
            watch history tracking.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-white/5">
          <Users size={20} className="text-violet-400 mb-3" />
          <h3 className="font-bold text-white mb-1.5">Built for everyone</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            Designed with simplicity and accessibility in mind, especially
            for viewers in the Philippines.
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-3">A note on content</h2>
      <p className="text-sm text-white/50 leading-relaxed mb-6">
        TuklasVerse does not host, upload, or store any video files on its own
        servers. Movie and TV metadata (titles, descriptions, posters, and
        ratings) is provided by{" "}
        <Link
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 underline"
        >
          The Movie Database (TMDB)
        </Link>
        . Streaming playback is handled through third-party embed providers.
      </p>

      <p className="text-sm text-white/40">
        Questions or feedback? Visit our{" "}
        <Link href="/contact" className="text-violet-400 hover:text-violet-300 underline">
          Contact page
        </Link>
        .
      </p>
    </div>
  );
}