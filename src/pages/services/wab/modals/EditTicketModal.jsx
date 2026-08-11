import React from 'react';
import { Wrench, ShoppingBag, Layers, Package } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import ModalWrapper, { ModalCard } from '../../../../utility/components/ModalWrapper';

const ARRIVAL_PURPOSES = [
  { id: 'Service', label: 'Service', icon: Wrench },
  { id: 'Sales', label: 'Sales', icon: ShoppingBag },
  { id: 'BodyRepair', label: 'Body Repair', icon: Layers },
  { id: 'SparePart', label: 'Spare Part', icon: Package },
];

export default function EditTicketModal({ editingTicket, editForm, setEditForm, onClose, onSave }) {
  if (!editingTicket) return null;

  return (
    <ModalWrapper>
      <ModalCard width={460}>
        <h3 style={{ margin: '0 0 1rem 0', color: theme.color.textPrimary, fontSize: '1.1rem' }}>Edit Data Kendaraan &amp; Tujuan</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: theme.font.sizeSm, color: theme.color.textSecondary }}>Nomor Polisi</label>
            <input
              type="text"
              style={{ width: '100%', padding: '0.55rem', border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textPrimary, fontWeight: 'bold', boxSizing: 'border-box' }}
              value={editForm.licensePlate}
              onChange={e => setEditForm({ ...editForm, licensePlate: e.target.value })}
              placeholder="B 1234 ABC"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: theme.font.sizeSm, color: theme.color.textSecondary }}>Model / Tipe Kendaraan</label>
            <input
              type="text"
              style={{ width: '100%', padding: '0.55rem', border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textPrimary, boxSizing: 'border-box' }}
              value={editForm.vehicleModel}
              onChange={e => setEditForm({ ...editForm, vehicleModel: e.target.value })}
              placeholder="Suzuki XL7 Alpha"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: theme.font.sizeSm, color: theme.color.textSecondary }}>Tujuan Kedatangan</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {ARRIVAL_PURPOSES.map(p => {
                const IconComp = p.icon;
                const isActive = editForm.arrivalPurpose === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, arrivalPurpose: p.id })}
                    style={{
                      padding: '0.6rem 0.5rem', borderRadius: theme.radius.md,
                      border: isActive ? `2px solid ${theme.color.dark}` : `1px solid ${theme.color.border}`,
                      background: isActive ? theme.color.dark : theme.color.surface,
                      color: isActive ? theme.color.surface : theme.color.textSecondary,
                      fontWeight: isActive ? '700' : '500', fontSize: theme.font.sizeSm,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s ease',
                    }}
                  >
                    <IconComp size={15} color={isActive ? theme.color.surface : theme.color.dark} />
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
      </ModalCard>
    </ModalWrapper>
  );
}
