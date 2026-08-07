import React from 'react';

export default function CheckOutModal({ checkoutTargetTicket, onClose, onConfirm }) {
  if (!checkoutTargetTicket) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
      <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', width: 440, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>Konfirmasi Check-Out Gerbang</h3>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', color: '#475569', lineHeight: 1.4 }}>
          Apakah Anda yakin kendaraan <b style={{ color: '#000000ff' }}>{checkoutTargetTicket.licensePlate}</b> ({checkoutTargetTicket.vehicleModel}) telah rilis dan keluar dari gerbang?
        </p>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Batal</button>
          <button type="button" className="btn" style={{ flex: 1.5, backgroundColor: '#0f172a', color: '#ffffff' }} onClick={onConfirm}>Check-Out</button>
        </div>
      </div>
    </div>
  );
}
