// src/component/MediaFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Define the component props explicitly
type MediaFiltersProps = {
  basePath: string;
  type?: "movie" | "tv";
};

export default function MediaFilters({ basePath, type = "movie" }: MediaFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "popular";
  const currentCountry = searchParams.get("country") || "";

  const categories = [
    { label: "Popular", value: "popular" },
    { label: "Top Rated", value: "top_rated" },
    { label: type === "movie" ? "Now Playing" : "Airing Today / Latest", value: "latest" },
  ];

  const countries = [
    { label: "All Countries", value: "" },
    { label: "Philippines", value: "PH" },
    { label: "United States", value: "US" },
    { label: "Japan", value: "JP" },
    { label: "South Korea", value: "KR" },
    { label: "United Kingdom", value: "GB" },
  ];

  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", val);
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("country", val);
    } else {
      params.delete("country");
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full sm:w-auto">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="w-full sm:w-auto">
        <select
          value={currentCountry}
          onChange={handleCountryChange}
          className="w-full sm:w-auto bg-white/5 text-zinc-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 focus:outline-hidden focus:border-violet-500 transition-all cursor-pointer"
        >
          {countries.map((c) => (
            <option key={c.value} value={c.value} className="bg-[#0a0a0f] text-zinc-300">
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}