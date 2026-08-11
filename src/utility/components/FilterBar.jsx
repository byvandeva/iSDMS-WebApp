import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { theme } from '../../configs/themeConfig';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Cari Plat Nomor, Customer, Model...',
  filterPurpose,
  onPurposeChange,
  onReset
}) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
        <Search size={16} color={theme.color.textMuted} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.6rem', border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textPrimary, boxSizing: 'border-box', outline: 'none', backgroundColor: theme.color.surface }}
        />
      </div>

      {onPurposeChange && (
        <select
          value={filterPurpose}
          onChange={(e) => onPurposeChange(e.target.value)}
          style={{ padding: '0.65rem 0.85rem', border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textPrimary, backgroundColor: theme.color.surface, outline: 'none' }}
        >
          <option value="All">Semua Tujuan</option>
          <option value="Service">Service</option>
          <option value="Sales">Sales</option>
          <option value="BodyRepair">Body Repair</option>
          <option value="SparePart">Spare Part</option>
        </select>
      )}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 0.85rem', border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, backgroundColor: theme.color.surfaceAlt, color: theme.color.textSecondary, fontSize: theme.font.sizeSm, cursor: 'pointer', fontWeight: 600 }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}
    </div>
  );
}
