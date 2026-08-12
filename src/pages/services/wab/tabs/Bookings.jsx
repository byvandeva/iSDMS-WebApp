import React, { useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import PageHeader from '../../../../navigation/PageHeader';
import FilterBar from '../../../../utility/components/FilterBar';
import Pagination from '../../../../utility/components/Pagination';

const PAGE_SIZE = 10;

export default function BookingListTab({ bookings, onOpenWalkInModal, onCheckInFromBooking, getPurposeString }) {
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSortToggle = (col) => {
    if (col === 'booking') {
      setSortBy(prev => prev === 'booking_asc' ? 'booking_desc' : 'booking_asc');
    } else if (col === 'customer') {
      setSortBy(prev => prev === 'customer_asc' ? 'customer_desc' : 'customer_asc');
    } else if (col === 'plate') {
      setSortBy(prev => prev === 'plate_asc' ? 'plate_desc' : 'plate_asc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (col) => {
    if (col === 'booking') {
      if (sortBy === 'booking_asc') return <ChevronUp size={13} color={theme.color.primaryDark} />;
      if (sortBy === 'booking_desc') return <ChevronDown size={13} color={theme.color.primaryDark} />;
    } else if (col === 'customer') {
      if (sortBy === 'customer_asc') return <ChevronUp size={13} color={theme.color.primaryDark} />;
      if (sortBy === 'customer_desc') return <ChevronDown size={13} color={theme.color.primaryDark} />;
    } else if (col === 'plate') {
      if (sortBy === 'plate_asc') return <ChevronUp size={13} color={theme.color.primaryDark} />;
      if (sortBy === 'plate_desc') return <ChevronDown size={13} color={theme.color.primaryDark} />;
    }
    return <ArrowUpDown size={12} color="#94a3b8" />;
  };

  const filteredBookings = bookings
    .filter(b => {
      const q = bookingSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        (b.licensePlate || '').toLowerCase().includes(q) ||
        (b.vehicleModel || '').toLowerCase().includes(q) ||
        (b.customerName || '').toLowerCase().includes(q) ||
        (b.sdmsBookingId || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'booking_asc') return (a.sdmsBookingId || '').localeCompare(b.sdmsBookingId || '', undefined, { numeric: true });
      if (sortBy === 'booking_desc') return (b.sdmsBookingId || '').localeCompare(a.sdmsBookingId || '', undefined, { numeric: true });
      if (sortBy === 'customer_asc') return (a.customerName || '').localeCompare(b.customerName || '');
      if (sortBy === 'customer_desc') return (b.customerName || '').localeCompare(a.customerName || '');
      if (sortBy === 'plate_asc') return (a.licensePlate || '').localeCompare(b.licensePlate || '');
      if (sortBy === 'plate_desc') return (b.licensePlate || '').localeCompare(a.licensePlate || '');
      if (sortBy === 'model_asc') return (a.vehicleModel || '').localeCompare(b.vehicleModel || '');
      if (sortBy === 'newest') return (b.sdmsBookingId || '').localeCompare(a.sdmsBookingId || '', undefined, { numeric: true });
      if (sortBy === 'oldest') return (a.sdmsBookingId || '').localeCompare(b.sdmsBookingId || '', undefined, { numeric: true });
      return 0;
    });

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const paged = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleReset = () => {
    setBookingSearchQuery('');
    setSortBy('default');
    setCurrentPage(1);
  };

  const thSortStyle = {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.15s',
  };

  return (
    <div>
      <PageHeader
        title="List Booking"
        action={
          <button className="btn" onClick={onOpenWalkInModal}>
            + Walk-In
          </button>
        }
      />

      <FilterBar
        searchQuery={bookingSearchQuery}
        onSearchChange={(v) => { setBookingSearchQuery(v); setCurrentPage(1); }}
        searchPlaceholder="Cari Booking ID, Customer, Plat Nomor, atau Model..."
        sortOption={sortBy}
        onSortChange={(v) => { setSortBy(v); setCurrentPage(1); }}
        onReset={handleReset}
      />

      <div className="table-responsive-container" style={{
        background: theme.color.surface,
        borderRadius: theme.radius.sm,
      }}>
        <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
          <thead>
            <tr>
              <th style={thSortStyle} onClick={() => handleSortToggle('booking')}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Antrian {renderSortIcon('booking')}
                </div>
              </th>
              <th style={thSortStyle} onClick={() => handleSortToggle('customer')}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Nama Customer {renderSortIcon('customer')}
                </div>
              </th>
              <th style={thSortStyle} onClick={() => handleSortToggle('plate')}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  No. Polisi {renderSortIcon('plate')}
                </div>
              </th>
              <th>Model Kendaraan</th>
              <th>Waktu Booking</th>
              <th style={{ textAlign: 'center' }}>Aksi Check-In</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: theme.color.textMuted, padding: '3rem 2rem' }}>
                  Tidak ada booking yang cocok.
                </td>
              </tr>
            ) : (
              paged.map((b, idx) => (
                <tr key={b.sdmsBookingId || b.bookingNo || idx}>
                  <td><span className="badge-queue">{b.bookingNo || b.sdmsBookingId}</span></td>
                  <td style={{ fontWeight: 'bold' }}>{b.customerName}</td>
                  <td style={{ color: theme.color.textPrimary, fontWeight: 'bold' }}>{b.policeRegNo || b.licensePlate}</td>
                  <td>{b.groupCode || b.vehicleModel}</td>
                  <td>{b.reservasiTime || b.bookingTime || '09:30'}</td>
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredBookings.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
