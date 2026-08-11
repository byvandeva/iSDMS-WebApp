import React from 'react';
import { X } from 'lucide-react';

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
      background: 'rgba(15, 23, 42, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3900,
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #0f172a',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          background: '#ffffff',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Detail Form WAB
            </h3>
            <span style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
              {ticket.vehicleModel || '-'} &bull; Antrian: {ticket.queueNumber || 'Non-Service'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Informasi Pelanggan &amp; Kendaraan
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Nama Pelanggan</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{ticket.customerName || ticket.wabCustomerName || '-'}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Nomor Telepon</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{ticket.customerPhone || ticket.wabCustomerPhone || '-'}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Nomor Polisi</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{ticket.licensePlate || '-'}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Model Kendaraan</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{ticket.vehicleModel || '-'}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Jenis Servis</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{ticket.serviceType || 'Periodic Service'}</span>
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Keluhan Pelanggan
            </h4>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#0f172a', lineHeight: 1.5 }}>
              {ticket.customerComplaints || ticket.wabComplaints || 'Tidak ada keluhan khusus.'}
            </p>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Catatan Kerusakan Bodi ({damages.length})
            </h4>
            {damages.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b' }}>Kondisi bodi mulus, tidak ada titik kerusakan.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {damages.map((d, idx) => (
                  <div key={d.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.65rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.type || d.damageType || 'Scratch'}</span>
                      <span style={{ color: '#64748b', marginLeft: '6px' }}>(Frame {d.frame || 1})</span>
                      {d.notes && <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>{d.notes}</span>}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>
                      {d.severity || 'Low'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tanda Tangan Pelanggan
            </h4>
            <div style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'inline-block', minWidth: '200px', marginTop: '0.25rem' }}>
              <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 700, fontStyle: 'italic' }}>
                {ticket.customerName || ticket.wabCustomerName || 'Pelanggan'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1.25rem', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
          <button
            type="button"
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.45rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.825rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
