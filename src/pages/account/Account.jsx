import React, { useState } from 'react';
import { User, Shield, Mail, Lock, Building, Key, CheckCircle, LogOut, Save, KeyRound } from 'lucide-react';
import PageHeader from '../../navigation/PageHeader';
import { theme } from '../../configs/themeConfig';

const ROLE_DISPLAY_NAMES = {
  Security: 'Security Gate Officer',
  ServiceAdvisor: 'Service Advisor (SA)',
  Foreman: 'Foreman Bengkel',
  CCM: 'Chief Customer Manager (CCM)',
  Admin: 'System Administrator'
};

const ROLE_EMAILS = {
  Security: 'security@suzuki.co.id',
  ServiceAdvisor: 'sa@suzuki.co.id',
  Foreman: 'foreman@suzuki.co.id',
  CCM: 'ccm@suzuki.co.id',
  Admin: 'admin@suzuki.co.id'
};

const ROLE_INITIALS = {
  Security: 'SO',
  ServiceAdvisor: 'SA',
  Foreman: 'FB',
  CCM: 'CCM',
  Admin: 'ADM'
};

export default function Account({ currentUserRole = 'ServiceAdvisor', onLogout }) {
  const displayName = ROLE_DISPLAY_NAMES[currentUserRole] || currentUserRole;
  const initialEmail = ROLE_EMAILS[currentUserRole] || `${currentUserRole.toLowerCase()}@suzuki.co.id`;
  const initials = ROLE_INITIALS[currentUserRole] || 'SA';

  const [emailInput, setEmailInput] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSaveEmail = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setNotification({ type: 'success', message: 'Email berhasil diperbarui ke: ' + emailInput });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setNotification({ type: 'error', message: 'Semua kolom password wajib diisi.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotification({ type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setNotification({ type: 'success', message: 'Password akun berhasil diubah.' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div style={{ width: '100%' }}>
      <PageHeader title="Profil Pengguna & Keamanan Akun" />

      {notification && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          backgroundColor: notification.type === 'success' ? '#f0fdf4' : '#fff1f2',
          border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : '#fecdd3'}`,
          color: notification.type === 'success' ? '#15803d' : '#be123c',
          fontSize: '0.875rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {notification.type === 'success' ? <CheckCircle size={16} /> : <Lock size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
        <div style={{
          background: theme.color.surface,
          borderRadius: '12px',
          border: `1px solid ${theme.color.border}`,
          padding: '1.5rem 1.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: 800,
              flexShrink: 0
            }}>
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {displayName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px'
                }}>
                  Role: {currentUserRole}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  <CheckCircle size={12} color="#16a34a" /> Terverifikasi SDMS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '1.15rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>ID PEGAWAI SDMS</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>SDMS-EMP-6006401</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.15rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>DEALER & CABANG</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Suzuki Jakarta Pusat</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.15rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>TINGKAT HAK AKSES</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Operational Full Access</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.15rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>STATUS SESI</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a' }}>Aktif (Verified)</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem 1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <Mail size={18} color="#0f172a" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Pengaturan Email Pengguna</h4>
            </div>

            <form onSubmit={handleSaveEmail}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>Email Resmi Akun</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Save size={15} />
                <span>Simpan Perubahan Email</span>
              </button>
            </form>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem 1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <KeyRound size={18} color="#0f172a" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Ubah Password Akun</h4>
            </div>

            <form onSubmit={handleSavePassword}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>Password Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>Password Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <KeyRound size={15} />
                <span>Ubah Password Akun</span>
              </button>
            </form>
          </div>
        </div>

        {onLogout && (
          <div style={{ background: '#ffffff', padding: '1.25rem 1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>Keluar dari Sesi Portal SDMS</span>
              <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Gunakan tombol ini untuk mengakhiri sesi dan keluar dari sistem secara aman.</span>
            </div>
            <button
              type="button"
              className="btn"
              onClick={onLogout}
              style={{
                backgroundColor: '#be123c',
                color: '#ffffff',
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
