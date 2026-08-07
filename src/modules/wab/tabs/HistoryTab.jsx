import React from 'react';

export default function HistoryTab({ historyTickets }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h3 style={{ margin: 0, color: '#0f172a' }}>Riwayat Check-Out Kendaraan</h3>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Kendaraan Keluar: <b>{historyTickets.length}</b></span>
      </div>

      <table className="enterprise-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>No</th>
            <th>Antrian</th>
            <th>No. Polisi</th>
            <th>Model Kendaraan</th>
            <th>Tujuan</th>
            <th>Nama Customer</th>
            <th>Jam Masuk</th>
            <th>Jam Keluar</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {historyTickets.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Belum ada riwayat kendaraan yang check-out.</td>
            </tr>
          ) : (
            historyTickets.map((h, idx) => (
              <tr key={h.ticketId || idx}>
                <td>{idx + 1}</td>
                <td><span className="badge-queue">{h.queueNumber || 'Non-Service'}</span></td>
                <td style={{ color: '#0054a6', fontWeight: 'bold' }}>{h.licensePlate}</td>
                <td>{h.vehicleModel}</td>
                <td>
                  <span className={`badge badge-${(h.arrivalPurpose || 'Service').toLowerCase()}`}>
                    {h.arrivalPurpose || 'Service'}
                  </span>
                </td>
                <td>{h.customerName || '-'}</td>
                <td>{h.checkInTime ? new Date(h.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                <td>{h.checkOutTime ? new Date(h.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#e2e8f0', color: '#475569' }}>
                    ✓ CheckedOut
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
