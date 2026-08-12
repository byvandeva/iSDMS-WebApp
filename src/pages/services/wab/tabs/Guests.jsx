import React, { useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import StatusBadge from '../../../../utility/components/StatusBadge';
import PageHeader from '../../../../navigation/PageHeader';
import FilterBar from '../../../../utility/components/FilterBar';
import Pagination from '../../../../utility/components/Pagination';
import { interleavePriorityQueue } from '../../../../utility/services/queuePriority';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default (Prioritas)' },
  { value: 'queue_asc', label: 'No. Antrian (A-Z)' },
  { value: 'queue_desc', label: 'No. Antrian (Z-A)' },
  { value: 'customer_asc', label: 'Nama Customer (A-Z)' },
  { value: 'customer_desc', label: 'Nama Customer (Z-A)' },
  { value: 'plate_asc', label: 'Plat Nomor (A-Z)' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
];

const PAGE_SIZE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);

  const active = tickets.filter(t => t.status !== 'CheckedOut');

  const baseFiltered = active.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (t.licensePlate || '').toLowerCase().includes(q) ||
      (t.vehicleModel || '').toLowerCase().includes(q) ||
      (t.customerName || '').toLowerCase().includes(q) ||
      (t.queueNumber || '').toLowerCase().includes(q)
    );
    const purposeStr = getPurposeString(t.arrivalPurpose);
    const matchesPurpose = filterPurpose === 'All' || purposeStr.toLowerCase() === filterPurpose.toLowerCase();
    return matchesSearch && matchesPurpose;
  });

  const handleSortToggle = (col) => {
    if (col === 'queue') {
      setSortBy(prev => prev === 'queue_asc' ? 'queue_desc' : 'queue_asc');
    } else if (col === 'customer') {
      setSortBy(prev => prev === 'customer_asc' ? 'customer_desc' : 'customer_asc');
    } else if (col === 'plate') {
      setSortBy(prev => prev === 'plate_asc' ? 'plate_desc' : 'plate_asc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (col) => {
    if (col === 'queue') {
      if (sortBy === 'queue_asc') return <ChevronUp size={13} color={theme.color.primaryDark} />;
      if (sortBy === 'queue_desc') return <ChevronDown size={13} color={theme.color.primaryDark} />;
    } else if (col === 'customer') {
      if (sortBy === 'customer_asc') return <ChevronUp size={13} color={theme.color.primaryDark} />;
      if (sortBy === 'customer_desc') return <ChevronDown size={13} color={theme.color.primaryDark} />;
    } else if (col === 'plate') {
      if (sortBy === 'plate_asc') return <ChevronUp size={13} color={theme.color.primaryDark} />;
      if (sortBy === 'plate_desc') return <ChevronDown size={13} color={theme.color.primaryDark} />;
    }
    return <ArrowUpDown size={12} color="#94a3b8" />;
  };

  let processedTickets = [];
  if (sortBy === 'default' || sortBy === 'priority') {
    processedTickets = interleavePriorityQueue(baseFiltered);
  } else {
    processedTickets = [...baseFiltered].sort((a, b) => {
      if (sortBy === 'queue_asc' || sortBy === 'queue') return (a.queueNumber || '').localeCompare(b.queueNumber || '', undefined, { numeric: true });
      if (sortBy === 'queue_desc') return (b.queueNumber || '').localeCompare(a.queueNumber || '', undefined, { numeric: true });
      if (sortBy === 'customer_asc') return (a.customerName || '').localeCompare(b.customerName || '');
      if (sortBy === 'customer_desc') return (b.customerName || '').localeCompare(a.customerName || '');
      if (sortBy === 'plate_asc' || sortBy === 'plate') return (a.licensePlate || '').localeCompare(b.licensePlate || '');
      if (sortBy === 'plate_desc') return (b.licensePlate || '').localeCompare(a.licensePlate || '');
      if (sortBy === 'newest') return new Date(b.checkInTime || b.createdAt || 0) - new Date(a.checkInTime || a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.checkInTime || a.createdAt || 0) - new Date(b.checkInTime || b.createdAt || 0);
      return 0;
    });
  }

  const totalPages = Math.ceil(processedTickets.length / PAGE_SIZE);
  const paged = processedTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleReset = () => {
    setSearchQuery('');
    setFilterPurpose('All');
    setSortBy('default');
    setCurrentPage(1);
  };

  const resolveTicketStatusForBadge = (t) => {
    if (!t || !t.status) return 'Check-In';
    if (t.status === 'Inspected' || t.status === 'WabDone') return 'Inspected';
    if (t.status === 'WabInProgress' || t.status === 'InProgress' || t.status === 'In Progress') return 'WabInProgress';
    return t.status;
  };

  const thSortStyle = {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.15s',
  };

  return (
    <div>
      <PageHeader
        title="Daftar Tamu"
        action={
          (currentUserRole === 'Security' || currentUserRole === 'Admin') && (
            <button className="btn" onClick={onOpenWalkInModal}>+ Walk-In</button>
          )
        }
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
        searchPlaceholder="Cari Plat Nomor, Model, Customer, atau Antrian..."
        onPurposeChange={(v) => { setFilterPurpose(v); setCurrentPage(1); }}
        filterPurpose={filterPurpose}
        sortOption={sortBy}
        onSortChange={(v) => { setSortBy(v); setCurrentPage(1); }}
        sortOptions={SORT_OPTIONS}
        onReset={handleReset}
      />

      <div className="table-responsive-container" style={{
        background: theme.color.surface,
        borderRadius: theme.radius.sm,
      }}>
        <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No</th>
              <th style={thSortStyle} onClick={() => handleSortToggle('queue')}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  No. Antrian {renderSortIcon('queue')}
                </div>
              </th>
              <th style={thSortStyle} onClick={() => handleSortToggle('plate')}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  No. Polisi {renderSortIcon('plate')}
                </div>
              </th>
              <th>Waktu Booking</th>
              <th>Waktu Check-In</th>
              <th>Tujuan</th>
              <th>Tipe Kendaraan</th>
              <th>Status</th>
              <th style={{ textAlign: 'center', minWidth: '280px', width: '280px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '3rem 2rem' }}>
                  Tidak ada tamu yang cocok dengan kriteria pencarian/filter.
                </td>
              </tr>
            ) : (
              paged.map((t, idx) => (
                <tr key={t.ticketId || idx}>
                  <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>
                    {(t.queueNumber || t.bookingNo || t.sdmsBookingId)
                      ? <span className="badge-queue">{t.queueNumber || t.bookingNo || t.sdmsBookingId}</span>
                      : <span style={{ color: theme.color.textMuted }}>-</span>}
                  </td>
                  <td style={{ color: theme.color.textPrimary, fontWeight: 'bold' }}>{t.policeRegNo || t.licensePlate}</td>
                  <td>{t.reservasiTime || t.bookingTime || '-'}</td>
                  <td>{t.checkInTime ? new Date(t.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td>
                    <span className={`badge badge-${getPurposeString(t.arrivalPurpose).toLowerCase()}`}>
                      {getPurposeString(t.arrivalPurpose)}
                    </span>
                  </td>
                  <td>{t.groupCode || t.vehicleModel}</td>
                  <td><StatusBadge status={resolveTicketStatusForBadge(t)} /></td>
                  <td style={{ textAlign: 'center', minWidth: '280px', width: '280px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                      {(currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (() => {
                        const isService = getPurposeString(t.arrivalPurpose).toLowerCase() === 'service';
                        if (!isService) return (
                          <button className="btn btn-sm btn-secondary" style={{ cursor: 'not-allowed', opacity: 0.5 }} disabled title="Hanya tujuan Service yang dapat mengisi WAB">Off</button>
                        );
                        const statusStr = String(t.status || '');
                        const isWabDone = Boolean(t.wabSubmitted) || ['Inspected', 'WabDone', '1', 'AssignedToStall', '2', 'InService', '3', 'PendingAdditionalApproval', '4', 'ServiceCompleted', '5', 'PreHandoverReady', '6', 'HandoverCompleted', '7', 'CheckedOut', '8'].includes(statusStr);
                        const isWabInProgress = statusStr === 'WabInProgress' || statusStr === 'InProgress' || statusStr === 'In Progress';
                        return isWabDone
                          ? <button className="btn btn-sm" style={{ backgroundColor: theme.color.dark, borderColor: theme.color.dark, color: theme.color.surface }} onClick={() => onStartWab(t)}>Lihat</button>
                          : <button className="btn btn-sm" style={{ backgroundColor: theme.color.primary, borderColor: theme.color.primary, color: theme.color.surface }} onClick={() => onStartWab(t)}>{isWabInProgress ? 'Lanjutkan' : 'Mulai'}</button>;
                      })()}

                      {(currentUserRole === 'Security' || currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (
                        <button className="btn btn-sm btn-secondary" title="Edit Data" onClick={() => onOpenEditModal(t)}>Edit</button>
                      )}

                      {(currentUserRole === 'Security' || currentUserRole === 'Admin') && (
                        t.status !== 'CheckedOut'
                          ? <button className="btn btn-sm btn-secondary" style={{ backgroundColor: theme.color.dark, color: theme.color.surface, border: 'none' }} onClick={() => onOpenCheckOutModal(t)}>Check-Out</button>
                          : <span style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, fontWeight: 600 }}>Out</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={processedTickets.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
