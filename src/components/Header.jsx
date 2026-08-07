import React from 'react';
import { Menu, User, Car } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', background: 'rgba(255, 255, 255, 0.95)' }}>
      <div className="flex items-center gap-4">
        <button className="btn btn-outline" style={{ border: 'none', padding: '0.5rem' }}>
          <Menu size={24} color="var(--sz-blue-900)" />
        </button>
        <div className="flex items-center gap-2">
          {/* Suzuki Logo Placeholder */}
          <div style={{ 
            width: 36, 
            height: 36, 
            background: 'var(--sz-red)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: 800, 
            fontSize: '24px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(213, 0, 0, 0.3)'
          }}>
            S
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="title" style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1 }}>Suzuki Indomobil</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Work Around Body</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3" style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '24px' }}>
          <Car size={18} color="var(--sz-blue-700)" />
          <span style={{ color: 'var(--sz-blue-900)', fontWeight: 600, fontSize: '0.9rem' }}>Ertiga - B 1234 ABC</span>
        </div>
        <div className="flex items-center gap-3" style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--sz-blue-900)' }}>Budi Santoso</div>
            <div className="subtitle" style={{ fontSize: '0.75rem', color: 'var(--sz-blue-500)' }}>Service Advisor</div>
          </div>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--sz-blue-500), var(--sz-blue-900))',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 35, 90, 0.2)'
          }}>
            <User size={20} color="white" />
          </div>
        </div>
      </div>
    </header>
  );
}
