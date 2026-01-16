// src/components/Table/Table.jsx
import React, { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import styles from './Table.module.css';

/**
 * Table Component
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column configuration
 * @param {Array} props.data - Table data
 * @param {boolean} props.sortable - Enable sorting
 * @param {boolean} props.pagination - Enable pagination (default: false)
 * @param {number} props.pageSize - Initial page size
 * @param {Array} props.pageSizeOptions - Page size options
 * @param {React.ReactNode} props.emptyState - Empty state component
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.striped - Striped rows
 * @param {boolean} props.hoverable - Hoverable rows
 * @param {Function} props.onRowClick - Row click handler
 * @param {string} props.className - Additional classes
 * @param {boolean} props.compact - Compact table variant
 * @param {boolean} props.bordered - Add borders to cells
 * @param {string} props.variant - Table variant ('default', 'outlined', 'elevated')
 */
const Table = ({
    columns = [],
    data = [],
    sortable = true,
    pagination = false,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    emptyState,
    loading = false,
    striped = true,
    hoverable = true,
    onRowClick,
    className = '',
    compact = false,
    bordered = false,
    variant = 'default',
    ...rest
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!sortable || !sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;

            const comparison = aValue < bValue ? -1 : 1;
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [data, sortConfig, sortable]);

    // Pagination logic
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const totalItems = sortedData.length;
    const startItem = pagination ? ((currentPage - 1) * pageSize) + 1 : 1;
    const endItem = pagination ? Math.min(currentPage * pageSize, totalItems) : totalItems;

    const handleSort = (key) => {
        if (!sortable) return;

        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) {
                endPage = maxVisiblePages;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - maxVisiblePages + 1;
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (startPage > 1) {
                if (startPage > 2) {
                    pages.unshift('...');
                }
                pages.unshift(1);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const tableClasses = [
        styles.tableWrapper,
        styles[variant],
        compact && styles.compact,
        bordered && styles.bordered,
        className
    ].filter(Boolean).join(' ');

    const rowClasses = [
        striped && styles.striped,
        hoverable && styles.hoverable,
        onRowClick && styles.clickable
    ].filter(Boolean).join(' ');

    if (loading) {
        return (
            <div className={tableClasses}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <span>Loading data...</span>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={tableClasses}>
                <div className={styles.empty}>
                    {emptyState || (
                        <>
                            <div className={styles.emptyIcon}>📊</div>
                            <h3>No data available</h3>
                            <p>There are no records to display</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={tableClasses} {...rest}>

            {pagination && totalPages > 0 && (
                <div className={styles.paginationContainerTop}>
                    <div className={styles.paginationInfo}>
                        {/* <span>
                            Showing {startItem} to {endItem} of {totalItems} entries
                        </span> */}
                        <div className={styles.pageSizeSelector}>
                            <span>Show</span>
                            <select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                className={styles.pageSizeSelect}
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span>entries</span>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`${styles.th} ${sortable && column.sortable !== false ? styles.sortable : ''}`}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                    style={{ width: column.width }}
                                >
                                    <div className={styles.thContent}>
                                        <span>{column.label}</span>
                                        {sortable && column.sortable !== false && sortConfig.key === column.key && (
                                            <span className={styles.sortIcon}>
                                                {sortConfig.direction === 'asc' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={rowClasses}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className={styles.td}>
                                        {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && totalPages > 0 && (
                <div className={styles.paginationContainerBottom}>

                    <div className={styles.paginationControls}>
                        <button
                            type="button"
                            className={`${styles.paginationButton} ${styles.firstPage}`}
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            aria-label="First page"
                        >
                            <FiChevronsLeft size={16} />
                        </button>

                        <button
                            type="button"
                            className={`${styles.paginationButton} ${styles.prevPage}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <FiChevronLeft size={16} />
                        </button>

                        <div className={styles.pageNumbers}>
                            {renderPageNumbers().map((page, index) => {
                                if (page === '...') {
                                    return (
                                        <span key={`dots-${index}`} className={styles.pageDots}>
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
                                        onClick={() => handlePageChange(page)}
                                        aria-label={`Page ${page}`}
                                        aria-current={currentPage === page ? 'page' : undefined}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            className={`${styles.paginationButton} ${styles.nextPage}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            <FiChevronRight size={16} />
                        </button>

                        <button
                            type="button"
                            className={`${styles.paginationButton} ${styles.lastPage}`}
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            aria-label="Last page"
                        >
                            <FiChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;