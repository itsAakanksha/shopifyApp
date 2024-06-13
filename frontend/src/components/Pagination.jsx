import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex gap-2">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
      <Button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-4 py-2 rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"}`}
      >
        {page}
      </Button>
    ))}
  </div>
);

export default Pagination;
