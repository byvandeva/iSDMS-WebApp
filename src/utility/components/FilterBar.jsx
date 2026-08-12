import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ListFilter, ArrowUpDown, Check, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { theme } from '../../configs/themeConfig';

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return { open, setOpen, ref };
}

const PURPOSE_OPTIONS = [
  { value: 'Service', label: 'Service' },
  { value: 'Sales', label: 'Sales' },
  { value: 'BodyRepair', label: 'Body Repair' },
  { value: 'SparePart', label: 'Spare Part' },
];

const DEFAULT_SORT_OPTIONS = [
  { value: 'default', label: 'Urutan Default' },
  { value: 'booking_asc', label: 'Antrian / Booking (A–Z)' },
  { value: 'booking_desc', label: 'Antrian / Booking (Z–A)' },
  { value: 'customer_asc', label: 'Nama Customer (A–Z)' },
  { value: 'customer_desc', label: 'Nama Customer (Z–A)' },
  { value: 'plate_asc', label: 'Plat Nomor (A–Z)' },
  { value: 'model_asc', label: 'Model Mobil (A–Z)' },
  { value: 'newest', label: 'Waktu Terbaru' },
  { value: 'oldest', label: 'Waktu Terlama' },
];

function DropdownItem({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        width: '100%',
        padding: '0.55rem 0.85rem',
        background: active ? '#f1f5f9' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.8125rem',
        color: active ? '#0f172a' : '#334155',
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? '#f1f5f9' : 'transparent'; }}
    >
      <span>{label}</span>
      {active && <Check size={14} color="#0f172a" style={{ flexShrink: 0 }} />}
    </button>
  );
}

function DropdownPanel({ children, align = 'right' }) {
  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: align === 'right' ? 0 : 'auto',
      left: align === 'left' ? 0 : 'auto',
      zIndex: 300,
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
      padding: '0.5rem',
      minWidth: '220px',
      animation: 'fadeInScale 0.15s ease-out forwards',
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      padding: '0.4rem 0.85rem 0.3rem',
      fontSize: '0.675rem',
      fontWeight: 700,
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    }}>
      {children}
    </div>
  );
}

export default function FilterBar({
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Cari Plat Nomor, Customer, Model...',
  filterPurpose = 'All',
  onPurposeChange,
  filters = [],
  sortOption = 'default',
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  onReset,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const filterDropdown = useDropdown();
  const sortDropdown = useDropdown();

  const activeFiltersCount = (onPurposeChange && filterPurpose !== 'All' ? 1 : 0) +
    filters.filter(f => f.value && f.value !== 'All' && f.value !== '0' && f.value !== 'ALL').length;

  const hasSortActive = onSortChange && sortOption !== 'default';
  const showReset = onReset && (activeFiltersCount > 0 || hasSortActive || searchQuery);

  const showFilter = onPurposeChange || filters.length > 0;
  const showSort = !!onSortChange;

  const currentSortLabel = sortOptions.find(o => o.value === sortOption)?.label || 'Urutkan';
  const currentPurposeLabel = PURPOSE_OPTIONS.find(o => o.value === filterPurpose)?.label;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: '#ffffff',
        padding: '0.5rem 0.65rem',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        flexWrap: 'wrap',
      }}>
        <div style={{
          position: 'relative',
          flex: '1 1 260px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Search
            size={16}
            color={isFocused ? '#0f172a' : '#64748b'}
            style={{
              position: 'absolute',
              left: '0.85rem',
              transition: 'color 0.15s ease',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={searchPlaceholder}
            style={{
              width: '100%',
              padding: searchQuery ? '0.55rem 2.2rem 0.55rem 2.6rem' : '0.55rem 0.85rem 0.55rem 2.6rem',
              border: isFocused ? '1px solid #0f172a' : '1px solid #e2e8f0',
              borderRadius: '9px',
              fontSize: '0.835rem',
              color: '#0f172a',
              fontWeight: 500,
              backgroundColor: isFocused ? '#ffffff' : '#f8fafc',
              boxShadow: isFocused ? '0 0 0 3px rgba(15, 23, 42, 0.08)' : 'none',
              outline: 'none',
              transition: 'all 0.18s ease',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange('')}
              style={{
                position: 'absolute',
                right: '0.65rem',
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
              title="Hapus Pencarian"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {showFilter && (
            <div style={{ position: 'relative' }} ref={filterDropdown.ref}>
              <button
                type="button"
                onClick={() => { filterDropdown.setOpen(o => !o); sortDropdown.setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.85rem',
                  border: activeFiltersCount > 0 ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  borderRadius: '9px',
                  backgroundColor: activeFiltersCount > 0 ? '#0f172a' : '#ffffff',
                  color: activeFiltersCount > 0 ? '#ffffff' : '#334155',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <SlidersHorizontal size={15} color={activeFiltersCount > 0 ? '#ffffff' : '#475569'} />
                <span>Filter</span>
                {activeFiltersCount > 0 && (
                  <span style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    borderRadius: '10px',
                    padding: '1px 6px',
                    marginLeft: '2px',
                  }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {filterDropdown.open && (
                <DropdownPanel align="right">
                  {onPurposeChange && (
                    <>
                      <SectionLabel>Tujuan Kedatangan</SectionLabel>
                      <DropdownItem
                        label="Semua Tujuan"
                        active={filterPurpose === 'All'}
                        onClick={() => { onPurposeChange('All'); filterDropdown.setOpen(false); }}
                      />
                      {PURPOSE_OPTIONS.map(opt => (
                        <DropdownItem
                          key={opt.value}
                          label={opt.label}
                          active={filterPurpose === opt.value}
                          onClick={() => { onPurposeChange(opt.value); filterDropdown.setOpen(false); }}
                        />
                      ))}
                    </>
                  )}

                  {!onPurposeChange && filters.map((flt, idx) => (
                    <div key={idx} style={{ marginBottom: idx < filters.length - 1 ? '0.5rem' : 0 }}>
                      <SectionLabel>{flt.label || 'Filter'}</SectionLabel>
                      {(flt.options || []).map(opt => {
                        const val = typeof opt === 'object' ? opt.value : opt;
                        const lbl = typeof opt === 'object' ? opt.label : opt;
                        return (
                          <DropdownItem
                            key={val}
                            label={lbl}
                            active={flt.value === val}
                            onClick={() => { flt.onChange(val); filterDropdown.setOpen(false); }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </DropdownPanel>
              )}
            </div>
          )}

          {showSort && (
            <div style={{ position: 'relative' }} ref={sortDropdown.ref}>
              <button
                type="button"
                onClick={() => { sortDropdown.setOpen(o => !o); filterDropdown.setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.85rem',
                  border: hasSortActive ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  borderRadius: '9px',
                  backgroundColor: hasSortActive ? '#f1f5f9' : '#ffffff',
                  color: hasSortActive ? '#0f172a' : '#334155',
                  fontSize: '0.8125rem',
                  fontWeight: hasSortActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <ArrowUpDown size={15} color={hasSortActive ? '#0f172a' : '#475569'} />
                <span>{hasSortActive ? currentSortLabel : 'Urutkan'}</span>
              </button>

              {sortDropdown.open && (
                <DropdownPanel align="right">
                  <SectionLabel>Urutkan Berdasarkan</SectionLabel>
                  {sortOptions.map(opt => (
                    <DropdownItem
                      key={opt.value}
                      label={opt.label}
                      active={sortOption === opt.value}
                      onClick={() => { onSortChange(opt.value); sortDropdown.setOpen(false); }}
                    />
                  ))}
                </DropdownPanel>
              )}
            </div>
          )}

          {showReset && (
            <button
              type="button"
              onClick={onReset}
              title="Reset Semua Filter"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 0.85rem',
                border: '1px solid #cbd5e1',
                borderRadius: '9px',
                backgroundColor: '#f8fafc',
                color: '#be123c',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <RotateCcw size={13} color="#be123c" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', paddingLeft: '0.2rem' }}>
          <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>Filter Aktif:</span>
          {onPurposeChange && filterPurpose !== 'All' && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#e2e8f0',
              color: '#0f172a',
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}>
              Tujuan: {currentPurposeLabel}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => onPurposeChange('All')} />
            </span>
          )}
          {filters.map((flt, idx) => {
            if (!flt.value || flt.value === 'All' || flt.value === '0' || flt.value === 'ALL') return null;
            return (
              <span key={idx} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#e2e8f0',
                color: '#0f172a',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                {flt.label}: {flt.value}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => flt.onChange('All')} />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
