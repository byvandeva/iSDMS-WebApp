import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function DamageLoggerModal({ isOpen, onClose, onSave, context }) {
  const [type, setType] = useState(context?.type || 'Scratch');
  const [severity, setSeverity] = useState(context?.severity || 'Low');
  const [notes, setNotes] = useState(context?.notes || '');

  React.useEffect(() => {
    if (context) {
      setType(context.type || 'Scratch');
      setSeverity(context.severity || 'Low');
      setNotes(context.notes || '');
    }
  }, [context]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      type,
      severity,
      notes,
      part: context?.part || 'Titik Inspeksi 360°'
    });
    setType('Scratch');
    setSeverity('Low');
    setNotes('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 4500
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
        border: '1px solid #cbd5e1',
        boxSizing: 'border-box'
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Catatan Kerusakan Bodi</h3>
            <div style={{ color: '#475569', fontWeight: 600, fontSize: '0.8rem', marginTop: '2px' }}>Area: {context?.part || 'Titik Inspeksi 360°'}</div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* DAMAGE TYPE SELECTION */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Tipe Kerusakan</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {[
                { id: 'Scratch', label: 'Baret (Scratch)' },
                { id: 'Dent', label: 'Penyok (Dent)' },
                { id: 'Crack', label: 'Retak (Crack)' },
                { id: 'Paint', label: 'Cat Terkelupas' }
              ].map(item => {
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    style={{
                      padding: '0.55rem 0.5rem',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid #0f172a' : '1px solid #cbd5e1',
                      background: isSelected ? '#0f172a' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#334155',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEVERITY SELECTION */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>Tingkat Keparahan</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[
                { id: 'Low', label: 'Ringan' },
                { id: 'Medium', label: 'Sedang' },
                { id: 'High', label: 'Tinggi' }
              ].map(s => {
                const isSelected = severity === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSeverity(s.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid #0f172a' : '1px solid #cbd5e1',
                      background: isSelected ? '#0f172a' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#334155',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* NOTES */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>Catatan Kerusakan (Opsional)</label>
            <textarea
              rows={3}
              placeholder="Detail kerusakan..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                color: '#0f172a',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                flex: 1.5,
                padding: '0.55rem',
                borderRadius: '6px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              Simpan Titik Kerusakan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
