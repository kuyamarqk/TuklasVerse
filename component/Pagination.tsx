// components/Pagination.tsx
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  // Ensure totalPages is at least 1
  const maxPages = Math.max(1, totalPages);

  // ✨ FIX: Calculate clean, balanced sliding page numbers
  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(maxPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-12 select-none">
      {/* PREVIOUS BUTTON */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-xl bg-white/5 opacity-40 border border-white/5 text-xs font-medium text-zinc-600 cursor-not-allowed">
          ← Prev
        </span>
      )}

      {/* NUMBERED PAGE CORES */}
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
            currentPage === page
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20 border border-violet-500/30"
              : "bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* NEXT BUTTON */}
      {currentPage < maxPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
        >
          Next →
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-xl bg-white/5 opacity-40 border border-white/5 text-xs font-medium text-zinc-600 cursor-not-allowed">
          Next →
        </span>
      )}
    </div>
  );
}