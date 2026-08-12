import React, { useState } from 'react';
import { User, Mail, Lock, KeyRound, LogOut, Save, Globe, CheckCircle } from 'lucide-react';
import PageHeader from '../../navigation/PageHeader';
import { useLanguageTheme } from '../../utility/context/LanguageThemeContext';

const ROLE_DISPLAY_NAMES = {
  Security: 'Security Gate Officer',
  ServiceAdvisor: 'Service Advisor (SA)',
  Foreman: 'Foreman Bengkel',
  CCM: 'Chief Customer Manager (CCM)',
  Admin: 'System Administrator',
};

const ROLE_EMAILS = {
  Security: 'security@suzuki.co.id',
  ServiceAdvisor: 'sa@suzuki.co.id',
  Foreman: 'foreman@suzuki.co.id',
  CCM: 'ccm@suzuki.co.id',
  Admin: 'admin@suzuki.co.id',
};

const ROLE_INITIALS = {
  Security: 'SO',
  ServiceAdvisor: 'SA',
  Foreman: 'FB',
  CCM: 'CCM',
  Admin: 'ADM',
};

const LANGUAGES = [
  { code: 'id', flag: '🇮🇩', label: 'ID' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ja', flag: '🇯🇵', label: 'JA (日本語)' },
];

export default function Account({ currentUserRole = 'ServiceAdvisor', onLogout }) {
  const { language, changeLanguage, t } = useLanguageTheme();

  const displayName = ROLE_DISPLAY_NAMES[currentUserRole] || currentUserRole;
  const initialEmail = ROLE_EMAILS[currentUserRole] || `${currentUserRole.toLowerCase()}@suzuki.co.id`;
  const initials = ROLE_INITIALS[currentUserRole] || 'SA';

  const [emailInput, setEmailInput] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState(null);

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveEmail = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    notify('success', 'Email berhasil diperbarui ke: ' + emailInput);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return notify('error', 'Semua kolom password wajib diisi.');
    if (newPassword !== confirmPassword) return notify('error', 'Konfirmasi password baru tidak cocok.');
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    notify('success', 'Password berhasil diubah!');
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <PageHeader title={t('navAccount')} subtitle="Pengaturan Profil & Bahasa" />

      {notification && (
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem', borderRadius: '8px', background: notification.type === 'error' ? '#fff1f2' : '#f0fdf4', border: notification.type === 'error' ? '1px solid #fecdd3' : '1px solid #bbf7d0', color: notification.type === 'error' ? '#991b1b' : '#166534', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {notification.type === 'error' ? <Lock size={16} /> : <CheckCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem 1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem' }}>
            {initials}
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1.15rem', fontWeight: 800 }}>{displayName}</h3>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Role: {currentUserRole}</span>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem 1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <Globe size={18} color="#0f172a" />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{t('pilihBahasa')}</h4>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => changeLanguage(item.code)}
                style={{ flex: 1, padding: '0.65rem 0.4rem', borderRadius: '8px', border: language === item.code ? '2px solid #0f172a' : '1px solid #cbd5e1', background: language === item.code ? '#0f172a' : '#ffffff', color: language === item.code ? '#ffffff' : '#334155', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem 1.75rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <Mail size={18} color="#0f172a" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Informasi Kontak Email</h4>
            </div>
            <form onSubmit={handleSaveEmail}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>Email Akun</label>
                <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }} required />
              </div>
              <button type="submit" className="btn" style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
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
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>Password Baru</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>Konfirmasi Password Baru</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }} required />
                </div>
              </div>
              <button type="submit" className="btn" style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
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
            <button type="button" className="btn" onClick={onLogout} style={{ backgroundColor: '#be123c', color: '#ffffff', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
