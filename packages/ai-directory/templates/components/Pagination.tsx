import React from 'react'

export interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) {
    return null
  }

  const renderPageNumbers = () => {
    const pages = []

    pages.push(
      <button key={1} onClick={() => onPageChange(1)} className={currentPage === 1 ? 'active' : ''} disabled={currentPage === 1}>
        1
      </button>
    )

    let startPage = Math.max(2, currentPage - 2)
    let endPage = Math.min(totalPages - 1, currentPage + 2)

    if (startPage > 2) {
      pages.push(<span key="ellipsis-1">...</span>)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => onPageChange(i)} className={currentPage === i ? 'active' : ''}>
          {i}
        </button>
      )
    }

    if (endPage < totalPages - 1) {
      pages.push(<span key="ellipsis-2">...</span>)
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={currentPage === totalPages ? 'active' : ''}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>

      {renderPageNumbers()}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  )
}
