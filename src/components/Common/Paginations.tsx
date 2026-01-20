
import React, { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  const [jumpPage, setJumpPage] = useState<string>("");

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage("");
    }
  };

  const handleJumpInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) setJumpPage(val);
  };

  const handleJumpClick = (): void => {
    const pageNum = Number(jumpPage);
    if (pageNum >= 1 && pageNum <= totalPages) handlePageChange(pageNum);
  };

  const getPageNumbers = (): Array<number | string> => {
    const pages: Array<number | string> = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    pages.push(
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages
    );
    return pages;
  };

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

return (
  <div className="flex flex-col gap-3 px-2 py-3 sm:flex-row sm:items-center sm:justify-between bg-surface-card text-text-main">
    
    {/* Result Count */}
    <p className="text-sm font-semibold text-center text-text-subtle sm:text-left">
      Showing <span className="font-medium">{startItem}</span> to{" "}
      <span className="font-medium">{endItem}</span> of{" "}
      <span className="font-medium">{totalItems}</span> entries
    </p>

    {totalItems > 0 && (
      <div className="flex flex-wrap items-center justify-center gap-2">

        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium border bg-surface-card text-text-main border-border-primary hover:bg-surface-hover disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex flex-wrap justify-center gap-2">
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-4 py-2 text-sm font-medium border text-text-main bg-surface-card border-border-primary"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(Number(page))}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-4 py-2 text-sm font-medium border border-border-primary ${
                  page === currentPage
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-surface-card text-text-main hover:bg-surface-hover"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium border text-text-main bg-surface-card border-border-primary hover:bg-surface-hover disabled:opacity-50"
        >
          Next
        </button>

        {/* Jump To Page */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={jumpPage}
            onChange={handleJumpInput}
            placeholder="Page"
            className="w-16 px-2 py-2 text-sm border border-border-primary text-text-main bg-surface-card"
          />
          <button
            onClick={handleJumpClick}
            className="px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80"
          >
            Go
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default Pagination;
