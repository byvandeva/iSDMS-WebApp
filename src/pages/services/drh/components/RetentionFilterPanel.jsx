import React from 'react';
import { Filter, Search } from 'lucide-react';

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

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="drh-filter-panel">
      <div className="drh-filter-header">
        <Filter size={15} />
        <span>Filter Parameter Retensi Harian</span>
      </div>

      <div className="drh-filter-grid">
        <div className="drh-filter-field">
          <label className="drh-filter-label">Mode</label>
          <div className="drh-toggle-group">
            <button
              type="button"
              className={`drh-toggle-btn ${transOption === '0' ? 'active' : ''}`}
              onClick={() => set('transOption', '0')}
            >
              Reminder
            </button>
            <button
              type="button"
              className={`drh-toggle-btn ${transOption === '1' ? 'active' : ''}`}
              onClick={() => set('transOption', '1')}
            >
              Follow Up
            </button>
          </div>
        </div>

        <div className="drh-filter-field">
          <label className="drh-filter-label">Inquiry PDI &amp; CRO</label>
          <div className="drh-select-row">
            <select
              value={inclPDI}
              onChange={e => set('inclPDI', e.target.value)}
              className="drh-select"
            >
              {PDI_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={inclCRO}
              onChange={e => set('inclCRO', e.target.value)}
              className="drh-select"
            >
              {CRO_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="drh-filter-field">
          <label className="drh-filter-label">Group Job Type</label>
          <select
            value={groupJobType}
            onChange={e => set('groupJobType', e.target.value)}
            className="drh-select"
            style={{ width: '100%' }}
          >
            {JOB_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="drh-filter-field">
          <label className="drh-filter-label">No. Polisi</label>
          <div className="drh-search-input-wrapper">
            <Search size={14} className="drh-search-icon" />
            <input
              type="text"
              placeholder="Cari No. Polisi..."
              value={searchPlate}
              onChange={e => set('searchPlate', e.target.value)}
              className="drh-search-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
