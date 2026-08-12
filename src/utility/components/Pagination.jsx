import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '../../configs/themeConfig';

export default function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '34px', height: '34px', padding: '0 4px',
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
    color: theme.color.textSecondary,
    fontSize: theme.font.sizeSm,
    fontWeight: 500,
    cursor: 'pointer',
  };

  const activeBtn = {
    ...btnBase,
    backgroundColor: theme.color.primaryDark,
    color: '#ffffff',
    borderColor: theme.color.primaryDark,
    fontWeight: 700,
  };

  const disabledBtn = {
    ...btnBase,
    opacity: 0.4,
    cursor: 'default',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.85rem 1rem',
      borderTop: `1px solid ${theme.color.borderLight}`,
      backgroundColor: theme.color.surface,
    }}>
      <span style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, fontWeight: 500 }}>
        Menampilkan {start}–{end} dari {totalItems} data
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          style={currentPage === 1 ? disabledBtn : btnBase}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} style={{ padding: '0 4px', color: theme.color.textMuted, fontSize: theme.font.sizeSm }}>···</span>
            : (
              <button
                key={p}
                style={currentPage === p ? activeBtn : btnBase}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
        )}

        <button
          style={currentPage === totalPages ? disabledBtn : btnBase}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
