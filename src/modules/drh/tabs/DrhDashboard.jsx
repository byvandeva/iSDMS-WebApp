import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

import { useRetentionData } from '../hooks/useRetentionData';
import RetentionSummaryCards from '../components/RetentionSummaryCards';
import RetentionFilterPanel from '../components/RetentionFilterPanel';
import RetentionTable from '../components/RetentionTable';
import RetentionDetailModal from '../components/RetentionDetailModal';

const CATEGORY_TABS = [
  { key: 'ALL', label: 'Semua' },
  { key: 'Unit', label: 'Reminder Unit (<10k KM)' },
  { key: 'Service', label: 'Reminder Servis (10k-20k KM)' },
];

const INITIAL_FILTERS = {
  year: '2026',
  month: '08',
  transOption: '0',
  inclPDI: '0',
  inclCRO: '0',
  groupJobType: 'ALL',
  categoryKM: 'ALL',
  searchPlate: '',
};

/**
 * DRH Dashboard — read-only reporting view for Daily Service Retention.
 * No transactions or mutations here; this page only surfaces data and reports.
 */
export default function DrhDashboard() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);

  const { filteredList, summary, isLoading } = useRetentionData(filters);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleExportExcel = () => {
    showToast(`Laporan DRH ${filters.year}/${filters.month} sedang disiapkan…`);
    // TODO: trigger GET /api/drh/export?year=...&month=...
  };

  return (
    <div className="drh-dashboard">
      {/* Toast notification */}
      {toast && (
        <div className="drh-toast">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Page header */}
      <div className="drh-page-header">
        <h2 className="drh-page-title">Daily Service Retention</h2>
        <button type="button" className="drh-export-btn" onClick={handleExportExcel}>
          <Download size={14} />
          <span>Generate Excel</span>
        </button>
      </div>

      {/* Filter panel */}
      <RetentionFilterPanel filters={filters} onChange={setFilters} />

      {/* Summary metric cards */}
      <RetentionSummaryCards summary={summary} />

      {/* Category tab bar */}
      <div className="drh-category-bar">
        <div className="drh-tab-group">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`drh-tab-btn ${filters.categoryKM === tab.key ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, categoryKM: tab.key }))}
            >
              {tab.label}
              {tab.key === 'ALL' && ` (${summary.total})`}
              {tab.key === 'Unit' && ` · ${summary.unitCount}`}
              {tab.key === 'Service' && ` · ${summary.serviceCount}`}
            </button>
          ))}
        </div>
        <span className="drh-result-count">
          Menampilkan <b>{filteredList.length}</b> unit
        </span>
      </div>

      {/* Data table */}
      {isLoading ? (
        <div className="drh-loading">Memuat data retensi…</div>
      ) : (
        <RetentionTable data={filteredList} onRowClick={setSelectedItem} />
      )}

      {/* Read-only detail modal */}
      {selectedItem && (
        <RetentionDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
