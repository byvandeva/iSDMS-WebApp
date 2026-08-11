import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../utility/hooks/useAuth';

const LOGIN_ROLES = [
  { role: 'Security', label: 'Security Gate', email: 'security@suzuki.co.id' },
  { role: 'ServiceAdvisor', label: 'Service Advisor', email: 'sa@suzuki.co.id' },
  { role: 'Foreman', label: 'Foreman', email: 'foreman@suzuki.co.id' },
  { role: 'Admin', label: 'Super Admin', email: 'admin@suzuki.co.id' }
];

export default function LoginPage({ toast }) {
  const { currentUserRole, setRole, login, handleQuickLogin } = useAuth();

  const [selectedLoginRole, setSelectedLoginRole] = useState(currentUserRole || 'ServiceAdvisor');
  const [emailInput, setEmailInput] = useState('sa@suzuki.co.id');
  const [passwordInput, setPasswordInput] = useState('suzuki2026');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (login) {
      await login({ email: emailInput, password: passwordInput, role: selectedLoginRole });
    }
    handleQuickLogin(selectedLoginRole);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100vw', background: '#ffffff', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '1.25rem', right: '1.5rem', zIndex: 9999, background: '#ffffff', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a', borderRadius: '6px', padding: '0.85rem 1.25rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{toast.title}</div>
        </div>
      )}

      <div style={{
        flex: '1 1 55%',
        position: 'relative',
        background: 'linear-gradient(135deg, #002b5c 0%, #0054a6 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3.5rem',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <img src="/suzuki_white_logo.svg" alt="Suzuki Logo" style={{ height: '56px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ flex: '1 1 45%', minWidth: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3.5rem', backgroundColor: '#ffffff', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2.25rem' }}>
            <img src="/suzuki_logo.svg" alt="Suzuki Logo" style={{ height: '42px', objectFit: 'contain', marginBottom: '1.25rem' }} />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>
                Email / Username
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="user@suzuki.co.id"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#0f172a', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f8fafc', transition: 'all 0.15s ease' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.825rem', color: '#334155' }}>
                  Kata Sandi / Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi IT Administrator Dealer Suzuki Anda."); }} style={{ fontSize: '0.775rem', color: '#0054a6', textDecoration: 'none', fontWeight: 600 }}>
                  Lupa Password?
                </a>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem 2.75rem 0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#0f172a', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f8fafc' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
                  title={showPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '0.35rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                Pilih Role Akses (Bypass Login Cepat):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {LOGIN_ROLES.map(item => {
                  const isSelected = selectedLoginRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => {
                        setSelectedLoginRole(item.role);
                        setEmailInput(item.email);
                        setPasswordInput('suzuki2026');
                      }}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid #0f172a' : '1px solid #cbd5e1',
                        background: isSelected ? '#0f172a' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#334155',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn"
              style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem', borderRadius: '8px', marginTop: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(15,23,42,0.15)' }}
            >
              Sign In
            </button>
          </form>

          <div style={{ fontSize: '0.775rem', color: '#94a3b8', textAlign: 'center', marginTop: '2.5rem' }}>
            © 2026 PT Suzuki Indomobil Motor.
          </div>
        </div>
      </div>
    </div>
  );
}
