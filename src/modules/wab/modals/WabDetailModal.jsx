import React from 'react';
import { CheckCircle, User, MessageSquare, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function WabDetailModal({ isOpen, ticket, onClose }) {
  if (!isOpen || !ticket) return null;

  const damages = ticket.damages || ticket.wabDamages || [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 3900,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '92vw',
        maxWidth: '720px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
        border: '1px solid #cbd5e1'
      }}>
        {/* MODAL HEADER */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.75rem',
          background: '#0f172a',
          color: '#ffffff',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Hasil WAB 5-Step (Read-Only)
              </h3>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#059669', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                <CheckCircle size={12} />
                Completed
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
              {ticket.licensePlate} &bull; {ticket.vehicleModel} &bull; Queue: {ticket.queueNumber || 'Non-Service'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* CUSTOMER & VEHICLE OVERVIEW CARD */}
          <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="#0054a6" /> Informasi Pelanggan & Kendaraan
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block' }}>Nama Pelanggan</span>
                <strong style={{ color: '#0f172a' }}>{ticket.customerName || ticket.wabCustomerName || '-'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block' }}>Nomor Telepon</span>
                <strong style={{ color: '#0f172a' }}>{ticket.customerPhone || ticket.wabCustomerPhone || '-'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block' }}>Nomor Polisi</span>
                <strong style={{ color: '#0f172a' }}>{ticket.licensePlate || '-'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block' }}>Model Kendaraan</span>
                <strong style={{ color: '#0f172a' }}>{ticket.vehicleModel || '-'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block' }}>Jenis Servis</span>
                <strong style={{ color: '#0f172a' }}>{ticket.serviceType || 'Periodic Service'}</strong>
              </div>
            </div>
          </div>

          {/* CUSTOMER COMPLAINTS */}
          <div style={{ background: '#ffffff', padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={16} color="#0054a6" /> Keluhan & Permintaan Konsumen
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {ticket.customerComplaints || ticket.wabComplaints || 'Tidak ada keluhan khusus yang dicatat.'}
            </p>
          </div>

          {/* 360 DEGREE INSPECTION DAMAGES */}
          <div style={{ background: '#ffffff', padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} color="#dc2626" /> Catatan Kerusakan Bodi 360° ({damages.length} Titik)
            </h4>
            {damages.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b', fontStyle: 'italic' }}>Kondisi bodi luar mulus, tidak ada titik kerusakan tercatat.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {damages.map((d, idx) => (
                  <div key={d.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
                        {d.type || d.damageType || 'Scratch'} &bull; Frame {d.frame || 1}
                      </strong>
                      <span style={{ fontSize: '0.775rem', color: '#64748b' }}>{d.notes || 'Catatan bodi luar'}</span>
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: (d.severity === 'High' || d.severity === 'Berat') ? '#fef2f2' : '#f0fdf4',
                      color: (d.severity === 'High' || d.severity === 'Berat') ? '#dc2626' : '#16a34a',
                      border: `1px solid ${(d.severity === 'High' || d.severity === 'Berat') ? '#fca5a5' : '#86efac'}`
                    }}>
                      {d.severity || 'Low'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DIGITAL SIGNATURE CONFIRMATION */}
          <div style={{ background: '#ffffff', padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#059669" /> Tanda Tangan Persetujuan Pelanggan
            </h4>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', background: '#ffffff', display: 'inline-block', minWidth: '240px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', display: 'block', marginBottom: '0.5rem' }}>Digital Signature Recorded</span>
                <div style={{ fontFamily: "serif", fontSize: '1.6rem', color: '#0f172a', fontWeight: 700, fontStyle: 'italic', letterSpacing: '1px' }}>
                  {ticket.customerName || ticket.wabCustomerName || 'Pelanggan Suzuki'}
                </div>
              </div>
              <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                Telah disetujui secara digital oleh pelanggan pada saat penerimaan kendaraan.
              </span>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.75rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.55rem 1.5rem', fontWeight: 700, fontSize: '0.85rem' }}
            onClick={onClose}
          >
            Tutup Detail
          </button>
        </div>

      </div>
    </div>
  );
}
