import React from 'react';
import { Trash2, FileText, Edit2 } from 'lucide-react';

export default function InspectionSummary({ damages = [], onRemoveDamage, onDamageClick, onEditDamage }) {
  const getDamageLabel = (type) => {
    switch (type) {
      case 'Scratch': return 'Baret';
      case 'Dent': return 'Penyok';
      case 'Crack': return 'Retak';
      case 'Paint': return 'Cat Terkelupas';
      default: return type || 'Kerusakan';
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      padding: '1.25rem',
      height: '100%',
      minHeight: '440px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={17} color="#0f172a" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Ringkasan Kerusakan Fisik
          </h3>
        </div>

        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          Total: <b style={{ color: '#0f172a' }}>{damages.length}</b>
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {damages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
              Belum ada catatan kerusakan fisik 360°.
            </div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '4px' }}>
              Klik titik bodi pada model 360° untuk menambahkan lokasi kerusakan.
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Bagian</th>
                <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Jenis</th>
                <th style={{ padding: '0.5rem 0.4rem', fontWeight: 700 }}>Catatan</th>
                <th style={{ padding: '0.5rem 0.4rem', textAlign: 'center', width: '70px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {damages.map((damage) => (
                <tr
                  key={damage.id}
                  onClick={() => onDamageClick && onDamageClick(damage)}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
                  title="Klik baris untuk memutar mobil ke sudut titik ini"
                >
                  <td style={{ padding: '0.65rem 0.4rem', fontWeight: 700, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: damage.severity === 'High' ? '#be123c' : damage.severity === 'Medium' ? '#d97706' : '#15803d',
                          display: 'inline-block',
                          flexShrink: 0
                        }}
                      />
                      <span>{damage.part || 'Bodi Mobil'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.4rem', color: '#334155' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#f1f5f9', fontWeight: 600, fontSize: '0.775rem' }}>
                      {getDamageLabel(damage.type)}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.4rem', color: '#64748b' }}>
                    {damage.notes || '-'}
                  </td>
                  <td style={{ padding: '0.65rem 0.4rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEditDamage) {
                            onEditDamage(damage);
                          } else if (onDamageClick) {
                            onDamageClick(damage);
                          }
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', padding: '2px' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#0f172a'}
                        title="Edit Kerusakan"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveDamage && onRemoveDamage(damage.id);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
