import React, { useState } from 'react';
import { Clock, Wrench } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import StatusBadge from '../../../../utility/components/StatusBadge';
import PageHeader from '../../../../navigation/PageHeader';
import FilterBar from '../../../../utility/components/FilterBar';

export default function ForemanHistoryTab({ tickets, onSelectTicket }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stallFilter, setStallFilter] = useState('ALL');

  const historyTickets = tickets.filter(t =>
    t.status === 'ServiceCompleted' ||
    t.status === 'PreHandoverReady' ||
    t.status === 'HandoverCompleted' ||
    t.status === 'CheckedOut' ||
    t.status === '5' || t.status === '6' || t.status === '7' || t.status === '8'
  );

  const filteredTickets = historyTickets.filter(t => {
    const matchesSearch = !searchTerm.trim() ||
      (t.licensePlate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.customerName || t.wabCustomerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.vehicleModel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.queueNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStall = stallFilter === 'ALL' || (t.stallName || 'Stall 01') === stallFilter;

    return matchesSearch && matchesStall;
  });

  const formatTime = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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

  return (
    <div>
      <PageHeader title="Riwayat Pekerjaan Foreman" />

      <FilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari Plat Nomor, Customer, Model, No. Antrian..."
        onReset={() => { setSearchTerm(''); setStallFilter('ALL'); }}
      />

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
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '2.5rem' }}>
                  Belum ada riwayat pekerjaan servis selesai.
                </td>
              </tr>
            ) : (
              filteredTickets.map((t, idx) => (
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
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: theme.color.dark, color: theme.color.surface, border: 'none' }}
                      onClick={() => onSelectTicket?.(t)}
                    >
                      Detail WAB
                    </button>
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
