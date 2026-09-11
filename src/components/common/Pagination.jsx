import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 24,
  onPageChange,
  itemLabel = 'creations',
  scrollTargetId = null
}) => {
  if (totalPages <= 1 && totalItems <= pageSize) return null;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);

    if (typeof window !== 'undefined') {
      if (scrollTargetId) {
        const el = document.getElementById(scrollTargetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      // Gentle scroll back to top of product catalog
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  // Generate pagination range with smart ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <nav 
      aria-label="Pagination Navigation"
      style={{
        marginTop: '2.5rem',
        marginBottom: '4.5rem',
        padding: '1.5rem 1rem 3rem 1rem',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}
    >
      {/* Item Counter Text */}
      <div 
        style={{
          fontSize: '0.82rem',
          color: '#6b7280',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        Showing <strong style={{ color: '#111827' }}>{startIndex + 1}</strong>–<strong style={{ color: '#111827' }}>{endIndex}</strong> of <strong style={{ color: '#111827' }}>{totalItems}</strong> {itemLabel}
      </div>

      {/* Pagination Controls */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '6px'
        }}
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            background: '#ffffff',
            color: '#111827',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.4 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <ChevronLeft size={15} />
          <span>Previous</span>
        </button>

        {/* Numbered Page Buttons (Desktop & Tablet) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span 
                  key={`ellipsis-${idx}`} 
                  style={{ 
                    padding: '0 6px', 
                    color: '#9ca3af', 
                    fontSize: '0.85rem',
                    userSelect: 'none'
                  }}
                >
                  …
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => handlePageClick(p)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  minWidth: '36px',
                  height: '36px',
                  padding: '0 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  border: isActive ? '1px solid #0b0c10' : '1px solid #e5e7eb',
                  background: isActive ? '#0b0c10' : '#ffffff',
                  color: isActive ? '#ffffff' : '#374151',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            background: '#ffffff',
            color: '#111827',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages ? 0.4 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <span>Next</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </nav>
  );
};
