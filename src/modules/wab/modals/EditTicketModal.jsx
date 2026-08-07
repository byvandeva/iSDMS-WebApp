import React from 'react';
import { Wrench, ShoppingBag, Layers, Package } from 'lucide-react';

export default function EditTicketModal({ editingTicket, editForm, setEditForm, onClose, onSave }) {
  if (!editingTicket) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
      <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', width: 460, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.1rem' }}>Edit Data Kendaraan & Tujuan</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Nomor Polisi</label>
            <input
              type="text"
              style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', color: '#0f172a', fontWeight: 'bold', boxSizing: 'border-box' }}
              value={editForm.licensePlate}
              onChange={e => setEditForm({ ...editForm, licensePlate: e.target.value })}
              placeholder="B 1234 ABC"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Model / Tipe Kendaraan</label>
            <input
              type="text"
              style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }}
              value={editForm.vehicleModel}
              onChange={e => setEditForm({ ...editForm, vehicleModel: e.target.value })}
              placeholder="Suzuki XL7 Alpha"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Tujuan Kedatangan</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[
                { id: 'Service', label: 'Service', icon: Wrench },
                { id: 'Sales', label: 'Sales', icon: ShoppingBag },
                { id: 'BodyRepair', label: 'Body Repair', icon: Layers },
                { id: 'SparePart', label: 'Spare Part', icon: Package }
              ].map(p => {
                const IconComp = p.icon;
                const isActive = editForm.arrivalPurpose === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, arrivalPurpose: p.id })}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: '6px',
                      border: isActive ? '2px solid #0f172a' : '1px solid #cbd5e1',
                      background: isActive ? '#0f172a' : '#ffffff',
                      color: isActive ? '#ffffff' : '#334155',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComp size={15} color={isActive ? '#ffffff' : '#0f172a'} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Batal</button>
          <button type="button" className="btn" style={{ flex: 1.5 }} onClick={onSave}>Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}
