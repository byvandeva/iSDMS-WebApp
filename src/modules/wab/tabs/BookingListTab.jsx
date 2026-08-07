import React, { useState } from 'react';

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#0f172a' }}>List Booking</h3>
        <button className="btn" onClick={onOpenWalkInModal}>
          + Walk-In
        </button>
      </div>

      {/* BOOKING SEARCH BAR */}
      <div style={{ marginBottom: '1.25rem', background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <input
          type="text"
          placeholder="Cari Booking ID, Customer, Plat Nomor, atau Model..."
          value={bookingSearchQuery}
          onChange={e => setBookingSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem 0.85rem',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#0f172a',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <table className="enterprise-table">
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
              <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Tidak ada booking yang cocok dengan kriteria pencarian.</td>
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
                <td style={{ color: '#0f172a', fontWeight: 'bold' }}>{b.licensePlate}</td>
                <td>{b.bookingTime || '09:00'}</td>
                <td>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: '#eff0f1ff',
                    color: '#0f172a',
                    border: '1px solid #eff0f1ff'
                  }}>
                    {b.categoryPassComm || 'Passenger'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn btn-sm btn-secondary" style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none' }} onClick={() => onCheckInFromBooking(b)}>
                    + Check-In
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
