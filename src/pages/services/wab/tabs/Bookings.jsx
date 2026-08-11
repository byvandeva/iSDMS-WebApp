import React, { useState } from 'react';
import { theme } from '../../../../configs/themeConfig';
import PageHeader from '../../../../navigation/PageHeader';
import FilterBar from '../../../../utility/components/FilterBar';

export default function BookingListTab({ bookings, onOpenWalkInModal, onCheckInFromBooking, getPurposeString }) {
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');

  const filteredBookings = bookings.filter(b => {
    const q = bookingSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const plateMatch = (b.licensePlate || '').toLowerCase().includes(q);
    const modelMatch = (b.vehicleModel || '').toLowerCase().includes(q);
    const custMatch = (b.customerName || '').toLowerCase().includes(q);
    const idMatch = (b.sdmsBookingId || '').toLowerCase().includes(q);
    return plateMatch || modelMatch || custMatch || idMatch;
  });

  const tableCardStyle = {
    width: '100%',
    overflowX: 'auto',
    background: theme.color.surface,
    border: `1px solid ${theme.color.border}`,
    borderRadius: 0,
  };

  return (
    <div>
      <PageHeader
        title="List Booking SDMS"
        action={
          <button className="btn" onClick={onOpenWalkInModal}>
            + Walk-In
          </button>
        }
      />

      <FilterBar
        searchQuery={bookingSearchQuery}
        onSearchChange={setBookingSearchQuery}
        searchPlaceholder="Cari Booking ID, Customer, Plat Nomor, atau Model..."
        onReset={() => setBookingSearchQuery('')}
      />

      <div style={tableCardStyle}>
        <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No</th>
              <th>Antrian Booking</th>
              <th>Nama Customer</th>
              <th>Tujuan</th>
              <th>No. Polisi</th>
              <th>Waktu Booking</th>
              <th>Kategori Pass-Comm</th>
              <th style={{ textAlign: 'center' }}>Aksi Check-In</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '2rem' }}>Tidak ada booking yang cocok dengan kriteria pencarian.</td>
              </tr>
            ) : (
              filteredBookings.map((b, idx) => (
                <tr key={b.sdmsBookingId}>
                  <td>{idx + 1}</td>
                  <td><span className="badge-queue">{b.sdmsBookingId}</span></td>
                  <td style={{ fontWeight: 'bold' }}>{b.customerName}</td>
                  <td>
                    <span className={`badge badge-${getPurposeString(b.arrivalPurpose).toLowerCase()}`}>
                      {getPurposeString(b.arrivalPurpose)}
                    </span>
                  </td>
                  <td style={{ color: theme.color.textPrimary, fontWeight: 'bold' }}>{b.licensePlate}</td>
                  <td>{b.bookingTime || '09:00'}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: theme.radius.sm,
                      fontSize: theme.font.sizeXs,
                      fontWeight: 600,
                      background: theme.color.surfaceAlt,
                      color: theme.color.textPrimary,
                      border: `1px solid ${theme.color.border}`,
                    }}>
                      {b.categoryPassComm || 'Passenger'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ backgroundColor: theme.color.dark, color: theme.color.surface, border: 'none' }}
                      onClick={() => onCheckInFromBooking(b)}
                    >
                      + Check-In
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
