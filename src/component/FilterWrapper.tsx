'use client';

interface FilterWrapperProps {
  genres: { id: number; name: string }[];
  // 1. Add this prop so the parent can tell us what is selected
  activeGenre: string | null; 
  onGenreChange: (genre: string) => void;
}

export default function FilterWrapper({ 
  genres, 
  onGenreChange, 
  activeGenre // 2. Receive the prop here
}: FilterWrapperProps) {

  // 3. REMOVE the local useState. 
  // We use the 'activeGenre' prop from the parent instead.

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4">
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {genres.map((g) => (
          <button
            key={g.id}
            // 4. Pass the genre name back to the parent
            onClick={() => onGenreChange(g.name)}
            className={`px-3 py-1 rounded-full border transition whitespace-nowrap ${
              activeGenre === g.name
                ? 'bg-[#FBE9E7] text-[#121212] border-[#FBE9E7]'
                : 'bg-[#1a1a1a] text-[#FBE9E7] border-[#333] hover:border-[#FFAB91]'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}