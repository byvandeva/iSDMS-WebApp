import React, { useState } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import ModalWrapper, { ModalCard } from '../../../../utility/components/ModalWrapper';

const DAMAGE_TYPES = [
  { id: 'Scratch', label: 'Baret (Scratch)' },
  { id: 'Dent', label: 'Penyok (Dent)' },
  { id: 'Crack', label: 'Retak (Crack)' },
  { id: 'Paint', label: 'Cat Terkelupas' },
];

const SEVERITY_LEVELS = [
  { id: 'Low', label: 'Ringan' },
  { id: 'Medium', label: 'Sedang' },
  { id: 'High', label: 'Tinggi' },
];

export default function DamageLoggerModal({ isOpen, onClose, onSave, context }) {
  const [type, setType] = useState(context?.type || 'Scratch');
  const [severity, setSeverity] = useState(context?.severity || 'Low');
  const [notes, setNotes] = useState(context?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(context?.photoUrl || '');

  React.useEffect(() => {
    if (context) {
      setType(context.type || 'Scratch');
      setSeverity(context.severity || 'Low');
      setNotes(context.notes || '');
      setPhotoUrl(context.photoUrl || '');
    }
  }, [context]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => setPhotoUrl(uploadEvent.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ type, severity, notes, photoUrl, part: context?.part || 'Titik Inspeksi 360°' });
    setType('Scratch');
    setSeverity('Low');
    setNotes('');
    setPhotoUrl('');
  };

  const selectButtonStyle = (isSelected) => ({
    padding: '0.55rem 0.5rem',
    borderRadius: theme.radius.md,
    border: isSelected ? `1px solid ${theme.color.dark}` : `1px solid ${theme.color.border}`,
    background: isSelected ? theme.color.dark : theme.color.surface,
    color: isSelected ? theme.color.surface : theme.color.textSecondary,
    fontWeight: isSelected ? 700 : 500,
    fontSize: '0.8rem',
    cursor: 'pointer',
  });

  return (
    <ModalWrapper zIndex={theme.zIndex.modalTop}>
      <ModalCard width={440} style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: `1px solid ${theme.color.borderLight}`, paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: theme.color.textPrimary, margin: 0 }}>Catatan Kerusakan Bodi</h3>
            <div style={{ color: theme.color.textSecondary, fontWeight: 600, fontSize: '0.8rem', marginTop: '2px' }}>Area: {context?.part || 'Titik Inspeksi 360°'}</div>
          </div>
          <button onClick={onClose} style={{ background: theme.color.surfaceAlt, border: 'none', borderRadius: theme.radius.sm, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.color.textMuted }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.4rem' }}>Tipe Kerusakan</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {DAMAGE_TYPES.map(item => (
                <button key={item.id} type="button" onClick={() => setType(item.id)} style={selectButtonStyle(type === item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.4rem' }}>Tingkat Keparahan</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {SEVERITY_LEVELS.map(s => (
                <button key={s.id} type="button" onClick={() => setSeverity(s.id)} style={{ ...selectButtonStyle(severity === s.id), flex: 1, padding: '0.5rem' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.35rem' }}>Foto Bukti Kerusakan (Opsional)</label>
            {photoUrl ? (
              <div style={{ position: 'relative', borderRadius: theme.radius.md, overflow: 'hidden', border: `1px solid ${theme.color.border}`, maxHeight: '160px', background: theme.color.bg, textAlign: 'center' }}>
                <img src={photoUrl} alt="Foto Kerusakan" style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                <button type="button" onClick={() => setPhotoUrl('')} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(220, 38, 38, 0.9)', color: theme.color.surface, border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Hapus Foto">
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: `2px dashed ${theme.color.border}`, borderRadius: theme.radius.md, background: theme.color.bg, cursor: 'pointer' }}>
                <Camera size={22} color={theme.color.textMuted} style={{ marginBottom: '4px' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: theme.color.textPrimary }}>Ambil / Upload Foto Kerusakan</span>
                <span style={{ fontSize: theme.font.sizeXs, color: '#94a3b8', marginTop: '2px' }}>Format JPG, PNG (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.35rem' }}>Catatan Kerusakan (Opsional)</label>
            <textarea
              rows={3}
              placeholder="Detail kerusakan bodi..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: theme.radius.md, border: `1px solid ${theme.color.border}`, fontSize: '0.8rem', color: theme.color.textPrimary, resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.55rem', borderRadius: theme.radius.md, border: `1px solid ${theme.color.border}`, background: theme.color.surface, color: theme.color.textSecondary, fontWeight: 600, fontSize: theme.font.sizeSm, cursor: 'pointer' }}>Batal</button>
            <button type="button" onClick={handleSave} style={{ flex: 1.5, padding: '0.55rem', borderRadius: theme.radius.md, border: 'none', background: theme.color.dark, color: theme.color.surface, fontWeight: 700, fontSize: theme.font.sizeSm, cursor: 'pointer' }}>Simpan Titik Kerusakan</button>
          </div>
        </div>
      </ModalCard>
    </ModalWrapper>
  );
}
