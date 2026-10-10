// app/movie/page.tsx
import MediaCard from "@/component/MediaCard";
import Pagination from "@/component/Pagination";
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getNowPlayingMovies, 
  discoverMoviesByCountry, 
  Media 
} from "@/lib/tmdb";
import Breadcrumbs from "@/component/Breadcrumbs";
import MediaFilters from "@/component/MediaFilters";

type PageProps = {
  searchParams: Promise<{ page?: string; category?: string; country?: string }>;
};

export default async function MovieCatalogPage({ searchParams }: PageProps) {
  // Extract and parse page numbers and filters safely from Server runtime
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const currentCategory = resolvedParams.category || "popular";
  const currentCountry = resolvedParams.country || "";
  
  let movies: Media[] = []; 
  let totalPages = 500; // TMDB enforces a hard limit cap of 500 pages max for list distributions
  let errorMessage = "";

  try {
    let response;
    
    // Dynamically choose the right TMDB fetch engine based on filters
    if (currentCountry) {
      response = await discoverMoviesByCountry(currentCountry, currentPage);
    } else if (currentCategory === "top_rated") {
      response = await getTopRatedMovies(currentPage);
    } else if (currentCategory === "now_playing") {
      response = await getNowPlayingMovies(currentPage);
    } else {
      response = await getPopularMovies(currentPage);
    }
    
    movies = response?.results || [];
    if (response?.total_pages) {
      totalPages = Math.min(response.total_pages, 500);
    }
  } catch (error) {
    console.error("Failed to fetch movie catalog profiles:", error);
    errorMessage = "Could not sync collection metrics from TMDB pipelines.";
  }

  // Helper chunk handler mapping items to clean groups of 5
  const chunkMovies = (array: Media[], size: number) => {
    const chunked: Media[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const movieRows = chunkMovies(movies, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 px-6 pt-28 pb-10 selection:bg-violet-500/30">
      
      {/* HEADER BREADCRUMB */}
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Movies" },
          ]}
        />
      </div>

      {/* INTERFACE CATALOGUE TITLE & FILTERS */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-white/5 pb-6">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Explore Movies
        </h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
          Live TMDB Collection Network • Page {currentPage}
        </p>

        {/* Category & Country Filter Bar */}
        <MediaFilters basePath="/movie" type="movie" />
      </header>

      {/* RESPONSIVE RENDERING ENGINE GRID */}
      <main className="max-w-7xl mx-auto">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-6">
            ⚠️ {errorMessage}
          </div>
        )}

        {movies.length === 0 && !errorMessage ? (
  <div className="text-center py-20 text-xs text-zinc-500">
    No media matches extracted from target servers.
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {movies.map((item) => (
      <div key={item.id} className="flex flex-col">
        <MediaCard media={item} mediaType="movie" />
      </div>
    ))}
  </div>
)}

        {/* PAGINATION INTERACTIVE CONTROL STRIP */}
        {!errorMessage && movies.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            basePath="/movie" 
          />
        )}
      </main>

    </div>
  );
}