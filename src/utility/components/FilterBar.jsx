import React, { useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, ListFilter, ArrowUpDown, Check } from 'lucide-react';
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
  { value: 'booking_asc', label: 'Booking / Antrian (A–Z)' },
  { value: 'booking_desc', label: 'Booking / Antrian (Z–A)' },
  { value: 'customer_asc', label: 'Nama Customer (A–Z)' },
  { value: 'customer_desc', label: 'Nama Customer (Z–A)' },
  { value: 'plate_asc', label: 'Plat Nomor (A–Z)' },
  { value: 'model_asc', label: 'Model Mobil (A–Z)' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
];

function DropdownItem({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '0.55rem 0.85rem',
        background: active ? '#eff6ff' : 'transparent',
        border: 'none', borderRadius: theme.radius.md,
        fontSize: theme.font.sizeSm,
        color: active ? theme.color.primary : theme.color.textPrimary,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer', textAlign: 'left',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = theme.color.surfaceAlt; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? '#eff6ff' : 'transparent'; }}
    >
      {label}
      {active && <Check size={14} color={theme.color.primary} />}
    </button>
  );
}

function DropdownPanel({ children }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200,
      background: theme.color.surface,
      border: `1px solid ${theme.color.border}`,
      borderRadius: theme.radius.lg,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      padding: '0.5rem',
      minWidth: '210px',
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      padding: '0.3rem 0.85rem 0.4rem',
      fontSize: '0.68rem', fontWeight: 700,
      color: theme.color.textMuted,
      textTransform: 'uppercase', letterSpacing: '0.07em',
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
  const filterDropdown = useDropdown();
  const sortDropdown = useDropdown();

  const hasFilterActive = (onPurposeChange && filterPurpose !== 'All') ||
    filters.some(f => f.value !== 'All');
  const hasSortActive = onSortChange && sortOption !== 'default';
  const showReset = onReset && (hasFilterActive || hasSortActive || searchQuery);

  const showFilter = onPurposeChange || filters.length > 0;
  const showSort = !!onSortChange;

  const iconBtn = (active) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '36px', height: '36px',
    border: `1px solid ${active ? theme.color.primaryDark : theme.color.border}`,
    borderRadius: theme.radius.md,
    backgroundColor: active ? theme.color.primaryDark : theme.color.surface,
    color: active ? '#ffffff' : theme.color.textSecondary,
    cursor: 'pointer', flexShrink: 0,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>

      {/* Search */}
      <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
        <Search size={16} color={theme.color.textMuted} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          style={{
            width: '100%', padding: '0.6rem 0.85rem 0.6rem 2.6rem',
            border: `1px solid ${theme.color.border}`,
            borderRadius: theme.radius.md,
            fontSize: theme.font.sizeSm, color: theme.color.textPrimary,
            boxSizing: 'border-box', outline: 'none',
            backgroundColor: theme.color.surface,
          }}
        />
      </div>

      {/* FILTER ICON BUTTON */}
      {showFilter && (
        <div style={{ position: 'relative' }} ref={filterDropdown.ref}>
          <button
            type="button"
            title="Filter"
            onClick={() => { filterDropdown.setOpen(o => !o); sortDropdown.setOpen(false); }}
            style={iconBtn(hasFilterActive)}
          >
            <ListFilter size={16} />
          </button>

          {filterDropdown.open && (
            <DropdownPanel>
              <SectionLabel>Tujuan Kedatangan</SectionLabel>
              {onPurposeChange && PURPOSE_OPTIONS.map(opt => (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  active={filterPurpose === opt.value}
                  onClick={() => onPurposeChange(opt.value)}
                />
              ))}
              {!onPurposeChange && filters.map((flt, idx) => (
                <div key={idx}>
                  <SectionLabel>{flt.label || 'Filter'}</SectionLabel>
                  {(flt.options || []).map(opt => (
                    <DropdownItem
                      key={opt.value || opt}
                      label={opt.label || opt}
                      active={flt.value === (opt.value || opt)}
                      onClick={() => flt.onChange(opt.value || opt)}
                    />
                  ))}
                </div>
              ))}
            </DropdownPanel>
          )}
        </div>
      )}

      {/* SORT ICON BUTTON */}
      {showSort && (
        <div style={{ position: 'relative' }} ref={sortDropdown.ref}>
          <button
            type="button"
            title="Urutkan"
            onClick={() => { sortDropdown.setOpen(o => !o); filterDropdown.setOpen(false); }}
            style={iconBtn(hasSortActive)}
          >
            <ArrowUpDown size={16} />
          </button>

          {sortDropdown.open && (
            <DropdownPanel>
              <SectionLabel>Urutkan</SectionLabel>
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

      {/* RESET — paling kanan, muncul hanya kalau ada aktif */}
      {showReset && (
        <button
          type="button"
          onClick={onReset}
          title="Reset Filter & Sort"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0 0.75rem', height: '36px',
            border: `1px solid ${theme.color.border}`,
            borderRadius: theme.radius.md,
            backgroundColor: theme.color.surfaceAlt,
            color: theme.color.textSecondary,
            fontSize: theme.font.sizeSm, cursor: 'pointer', fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      )}
    </div>
  );
}
