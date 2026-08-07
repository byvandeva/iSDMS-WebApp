import React, { useState } from 'react';

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
  const [sortBy, setSortBy] = useState('newest');

  const filteredTickets = tickets
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
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.checkInTime || b.createdAt || 0) - new Date(a.checkInTime || a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.checkInTime || a.createdAt || 0) - new Date(b.checkInTime || b.createdAt || 0);
      if (sortBy === 'plate') return (a.licensePlate || '').localeCompare(b.licensePlate || '');
      if (sortBy === 'queue') return (a.queueNumber || '').localeCompare(b.queueNumber || '');
      return 0;
    });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#0f172a' }}>Daftar Tamu</h3>
        {(currentUserRole === 'Security' || currentUserRole === 'Admin') && (
          <button className="btn" onClick={onOpenWalkInModal}>
            + Walk-In
          </button>
        )}
      </div>

      {/* SEARCH, FILTER, & SORT CONTROL BAR */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* SEARCH INPUT */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Cari Plat Nomor, Model, Customer, atau Antrian..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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

        {/* FILTER PURPOSE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Filter Purpose:</label>
          <select
            value={filterPurpose}
            onChange={e => setFilterPurpose(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.825rem',
              color: '#0f172a',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="All">Semua Tujuan</option>
            <option value="Service">Service</option>
            <option value="Sales">Sales</option>
            <option value="BodyRepair">Body Repair</option>
            <option value="SparePart">Spare Part</option>
          </select>
        </div>

        {/* SORT BY */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Urutkan:</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.825rem',
              color: '#0f172a',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="newest">Terbaru (Teratas)</option>
            <option value="oldest">Terlama</option>
            <option value="plate">Plat Nomor (A-Z)</option>
            <option value="queue">No. Antrian</option>
          </select>
        </div>
      </div>

      <table className="enterprise-table">
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
            <th style={{ textAlign: 'center', minWidth: '220px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Tidak ada tamu yang cocok dengan kriteria pencarian/filter.</td>
            </tr>
          ) : (
            filteredTickets.map((t, idx) => (
              <tr key={t.ticketId}>
                <td>{idx + 1}</td>
                <td>
                  {t.queueNumber ? (
                    <span className="badge-queue">{t.queueNumber}</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>-</span>
                  )}
                </td>
                <td style={{ color: '#0f172a', fontWeight: 'bold' }}>{t.licensePlate}</td>
                <td>{t.vehicleModel}</td>
                <td>
                  <span className={`badge badge-${getPurposeString(t.arrivalPurpose).toLowerCase()}`}>
                    {getPurposeString(t.arrivalPurpose)}
                  </span>
                </td>
                <td>{(!t.customerName || t.customerName === 'Diisi oleh SA di WAB') ? '-' : t.customerName}</td>
                <td>
                  {(() => {
                    const isWabDone = t.status === 'Inspected' || t.status === 'WabDone' || t.wabSubmitted;
                    const isWabInProgress = t.status === 'WabInProgress' || t.status === 'InProgress' || t.status === 'In Progress';

                    if (isWabDone) {
                      return (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#059669', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                          ✓ Completed
                        </span>
                      );
                    }
                    if (isWabInProgress) {
                      return (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#0054a6', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                          On Progress
                        </span>
                      );
                    }
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff0f1ff', border: '1px solid #eff0f1ff', color: '#0f172a', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {getStatusString(t.status)}
                      </span>
                    );
                  })()}
                </td>
                <td>{t.checkInTime ? new Date(t.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
                    {/* MULAI / LANJUTKAN / LIHAT WAB: KHUSUS SERVICE ADVISOR & ADMIN */}
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
                          <button className="btn btn-sm" style={{ backgroundColor: '#0f172a', borderColor: '#0f172a', color: '#ffffff' }} onClick={() => onStartWab(t)}>
                            Lihat WAB
                          </button>
                        );
                      }
                      if (isWabInProgress) {
                        return (
                          <button className="btn btn-sm" style={{ backgroundColor: '#0054a6', borderColor: '#0054a6', color: '#ffffff' }} onClick={() => onStartWab(t)}>
                            Lanjutkan WAB
                          </button>
                        );
                      }
                      return (
                        <button className="btn btn-sm" style={{ backgroundColor: '#0054a6', borderColor: '#0054a6', color: '#ffffff' }} onClick={() => onStartWab(t)}>
                          Mulai WAB
                        </button>
                      );
                    })()}

                    {/* EDIT BUTTON: KHUSUS SECURITY, SA & ADMIN */}
                    {(currentUserRole === 'Security' || currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (
                      <button className="btn btn-sm btn-secondary" title="Edit Data Kendaraan & Tujuan" onClick={() => onOpenEditModal(t)}>
                        Edit
                      </button>
                    )}

                    {/* CHECK-OUT BUTTON: KHUSUS SECURITY & ADMIN */}
                    {(currentUserRole === 'Security' || currentUserRole === 'Admin') && (
                      t.status !== 'CheckedOut' ? (
                        <button className="btn btn-sm btn-secondary" style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none' }} title="Check-Out Gerbang" onClick={() => onOpenCheckOutModal(t)}>
                          Check-Out
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Out</span>
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
  );
}
