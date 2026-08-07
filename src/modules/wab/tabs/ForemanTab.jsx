import React, { useState } from 'react';
import { Wrench } from 'lucide-react';

export default function ForemanTab({ tickets, getStatusString, onFinishJob, onUpdateTracking }) {
  const [foremanForm, setForemanForm] = useState({
    ticketId: '',
    stallName: '',
    technicianName: '',
    foremanRecommendation: '',
    addExtraMinutes: 15
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateTracking(foremanForm);
  };

  return (
    <div>
      {/* FOREMAN HEADER & METRIC SUMMARY CARDS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1.15rem', fontWeight: 700 }}>
            Foreman Live Workshop & Tracking Board
          </h3>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b' }}>
            Monitor alokasi stall bengkel, teknisi, rekomendasi pengerjaan, dan estimasi waktu servis.
          </p>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proses Servis (In-Stall)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {tickets.filter(t => t.status !== 'ServiceCompleted' && t.status !== 'CheckedOut').length} Kendaraan
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pengerjaan Selesai</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {tickets.filter(t => t.status === 'ServiceCompleted').length} Kendaraan
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Kendaraan Terdaftar</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {tickets.length} Kendaraan
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: WORKSHOP TABLE & CONTROL PANEL */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {/* LEFT: LIVE WORKSHOP TABLE */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Daftar Pengerjaan Stall Bengkel</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>({tickets.length} Kendaraan)</span>
            </div>

            <table className="enterprise-table" style={{ border: 'none', borderRadius: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '35px' }}>No</th>
                  <th>Antrian</th>
                  <th>No. Polisi</th>
                  <th>Stall & Teknisi</th>
                  <th>Rekomendasi Foreman</th>
                  <th>Ekstra</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Belum ada pengerjaan di bengkel.</td>
                  </tr>
                ) : (
                  tickets.map((t, idx) => (
                    <tr key={t.ticketId}>
                      <td>{idx + 1}</td>
                      <td><span className="badge-queue">{t.queueNumber || '-'}</span></td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.licensePlate}</div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{t.customerName}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>{t.stallName || 'Stall -'}</div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{t.technicianName || 'Teknisi -'}</div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#334155', maxWidth: '180px' }}>
                        {t.foremanRecommendation || '-'}
                      </td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                        +{t.foremanExtraMinutes || 0}m
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: t.status === 'ServiceCompleted' ? '#0f172a' : '#f1f5f9',
                          color: t.status === 'ServiceCompleted' ? '#ffffff' : '#334155',
                          border: t.status === 'ServiceCompleted' ? 'none' : '1px solid #cbd5e1'
                        }}>
                          {t.status === 'ServiceCompleted' ? '✓ Finished' : getStatusString(t.status)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {t.status !== 'ServiceCompleted' ? (
                          <button
                            className="btn btn-sm"
                            style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                            onClick={() => onFinishJob(t.ticketId)}
                          >
                            Finish Job
                          </button>
                        ) : (
                          <span style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '0.8rem' }}>✓ Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: CONTROL PANEL UPDATE FOREMAN */}
        <div style={{ width: '360px', flexShrink: 0 }}>
          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <Wrench size={18} color="#0f172a" />
              <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Update Rekomendasi & Tracking</h4>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.8rem', color: '#334155' }}>Pilih Kendaraan Servis</label>
                <select
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.825rem', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                  value={foremanForm.ticketId}
                  onChange={e => {
                    const selected = tickets.find(t => t.ticketId === e.target.value);
                    setForemanForm({
                      ...foremanForm,
                      ticketId: e.target.value,
                      stallName: selected?.stallName || foremanForm.stallName,
                      technicianName: selected?.technicianName || foremanForm.technicianName,
                      foremanRecommendation: selected?.foremanRecommendation || foremanForm.foremanRecommendation,
                      addExtraMinutes: selected?.foremanExtraMinutes || 15
                    });
                  }}
                >
                  <option value="">-- Pilih Kendaraan --</option>
                  {tickets.map(t => (
                    <option key={t.ticketId} value={t.ticketId}>
                      {t.licensePlate} ({t.queueNumber || 'Non-Service'}) - {t.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.8rem', color: '#334155' }}>Stall Bengkel</label>
                  <input
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.825rem', color: '#0f172a', boxSizing: 'border-box' }}
                    value={foremanForm.stallName}
                    onChange={e => setForemanForm({ ...foremanForm, stallName: e.target.value })}
                    placeholder="Stall 01"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.8rem', color: '#334155' }}>Nama Teknisi</label>
                  <input
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.825rem', color: '#0f172a', boxSizing: 'border-box' }}
                    value={foremanForm.technicianName}
                    onChange={e => setForemanForm({ ...foremanForm, technicianName: e.target.value })}
                    placeholder="Budi (Teknisi 1)"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.8rem', color: '#334155' }}>Estimasi Ekstra Waktu (Menit)</label>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  {[15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setForemanForm({ ...foremanForm, addExtraMinutes: mins })}
                      style={{
                        flex: 1,
                        padding: '0.35rem',
                        borderRadius: '5px',
                        border: foremanForm.addExtraMinutes === mins ? '2px solid #0f172a' : '1px solid #cbd5e1',
                        background: foremanForm.addExtraMinutes === mins ? '#0f172a' : '#ffffff',
                        color: foremanForm.addExtraMinutes === mins ? '#ffffff' : '#334155',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      +{mins}m
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.825rem', color: '#0f172a', boxSizing: 'border-box' }}
                  value={foremanForm.addExtraMinutes}
                  onChange={e => setForemanForm({ ...foremanForm, addExtraMinutes: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.8rem', color: '#334155' }}>Rekomendasi Pengerjaan Foreman</label>
                <textarea
                  rows={3}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.825rem', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  value={foremanForm.foremanRecommendation}
                  onChange={e => setForemanForm({ ...foremanForm, foremanRecommendation: e.target.value })}
                  placeholder="Tuliskan rekomendasi pengerjaan / penggantian sparepart..."
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', marginTop: '0.5rem', padding: '0.65rem' }}
              >
                Simpan Update Foreman
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
