import React, { useState } from 'react';
import { theme } from '../../../../configs/themeConfig';
import StatusBadge from '../../../../utility/components/StatusBadge';
import PageHeader from '../../../../navigation/PageHeader';
import FilterBar from '../../../../utility/components/FilterBar';
import { interleavePriorityQueue } from '../../../../utility/services/queuePriority';

const PURPOSE_OPTIONS = [
  { value: 'All', label: 'Semua Tujuan' },
  { value: 'Service', label: 'Service' },
  { value: 'Sales', label: 'Sales' },
  { value: 'BodyRepair', label: 'Body Repair' },
  { value: 'SparePart', label: 'Spare Part' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'plate', label: 'Plat Nomor (A-Z)' },
  { value: 'queue', label: 'No. Antrian' },
];

export default function GuestListTab({
  tickets,
  currentUserRole,
  onOpenWalkInModal,
  getPurposeString,
  getStatusString,
  onStartWab,
  onOpenEditModal,
  onOpenCheckOutModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const baseFiltered = tickets
    .filter(t => t.status !== 'CheckedOut')
    .filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const plateMatch = (t.licensePlate || '').toLowerCase().includes(q);
      const modelMatch = (t.vehicleModel || '').toLowerCase().includes(q);
      const custMatch = (t.customerName || '').toLowerCase().includes(q);
      const queueMatch = (t.queueNumber || '').toLowerCase().includes(q);
      const matchesSearch = !q || plateMatch || modelMatch || custMatch || queueMatch;

      const purposeStr = getPurposeString(t.arrivalPurpose);
      const matchesPurpose = filterPurpose === 'All' || purposeStr.toLowerCase() === filterPurpose.toLowerCase();

      return matchesSearch && matchesPurpose;
    });

  let processedTickets = [];
  if (sortBy === 'default' || sortBy === 'priority') {
    processedTickets = interleavePriorityQueue(baseFiltered);
  } else {
    processedTickets = [...baseFiltered].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.checkInTime || b.createdAt || 0) - new Date(a.checkInTime || a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.checkInTime || a.createdAt || 0) - new Date(b.checkInTime || b.createdAt || 0);
      if (sortBy === 'plate') return (a.licensePlate || '').localeCompare(b.licensePlate || '');
      if (sortBy === 'queue') return (a.queueNumber || '').localeCompare(b.queueNumber || '');
      return 0;
    });
  }

  const tableCardStyle = {
    width: '100%',
    overflowX: 'auto',
    background: theme.color.surface,
    border: `1px solid ${theme.color.border}`,
    borderRadius: 0,
  };

  const resolveTicketStatusForBadge = (t) => {
    if (t.status === 'Inspected' || t.status === 'WabDone' || t.status === 1 || t.status === '1' || t.wabSubmitted) return 'Inspected';
    if (t.status === 'WabInProgress' || t.status === 'InProgress' || t.status === 'In Progress') return 'WabInProgress';
    if (getStatusString && (typeof t.status === 'number' || !isNaN(Number(t.status)))) {
      return getStatusString(t.status);
    }
    return t.status;
  };

  return (
    <div>
      <PageHeader
        title="Daftar Tamu"
        action={
          (currentUserRole === 'Security' || currentUserRole === 'Admin') && (
            <button className="btn" onClick={onOpenWalkInModal}>
              + Walk-In
            </button>
          )
        }
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari Plat Nomor, Model, Customer, atau Antrian..."
        filters={[
          { id: 'purpose', label: 'Tujuan', value: filterPurpose, onChange: setFilterPurpose, options: PURPOSE_OPTIONS }
        ]}
        sortOption={sortBy}
        onSortChange={setSortBy}
        sortOptions={SORT_OPTIONS}
        onReset={() => { setSearchQuery(''); setFilterPurpose('All'); setSortBy('default'); }}
      />

      <div style={tableCardStyle}>
        <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No</th>
              <th>No. Antrian</th>
              <th>No. Polisi</th>
              <th>Model Kendaraan</th>
              <th>Tujuan</th>
              <th>Nama Customer</th>
              <th>Status</th>
              <th>Jam Masuk</th>
              <th style={{ textAlign: 'center', minWidth: '200px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {processedTickets.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '2rem' }}>
                  Tidak ada tamu yang cocok dengan kriteria pencarian/filter.
                </td>
              </tr>
            ) : (
              processedTickets.map((t, idx) => (
                <tr key={t.ticketId || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {t.queueNumber ? (
                      <span className="badge-queue">{t.queueNumber}</span>
                    ) : (
                      <span style={{ color: theme.color.textMuted }}>-</span>
                    )}
                  </td>
                  <td style={{ color: theme.color.textPrimary, fontWeight: 'bold' }}>{t.licensePlate}</td>
                  <td>{t.vehicleModel}</td>
                  <td>
                    <span className={`badge badge-${getPurposeString(t.arrivalPurpose).toLowerCase()}`}>
                      {getPurposeString(t.arrivalPurpose)}
                    </span>
                  </td>
                  <td>{t.customerName || '-'}</td>
                  <td>
                    <StatusBadge status={resolveTicketStatusForBadge(t)} />
                  </td>
                  <td>{t.checkInTime ? new Date(t.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
                      {(currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (() => {
                        const isService = getPurposeString(t.arrivalPurpose).toLowerCase() === 'service';
                        if (!isService) {
                          return (
                            <button className="btn btn-sm btn-secondary" style={{ cursor: 'not-allowed', opacity: 0.5 }} disabled title="Hanya tujuan Service yang dapat mengisi WAB">
                              Off
                            </button>
                          );
                        }
                        const isWabDone = t.status === 'Inspected' || t.status === 'WabDone' || t.wabSubmitted;
                        const isWabInProgress = t.status === 'WabInProgress' || t.status === 'InProgress' || t.status === 'In Progress';

                        if (isWabDone) {
                          return (
                            <button className="btn btn-sm" style={{ backgroundColor: theme.color.dark, borderColor: theme.color.dark, color: theme.color.surface }} onClick={() => onStartWab(t)}>
                              Lihat WAB
                            </button>
                          );
                        }
                        return (
                          <button className="btn btn-sm" style={{ backgroundColor: theme.color.primary, borderColor: theme.color.primary, color: theme.color.surface }} onClick={() => onStartWab(t)}>
                            {isWabInProgress ? 'Lanjutkan WAB' : 'Mulai WAB'}
                          </button>
                        );
                      })()}

                      {(currentUserRole === 'Security' || currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (
                        <button className="btn btn-sm btn-secondary" title="Edit Data Kendaraan & Tujuan" onClick={() => onOpenEditModal(t)}>
                          Edit
                        </button>
                      )}

                      {(currentUserRole === 'Security' || currentUserRole === 'Admin') && (
                        t.status !== 'CheckedOut' ? (
                          <button className="btn btn-sm btn-secondary" style={{ backgroundColor: theme.color.dark, color: theme.color.surface, border: 'none' }} title="Check-Out Gerbang" onClick={() => onOpenCheckOutModal(t)}>
                            Check-Out
                          </button>
                        ) : (
                          <span style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, fontWeight: 600 }}>Out</span>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
