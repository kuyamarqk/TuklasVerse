'use client';

import FilterBar from '@/component/FilterBar';

export default function FilterWrapper({
  genres,
  onGenreChange,
  onSearchChange,
}: {
  genres: { id: number; name: string }[];
  onGenreChange: (genre: string) => void;
  onSearchChange: (query: string) => void;
}) {
  return (
    <FilterBar
      genres={genres}
      onSelectGenre={onGenreChange}
      onSearch={onSearchChange}
    />
  );
}
