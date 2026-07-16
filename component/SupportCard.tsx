// component/SupportCard.tsx
import Link from "next/link";
import { Coffee } from "lucide-react";

type SupportCardProps = {
  variant?: "banner" | "compact";
  className?: string;
};

const KOFI_URL = "https://ko-fi.com/kuyamarqk";

export default function SupportCard({ variant = "banner", className = "" }: SupportCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all group ${className}`}
      >
        <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0">
          <Coffee size={15} className="text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Support TuklasVerse</p>
          <p className="text-xs text-white/40 truncate">Buy me a coffee on Ko-fi</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl bg-linear-to-r from-violet-600/10 to-white/5 border border-violet-500/20 hover:border-violet-500/40 transition-all group ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center shrink-0">
        <Coffee size={22} className="text-violet-400" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="font-bold text-white">Enjoying TuklasVerse?</p>
        <p className="text-sm text-white/50">
          Support the project by buying me a coffee — it helps keep the lights on.
        </p>
      </div>
      <span className="shrink-0 px-4 py-2 rounded-lg bg-violet-600 group-hover:bg-violet-500 text-white text-sm font-semibold transition-colors whitespace-nowrap">
        Buy me a coffee ☕
      </span>
    </Link>
  );
}