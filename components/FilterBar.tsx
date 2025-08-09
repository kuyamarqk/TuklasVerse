'use client';

import React, { useState, useEffect } from 'react';

interface FilterBarProps {
  currentSearchTerm: string;
  currentFilterType: string;
  currentSortBy: string;
  onSearch: (term: string) => void;
  onFilterTypeChange: (type: string) => void;
  onSortByChange: (sort: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  currentSearchTerm,
  currentFilterType,
  currentSortBy,
  onSearch,
  onFilterTypeChange,
  onSortByChange,
}) => {
  // Ensure initial state is always string
  const [searchInput, setSearchInput] = useState(currentSearchTerm ?? '');

  // Sync searchInput state if currentSearchTerm prop changes
  useEffect(() => {
    setSearchInput(currentSearchTerm ?? '');
  }, [currentSearchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  return (
    <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-wrap gap-4 items-center">
      {/* Search Input */}
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search anime, manga, movies..."
        className="flex-1 min-w-[200px] px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-black"
      />

      {/* Filter by Type */}
      <select
        value={currentFilterType}
        onChange={(e) => onFilterTypeChange(e.target.value)}
        className="px-4 py-2 rounded border border-gray-300 bg-white text-black"
      >
        <option value="All">All</option>
        <option value="Movie">Movie</option>
        <option value="TV Series">TV Series</option>
        <option value="Anime">Anime</option>
        <option value="Manga">Manga</option>
      </select>

      {/* Sort By */}
      <select
        value={currentSortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="px-4 py-2 rounded border border-gray-300 bg-white text-black"
      >
        <option value="Recently Added">Recently Added</option>
        <option value="Popularity">Popularity</option>
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded"
      >
        Search
      </button>
    </form>
  );
};

export default FilterBar;
