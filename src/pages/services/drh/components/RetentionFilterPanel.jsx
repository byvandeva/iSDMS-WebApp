import React, { useState } from 'react';
import { SlidersHorizontal, Search, X, RotateCcw } from 'lucide-react';

const JOB_TYPE_OPTIONS = [
  { value: 'ALL', label: 'Semua Job Type' },
  { value: 'EXPRESS', label: 'Express Maintenance' },
  { value: 'REGULER', label: 'Reguler Service' },
];

const PDI_OPTIONS = [
  { value: '0', label: 'Exclude PDI' },
  { value: '1', label: 'Include PDI' },
];

const CRO_OPTIONS = [
  { value: '0', label: 'CRO: Tidak' },
  { value: '1', label: 'CRO: Ya' },
];

export default function RetentionFilterPanel({ filters, onChange }) {
  const { transOption, inclPDI, inclCRO, groupJobType, searchPlate } = filters;
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const set = (key, value) => onChange({ ...filters, [key]: value });

  const hasActiveFilters = transOption !== '0' || inclPDI !== '0' || inclCRO !== '0' || groupJobType !== 'ALL' || !!searchPlate;

  const handleReset = () => {
    onChange({
      ...filters,
      transOption: '0',
      inclPDI: '0',
      inclCRO: '0',
      groupJobType: 'ALL',
      searchPlate: '',
    });
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      padding: '1.15rem 1.25rem',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
          <SlidersHorizontal size={16} color="#0f172a" />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '-0.2px' }}>
            Filter Parameter Retensi Harian
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#be123c',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={12} color="#be123c" />
            Reset Filter
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        alignItems: 'end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Mode Retensi
          </label>
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '9px',
            border: '1px solid #e2e8f0',
          }}>
            <button
              type="button"
              onClick={() => set('transOption', '0')}
              style={{
                flex: 1,
                padding: '0.45rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: transOption === '0' ? 700 : 500,
                color: transOption === '0' ? '#0f172a' : '#64748b',
                background: transOption === '0' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '7px',
                boxShadow: transOption === '0' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Reminder
            </button>
            <button
              type="button"
              onClick={() => set('transOption', '1')}
              style={{
                flex: 1,
                padding: '0.45rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: transOption === '1' ? 700 : 500,
                color: transOption === '1' ? '#0f172a' : '#64748b',
                background: transOption === '1' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '7px',
                boxShadow: transOption === '1' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Follow Up
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Inquiry PDI &amp; CRO
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <select
              value={inclPDI}
              onChange={e => set('inclPDI', e.target.value)}
              style={{
                padding: '0.5rem 0.65rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#0f172a',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '9px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {PDI_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              value={inclCRO}
              onChange={e => set('inclCRO', e.target.value)}
              style={{
                padding: '0.5rem 0.65rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#0f172a',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '9px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {CRO_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Group Job Type
          </label>
          <select
            value={groupJobType}
            onChange={e => set('groupJobType', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.65rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#0f172a',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '9px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {JOB_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Cari No. Polisi
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={15}
              color={isSearchFocused ? '#0f172a' : '#64748b'}
              style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Cari Plat Nomor..."
              value={searchPlate}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={e => set('searchPlate', e.target.value)}
              style={{
                width: '100%',
                padding: searchPlate ? '0.5rem 2rem 0.5rem 2.4rem' : '0.5rem 0.65rem 0.5rem 2.4rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#0f172a',
                background: isSearchFocused ? '#ffffff' : '#f8fafc',
                border: isSearchFocused ? '1px solid #0f172a' : '1px solid #cbd5e1',
                boxShadow: isSearchFocused ? '0 0 0 3px rgba(15, 23, 42, 0.08)' : 'none',
                borderRadius: '9px',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            />
            {searchPlate && (
              <button
                type="button"
                onClick={() => set('searchPlate', '')}
                style={{
                  position: 'absolute',
                  right: '0.6rem',
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                }}
                title="Hapus pencarian"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
