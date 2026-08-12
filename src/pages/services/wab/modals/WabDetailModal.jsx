import React from 'react';
import { X } from 'lucide-react';

const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{label}</span>
    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
  </div>
);

const Field = ({ label, value, span }) => (
  <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
    <span style={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
    <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.825rem' }}>{value || '-'}</span>
  </div>
);

const SignatureBox = ({ label, src }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
    <div style={{ width: '100%', height: '110px', border: '1px dashed #cbd5e1', borderRadius: '6px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {src ? (
        <img src={src} alt={label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      ) : (
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Belum ada tanda tangan</span>
      )}
    </div>
    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{label}</span>
  </div>
);

export default function WabDetailModal({ isOpen, ticket, onClose }) {
  if (!isOpen || !ticket) return null;

  const damages = ticket.damages || ticket.wabDamages || [];
  const functionalInspections = ticket.functionalInspections || [];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3900, padding: '1.25rem' }}>
      <div style={{ background: '#ffffff', borderRadius: '10px', width: '100%', maxWidth: '700px', height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Detail Form WAB</h3>
            <span style={{ fontSize: '0.775rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
              {ticket.vehicleModel || ticket.groupCode || '-'} &bull; Antrian: <b style={{ color: '#0f172a' }}>{ticket.queueNumber || 'Non-Service'}</b>
            </span>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <Divider label="Pelanggan & Kendaraan" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <Field label="Nama Pelanggan" value={ticket.customerName || ticket.wabCustomerName} />
            <Field label="Nomor Telepon" value={ticket.customerPhone || ticket.telponNo || ticket.wabCustomerPhone} />
            <Field label="Nomor Polisi" value={(ticket.licensePlate || ticket.policeRegNo || '').toUpperCase()} />
            <Field label="Model Kendaraan" value={ticket.vehicleModel || ticket.groupCode} />
            <Field label="Jenis Servis" value={ticket.serviceType || ticket.jobType} />
            <Field label="Odometer" value={ticket.odometer ? `${ticket.odometer} km` : undefined} />
            <Field label="Stall" value={ticket.stallCode || ticket.stallName} />
            <Field label="Service Advisor" value={ticket.serviceAdvisor} />
            {(ticket.customerAddress || ticket.saCustomerAddress) && (
              <Field label="Alamat" value={ticket.customerAddress || ticket.saCustomerAddress} span={2} />
            )}
          </div>

          <Divider label="Keluhan Pelanggan" />
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#0f172a', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {ticket.customerComplaints || ticket.wabComplaints || 'Tidak ada keluhan khusus.'}
          </p>

          {functionalInspections.length > 0 && (
            <>
              <Divider label={`Inspeksi Fungsi (${functionalInspections.length} item)`} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                {functionalInspections.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                    <span style={{ color: '#334155' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: item.status === 'OK' ? '#16a34a' : item.status === 'Tidak OK' ? '#be123c' : '#d97706', fontSize: '0.75rem' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <Divider label={`Kerusakan Bodi (${damages.length} titik)`} />
          {damages.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#94a3b8', fontStyle: 'italic' }}>Kondisi bodi mulus, tidak ada titik kerusakan.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {damages.map((d, idx) => (
                <div key={d.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.type || d.damageType || 'Scratch'}</span>
                    <span style={{ color: '#94a3b8', marginLeft: '6px', fontSize: '0.75rem' }}>Frame {d.frame || 1}</span>
                    {d.notes && <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>{d.notes}</div>}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', color: d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#64748b', flexShrink: 0, marginLeft: '0.5rem' }}>
                    {d.severity || 'Low'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Divider label="Tanda Tangan" />
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <SignatureBox label="Tanda Tangan Pelanggan" src={ticket.customerSignatureUrl} />
            <SignatureBox label="Tanda Tangan Service Advisor" src={ticket.saSignatureUrl} />
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1.25rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.5rem 1.5rem', fontWeight: 700, fontSize: '0.825rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
