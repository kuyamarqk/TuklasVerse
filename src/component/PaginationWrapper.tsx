'use client';

import { useRouter } from 'next/navigation';
import Pagination from './Pagination';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationWrapper({
  currentPage,
  totalPages,
}: PaginationWrapperProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/movie?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
