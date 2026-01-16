// src/components/Table/Table.jsx
import React, { useState, useMemo } from 'react';
import styles from './Table.module.css';

/**
 * Pagination Component
 */
const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange, pageSizeOptions }) => {
    const pages = useMemo(() => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    }, [currentPage, totalPages]);

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationControls}>
                <button
                    className={styles.paginationButton}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    ‹
                </button>

                {pages.map((page, index) =>
                    page === '...' ? (
                        <span key={`dots-${index}`} className={styles.paginationDots}>
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            className={`${styles.paginationButton} ${page === currentPage ? styles.active : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    className={styles.paginationButton}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>

            {pageSizeOptions && (
                <div className={styles.pageSize}>
                    <label htmlFor="page-size">Rows per page:</label>
                    <select
                        id="page-size"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className={styles.pageSizeSelect}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};
export default Pagination;