// src/components/Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5; // Number of page buttons to display directly

    // Always add the first page
    if (totalPages > 0) {
        pageNumbers.push(1);
    }

    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2) + 1);
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2) - 1);

    // Adjust start/end pages if current page is near the beginning or end
    if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    }
    if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 2);
    }

    // Add ellipsis if needed after page 1
    if (startPage > 2) {
        pageNumbers.push('...');
    }

    // Add main page numbers
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // Add ellipsis if needed before the last page
    if (endPage < totalPages - 1) {
        pageNumbers.push('...');
    }

    // Always add the last page if it's not already included and totalPages > 1
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
    }
    
    // Filter out duplicates that might occur with complex logic
    // And ensure '...' only appears once if it would otherwise be duplicated
    const uniquePageNumbers: (number | string)[] = [];
    pageNumbers.forEach(p => {
        if (typeof p === 'string' && uniquePageNumbers[uniquePageNumbers.length - 1] === '...') {
            // Skip adding '...' if the last added item was also '...'
            return;
        }
        if (typeof p === 'number' && uniquePageNumbers.includes(p)) {
             // Skip adding a number if it's already there
             return;
        }
        uniquePageNumbers.push(p);
    });


    return (
        <div className='flex justify-center items-center space-x-2 mt-8 text-[#3E2723]'>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 rounded-md bg-[#2196F3] text-[#FBE9E7] hover:bg-[#1A7BC2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                Prev
            </button>

            {uniquePageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                    {typeof page === 'number' ? (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded-md ${
                                page === currentPage
                                    ? 'bg-[#FFD54F] text-[#3E2723] font-semibold' // Active page: Sun Yellow background, Dark Neutral text
                                    : 'bg-[#5D4037] text-[#FBE9E7] hover:bg-[#7A4F3F]' // Inactive page: Darker background, Light Red text
                            } transition-colors duration-200`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span className="px-3 py-1 text-[#FBE9E7]">...</span> 
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-[#2196F3] text-[#FBE9E7] hover:bg-[#1A7BC2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;