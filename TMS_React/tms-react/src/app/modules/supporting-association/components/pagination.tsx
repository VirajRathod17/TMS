import React, { useState } from 'react';
import clsx from 'clsx';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPage: number;
  isLoading?: boolean;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage,
  isLoading,
}: PaginationProps) => {
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages && !isLoading) {
      onPageChange(newPage);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedItemsPerPage = parseInt(event.target.value, 10);
    onItemsPerPageChange(selectedItemsPerPage);
    onPageChange(1);
  };

  return (
    <nav className="pagination-container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <label htmlFor="itemsPerPage" className="me-2">Records per Page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="form-select d-inline-block"
            style={{ width: 'auto', height: '40px' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <ul className="pagination justify-content-end mb-0">
          <li className={clsx('page-item', { disabled: currentPage === 1 })}>
            <button className="page-link me-5" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index + 1} className={clsx('page-item', { active: currentPage === index + 1 })}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={clsx('page-item', { disabled: currentPage === totalPages })}>
            <button className="page-link ms-1 me-2" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Pagination;
