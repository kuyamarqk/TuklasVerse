'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const maxVisible = 5;
  const pages: number[] = [];

  const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const showStartEllipsis = startPage > 1;
  const showEndEllipsis = endPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-2 py-6 text-[#FBE9E7]">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md font-medium transition
          ${
            currentPage === 1
              ? 'bg-[#333] text-[#777] cursor-not-allowed'
              : 'bg-[#1a1a1a] hover:bg-[#FFAB91] text-[#FBE9E7]'
          }`}
      >
        Prev
      </button>

      {/* Start Ellipsis */}
      {showStartEllipsis && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-md bg-[#1a1a1a] text-[#BCAAA4] hover:bg-[#FFAB91]"
          >
            1
          </button>
          <span className="px-2 text-[#BCAAA4]">...</span>
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md font-medium transition
            ${
              page === currentPage
                ? 'bg-[#FF8A65] text-[#1a1a1a]'
                : 'bg-[#1a1a1a] text-[#BCAAA4] hover:bg-[#FFAB91]'
            }`}
        >
          {page}
        </button>
      ))}

      {/* End Ellipsis */}
      {showEndEllipsis && (
        <>
          <span className="px-2 text-[#BCAAA4]">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-md bg-[#1a1a1a] text-[#BCAAA4] hover:bg-[#FFAB91]"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md font-medium transition
          ${
            currentPage === totalPages
              ? 'bg-[#333] text-[#777] cursor-not-allowed'
              : 'bg-[#1a1a1a] hover:bg-[#FFAB91] text-[#FBE9E7]'
          }`}
      >
        Next
      </button>
    </div>
  );
}
