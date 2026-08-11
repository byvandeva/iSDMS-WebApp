import React, { useState } from 'react';
import { Calendar, FileText, CheckCircle2, ShieldCheck, Wrench, AlertTriangle, Clock } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import StatusBadge from '../../../../utility/components/StatusBadge';
import PageHeader from '../../../../navigation/PageHeader';
import FilterBar from '../../../../utility/components/FilterBar';

export default function HistoryTab({ currentUserRole = 'Admin', tickets = [], historyTickets = [], wabHistory = [], onSelectTicket }) {
  const [roleTab, setRoleTab] = useState(
    currentUserRole === 'Security' ? 'security' :
    currentUserRole === 'ServiceAdvisor' ? 'sa' :
    currentUserRole === 'Foreman' ? 'foreman' : 'security'
  );

  const [searchTerm, setSearchTerm] = useState('');

  const activeRoleTab = currentUserRole === 'Admin' ? roleTab :
    (currentUserRole === 'Security' ? 'security' :
     currentUserRole === 'ServiceAdvisor' ? 'sa' :
     currentUserRole === 'Foreman' ? 'foreman' : 'security');

  const filterBySearch = (list) => {
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(item =>
      (item.licensePlate || '').toLowerCase().includes(q) ||
      (item.customerName || item.name || '').toLowerCase().includes(q) ||
      (item.vehicleModel || '').toLowerCase().includes(q) ||
      (item.queueNumber || '').toLowerCase().includes(q)
    );
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
      const start = new Date(startIso);
      const end = new Date(endIso);
      const diffMs = end - start;
      if (diffMs <= 0) return '0 mnt';
      const mins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      if (hrs > 0) return `${hrs}j ${remMins}m`;
      return `${mins} mnt`;
    } catch { return '-'; }
  };

  const securityHistory = filterBySearch(
    tickets.filter(t => t.status === 'CheckedOut' || t.status === '8')
  );

  const saHistory = filterBySearch(
    wabHistory.length > 0 ? wabHistory : tickets.filter(t => t.wabSubmitted || t.status === 'Inspected' || t.status === 'WabDone')
  );

  const foremanHistory = filterBySearch(
    tickets.filter(t =>
      t.status === 'ServiceCompleted' ||
      t.status === 'PreHandoverReady' ||
      t.status === 'HandoverCompleted' ||
      t.status === 'CheckedOut' ||
      t.status === '5' || t.status === '6' || t.status === '7' || t.status === '8'
    )
  );

  return (
    <div>
      <PageHeader title="History Pekerjaan & Bengkel" />

      {currentUserRole === 'Admin' && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: `1px solid ${theme.color.borderLight}`, paddingBottom: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setRoleTab('security')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.15rem', borderRadius: '4px', border: 'none',
              backgroundColor: roleTab === 'security' ? theme.color.dark : theme.color.surfaceAlt, color: roleTab === 'security' ? theme.color.surface : theme.color.textSecondary,
              fontWeight: 700, fontSize: theme.font.sizeSm, cursor: 'pointer'
            }}
          >
            <ShieldCheck size={16} /> Security (Release Out)
          </button>

          <button
            type="button"
            onClick={() => setRoleTab('sa')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.15rem', borderRadius: '4px', border: 'none',
              backgroundColor: roleTab === 'sa' ? theme.color.dark : theme.color.surfaceAlt, color: roleTab === 'sa' ? theme.color.surface : theme.color.textSecondary,
              fontWeight: 700, fontSize: theme.font.sizeSm, cursor: 'pointer'
            }}
          >
            <FileText size={16} /> SA (Form WAB 5-Step)
          </button>

          <button
            type="button"
            onClick={() => setRoleTab('foreman')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.15rem', borderRadius: '4px', border: 'none',
              backgroundColor: roleTab === 'foreman' ? theme.color.dark : theme.color.surfaceAlt, color: roleTab === 'foreman' ? theme.color.surface : theme.color.textSecondary,
              fontWeight: 700, fontSize: theme.font.sizeSm, cursor: 'pointer'
            }}
          >
            <Wrench size={16} /> Foreman (Selesai Servis)
          </button>
        </div>
      )}

      <FilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari Plat Nomor, Customer, Model, No. Antrian..."
        onReset={() => setSearchTerm('')}
      />

      {activeRoleTab === 'security' && (
        <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.border}`, borderRadius: 0, overflowX: 'auto' }}>
          <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>Plat Nomor</th>
                <th>Nama Customer</th>
                <th>Model Kendaraan</th>
                <th>Waktu Check-In</th>
                <th>Waktu Check-Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {securityHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '2.5rem' }}>
                    Belum ada riwayat rilis keluar gerbang (Checked-Out).
                  </td>
                </tr>
              ) : (
                securityHistory.map((h, idx) => (
                  <tr key={h.ticketId || idx}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 'bold', color: theme.color.textPrimary }}>{h.licensePlate}</td>
                    <td>{h.customerName || h.wabCustomerName || '-'}</td>
                    <td>{h.vehicleModel}</td>
                    <td>
                      <div>{formatDate(h.checkInTime)}</div>
                      <div style={{ color: theme.color.textMuted }}>Jam {formatTime(h.checkInTime)}</div>
                    </td>
                    <td>
                      <div>{formatDate(h.checkOutTime || new Date().toISOString())}</div>
                      <div style={{ color: theme.color.textMuted }}>Jam {formatTime(h.checkOutTime || new Date().toISOString())}</div>
                    </td>
                    <td>
                      <StatusBadge status="CheckedOut" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeRoleTab === 'sa' && (
        <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.border}`, borderRadius: 0, overflowX: 'auto' }}>
          <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>No. Antrian</th>
                <th>Plat Nomor</th>
                <th>Nama Customer</th>
                <th>Model Kendaraan</th>
                <th>Jam Inspeksi</th>
                <th>Status WAB</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {saHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '2.5rem' }}>
                    Belum ada riwayat Form WAB 5-Step disubmit.
                  </td>
                </tr>
              ) : (
                saHistory.map((t, idx) => (
                  <tr key={t.ticketId || idx}>
                    <td>{idx + 1}</td>
                    <td><span className="badge-queue">{t.queueNumber || 'Non-Q'}</span></td>
                    <td style={{ fontWeight: 'bold', color: theme.color.textPrimary }}>{t.licensePlate}</td>
                    <td>{t.customerName || t.wabCustomerName || '-'}</td>
                    <td>{t.vehicleModel}</td>
                    <td>{formatTime(t.inspectionTime || t.checkInTime)}</td>
                    <td>
                      <StatusBadge status="Inspected" />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: theme.color.dark, color: theme.color.surface, border: 'none' }}
                        onClick={() => onSelectTicket?.(t)}
                      >
                        Lihat WAB
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeRoleTab === 'foreman' && (
        <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.border}`, borderRadius: 0, overflowX: 'auto' }}>
          <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>No. Antrian</th>
                <th>Plat Nomor</th>
                <th>Nama Customer</th>
                <th>Stall Bengkel</th>
                <th>Teknisi</th>
                <th>Waktu Servis</th>
                <th>Durasi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {foremanHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '2.5rem' }}>
                    Belum ada riwayat pekerjaan servis selesai oleh Foreman.
                  </td>
                </tr>
              ) : (
                foremanHistory.map((t, idx) => (
                  <tr key={t.ticketId || idx}>
                    <td>{idx + 1}</td>
                    <td><span className="badge-queue">{t.queueNumber || 'Non-Q'}</span></td>
                    <td style={{ fontWeight: 'bold', color: theme.color.textPrimary }}>{t.licensePlate}</td>
                    <td>{t.customerName || t.wabCustomerName || '-'}</td>
                    <td><span style={{ fontWeight: 600, color: theme.color.primary }}>{t.stallName || 'Stall 01'}</span></td>
                    <td>{t.technicianName || 'Teknisi 1'}</td>
                    <td>
                      <div>Mulai: {formatTime(t.serviceStartTime || t.checkInTime)}</div>
                      <div style={{ color: theme.color.textMuted }}>Selesai: {formatTime(t.serviceFinishTime || t.inspectionTime)}</div>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      {calculateDuration(t.serviceStartTime || t.checkInTime, t.serviceFinishTime || t.inspectionTime)}
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
