'use client';

import Pagination from './Pagination';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Add this prop
}

export default function PaginationWrapper({
  currentPage,
  totalPages,
  onPageChange, // Receive it here
}: PaginationWrapperProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange} // Pass it down
    />
  );
}