import React, { useState } from 'react';
import { FileText, ShieldCheck, Wrench } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import StatusBadge from '../../../../utility/components/StatusBadge';
import PageHeader from '../../../../navigation/PageHeader';
import FilterBar from '../../../../utility/components/FilterBar';
import Pagination from '../../../../utility/components/Pagination';

const PAGE_SIZE = 10;

export default function HistoryTab({ currentUserRole = 'Admin', tickets = [], historyTickets = [], wabHistory = [], onSelectTicket }) {
  const [roleTab, setRoleTab] = useState(
    currentUserRole === 'Security' ? 'security' :
    currentUserRole === 'ServiceAdvisor' ? 'sa' :
    currentUserRole === 'Foreman' ? 'foreman' : 'security'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const activeRoleTab = currentUserRole === 'Admin' ? roleTab :
    (currentUserRole === 'Security' ? 'security' : currentUserRole === 'ServiceAdvisor' ? 'sa' : 'foreman');

  const filterBySearch = (list) => {
    let res = list;
    if (filterPurpose && filterPurpose !== 'All') {
      res = res.filter(item => {
        const p = String(item.arrivalPurpose || '').toLowerCase();
        return p === filterPurpose.toLowerCase() || (filterPurpose === 'Service' && (p === '0' || p === 'service'));
      });
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      res = res.filter(item =>
        (item.licensePlate || '').toLowerCase().includes(q) ||
        (item.customerName || item.name || '').toLowerCase().includes(q) ||
        (item.vehicleModel || '').toLowerCase().includes(q) ||
        (item.queueNumber || '').toLowerCase().includes(q)
      );
    }
    return [...res].sort((a, b) => {
      if (sortBy === 'plate_asc') return (a.licensePlate || '').localeCompare(b.licensePlate || '');
      if (sortBy === 'model_asc') return (a.vehicleModel || '').localeCompare(b.vehicleModel || '');
      if (sortBy === 'newest') return new Date(b.checkInTime || 0) - new Date(a.checkInTime || 0);
      if (sortBy === 'oldest') return new Date(a.checkInTime || 0) - new Date(b.checkInTime || 0);
      return 0;
    });
  };

  const formatTime = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch { return '-'; }
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch { return '-'; }
  };

  const calculateDuration = (startIso, endIso) => {
    if (!startIso || !endIso) return '-';
    try {
      const diffMs = new Date(endIso) - new Date(startIso);
      if (diffMs <= 0) return '0 mnt';
      const mins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(mins / 60);
      return hrs > 0 ? `${hrs}j ${mins % 60}m` : `${mins} mnt`;
    } catch { return '-'; }
  };

  const securityHistory = filterBySearch(tickets.filter(t => t.status === 'CheckedOut' || t.status === '8'));
  const saHistory = filterBySearch(wabHistory.length > 0 ? wabHistory : tickets.filter(t => t.wabSubmitted || t.status === 'Inspected' || t.status === 'WabDone'));
  const foremanHistory = filterBySearch(tickets.filter(t => ['ServiceCompleted', 'PreHandoverReady', 'HandoverCompleted', 'CheckedOut', '5', '6', '7', '8'].includes(String(t.status))));

  const currentList = activeRoleTab === 'security' ? securityHistory : activeRoleTab === 'sa' ? saHistory : foremanHistory;
  const totalPages = Math.ceil(currentList.length / PAGE_SIZE);
  const paged = currentList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleReset = () => {
    setSearchTerm(''); setFilterPurpose('All'); setSortBy('default'); setCurrentPage(1);
  };
  const handleTabChange = (tab) => { setRoleTab(tab); setCurrentPage(1); };


  const tableCard = {
    background: theme.color.surface,
    borderRadius: theme.radius.sm,
  };

  const tabBtn = (tab) => ({
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.55rem 1.1rem', borderRadius: theme.radius.md, border: 'none',
    backgroundColor: roleTab === tab ? theme.color.primaryDark : theme.color.surfaceAlt,
    color: roleTab === tab ? '#fff' : theme.color.textSecondary,
    fontWeight: 700, fontSize: theme.font.sizeSm, cursor: 'pointer',
  });

  return (
    <div>
      <PageHeader
        title="History Pekerjaan & Bengkel"
      />

      {currentUserRole === 'Admin' && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button type="button" onClick={() => handleTabChange('security')} style={tabBtn('security')}>
            <ShieldCheck size={15} /> Security (Release Out)
          </button>
          <button type="button" onClick={() => handleTabChange('sa')} style={tabBtn('sa')}>
            <FileText size={15} /> SA (Form WAB 5-Step)
          </button>
          <button type="button" onClick={() => handleTabChange('foreman')} style={tabBtn('foreman')}>
            <Wrench size={15} /> Foreman (Selesai Servis)
          </button>
        </div>
      )}

      <FilterBar
        searchQuery={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
        searchPlaceholder="Cari Plat Nomor, Customer, Model, No. Antrian..."
        filterPurpose={filterPurpose}
        onPurposeChange={(v) => { setFilterPurpose(v); setCurrentPage(1); }}
        sortOption={sortBy}
        onSortChange={(v) => { setSortBy(v); setCurrentPage(1); }}
        onReset={handleReset}
      />

      {activeRoleTab === 'security' && (
        <div className="table-responsive-container" style={tableCard}>
          <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>Plat Nomor</th>
                <th>Nama Customer</th>
                <th>No. Telepon</th>
                <th>Model Kendaraan</th>
                <th>Waktu Check-In</th>
                <th>Waktu Check-Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '3rem' }}>Belum ada riwayat rilis keluar gerbang.</td></tr>
              ) : paged.map((h, idx) => (
                <tr key={h.ticketId || idx}>
                  <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td style={{ fontWeight: 'bold', color: theme.color.textPrimary }}>{h.policeRegNo || h.licensePlate}</td>
                  <td>{h.customerName || h.wabCustomerName || '-'}</td>
                  <td>{h.telponNo || h.customerPhone || '-'}</td>
                  <td>{h.groupCode || h.vehicleModel}</td>
                  <td><div>{formatDate(h.checkInTime)}</div><div style={{ color: theme.color.textMuted }}>Jam {formatTime(h.checkInTime)}</div></td>
                  <td><div>{formatDate(h.checkOutTime || new Date().toISOString())}</div><div style={{ color: theme.color.textMuted }}>Jam {formatTime(h.checkOutTime || new Date().toISOString())}</div></td>
                  <td><StatusBadge status="CheckedOut" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={currentList.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
        </div>
      )}

      {activeRoleTab === 'sa' && (
        <div className="table-responsive-container" style={tableCard}>
          <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>No. Antrian</th>
                <th>Plat Nomor</th>
                <th>Nama Customer</th>
                <th>No. Telepon</th>
                <th>Model Kendaraan</th>
                <th>Jam Inspeksi</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '3rem' }}>Belum ada riwayat Form WAB 5-Step disubmit.</td></tr>
              ) : paged.map((t, idx) => (
                <tr key={t.ticketId || idx}>
                  <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td><span className="badge-queue">{t.queueNumber || t.bookingNo || t.sdmsBookingId || 'Non-Q'}</span></td>
                  <td style={{ fontWeight: 'bold', color: theme.color.textPrimary }}>{t.policeRegNo || t.licensePlate}</td>
                  <td>{t.customerName || t.wabCustomerName || '-'}</td>
                  <td>{t.telponNo || t.customerPhone || '-'}</td>
                  <td>{t.groupCode || t.vehicleModel}</td>
                  <td>{formatTime(t.inspectionTime || t.checkInTime)}</td>
                  <td><StatusBadge status="Inspected" /></td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn btn-sm" style={{ backgroundColor: theme.color.dark, color: theme.color.surface, border: 'none' }} onClick={() => onSelectTicket?.(t)}>Lihat WAB</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={currentList.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
        </div>
      )}

      {activeRoleTab === 'foreman' && (
        <div className="table-responsive-container" style={tableCard}>
          <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>No. Antrian</th>
                <th>Plat Nomor</th>
                <th>Nama Customer</th>
                <th>No. Telepon</th>
                <th>Stall Bengkel</th>
                <th>Teknisi</th>
                <th>Waktu Servis</th>
                <th>Durasi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '3rem' }}>Belum ada riwayat pekerjaan servis selesai.</td></tr>
              ) : paged.map((t, idx) => (
                <tr key={t.ticketId || idx}>
                  <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td><span className="badge-queue">{t.queueNumber || t.bookingNo || t.sdmsBookingId || 'Non-Q'}</span></td>
                  <td style={{ fontWeight: 'bold', color: theme.color.textPrimary }}>{t.policeRegNo || t.licensePlate}</td>
                  <td>{t.customerName || t.wabCustomerName || '-'}</td>
                  <td>{t.telponNo || t.customerPhone || '-'}</td>
                  <td><span style={{ fontWeight: 600, color: theme.color.primary }}>{t.stallName || 'Stall 01'}</span></td>
                  <td>{t.technicianName || 'Teknisi 1'}</td>
                  <td>
                    <div>Mulai: {formatTime(t.serviceStartTime || t.checkInTime)}</div>
                    <div style={{ color: theme.color.textMuted }}>Selesai: {formatTime(t.serviceFinishTime || t.inspectionTime)}</div>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{calculateDuration(t.serviceStartTime || t.checkInTime, t.serviceFinishTime || t.inspectionTime)}</td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={currentList.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
