import React, { useState } from 'react';
import { Car, List, Users, FileText, Wrench, History, ChevronDown, ChevronRight, LayoutDashboard, RefreshCw, Tv, Package, PanelLeft, TrendingUp, User } from 'lucide-react';
import { useLanguageTheme } from '../utility/context/LanguageThemeContext';

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  activeTab,
  setActiveTab,
  currentUserRole,
  bookingsCount,
  ticketsCount,
  historyCount
}) {
  const { t } = useLanguageTheme();
  const [isWabOpen, setIsWabOpen] = useState(true);
  const [isDrhOpen, setIsDrhOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleWab = () => {
    if (!isWabOpen) {
      setIsWabOpen(true);
      setIsDrhOpen(false);
    } else {
      setIsWabOpen(false);
    }
  };

  const handleToggleDrh = () => {
    if (!isDrhOpen) {
      setIsDrhOpen(true);
      setIsWabOpen(false);
    } else {
      setIsDrhOpen(false);
    }
  };

  const handleSelectTab = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'drh-dashboard') {
      setIsDrhOpen(true);
      setIsWabOpen(false);
    } else if (tabKey === 'sparepart') {
      setIsWabOpen(false);
      setIsDrhOpen(false);
    } else {
      setIsWabOpen(true);
      setIsDrhOpen(false);
    }
  };

  const isEffectiveCollapsed = isSidebarCollapsed && !isHovered;

  const isWabTab = ['bookings', 'daftar-tamu', 'wab-form', 'foreman', 'rka', 'tv-display', 'history'].includes(activeTab);
  const isDrhTab = ['drh-dashboard'].includes(activeTab);

  const isWabParentActive = isEffectiveCollapsed && isWabTab;
  const isDrhParentActive = isEffectiveCollapsed && isDrhTab;

  const logoSrc = isEffectiveCollapsed ? '/assets/logos/s_logo.svg' : '/assets/logos/suzuki_logo.svg';

  return (
    <aside
      className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarCollapsed && isHovered ? 'hover-expanded' : ''}`}
      onMouseEnter={() => isSidebarCollapsed && setIsHovered(true)}
      onMouseLeave={() => isSidebarCollapsed && setIsHovered(false)}
    >
      <div
        className="sidebar-brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isEffectiveCollapsed ? 'center' : 'space-between',
          width: '100%',
          padding: isEffectiveCollapsed ? '0' : '0 0.65rem 0 1.25rem',
          boxSizing: 'border-box'
        }}
      >
        <img
          src={logoSrc}
          alt="Suzuki Logo"
          style={{
            height: isEffectiveCollapsed ? '36px' : '58px',
            maxHeight: '64px',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        {setIsSidebarCollapsed && (
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: isEffectiveCollapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.2rem',
              borderRadius: '6px',
              flexShrink: 0
            }}
          >
            <PanelLeft size={18} color="#676767ff" />
          </button>
        )}
      </div>

      <div>
        <div
          className={`sidebar-nav-item ${isWabParentActive ? 'active' : ''}`}
          onClick={handleToggleWab}
          style={{ cursor: 'pointer' }}
          title={t('navWabSystem')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Car size={17} color="#0f172a" />
            <span className="sidebar-label-text" style={{ fontWeight: 700 }}>{t('navWabSystem')}</span>
          </div>
          <span className="sidebar-arrow" style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {isWabOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </div>

        <div className={`sidebar-sub-nav ${isWabOpen && !isEffectiveCollapsed ? 'open' : ''}`}>
          {(currentUserRole === 'Security' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => handleSelectTab('bookings')} title={t('navBooking')}>
              <List size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'bookings' ? 1 : 0.6, flexShrink: 0 }} />
              <span className="sidebar-label-text">{t('navBooking')}</span>
              <span className="sidebar-count-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({bookingsCount})</span>
            </div>
          )}

          {(currentUserRole === 'Security' || currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'daftar-tamu' ? 'active' : ''}`} onClick={() => handleSelectTab('daftar-tamu')} title={t('navDaftarTamu')}>
              <Users size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'daftar-tamu' ? 1 : 0.6, flexShrink: 0 }} />
              <span className="sidebar-label-text">{t('navDaftarTamu')}</span>
              <span className="sidebar-count-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({ticketsCount})</span>
            </div>
          )}

          {(currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'wab-form' ? 'active' : ''}`} onClick={() => handleSelectTab('wab-form')} title={t('navFormWAB')}>
              <FileText size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'wab-form' ? 1 : 0.6, flexShrink: 0 }} />
              <span className="sidebar-label-text">{t('navFormWAB')}</span>
            </div>
          )}

          {(currentUserRole === 'Foreman' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'foreman' ? 'active' : ''}`} onClick={() => handleSelectTab('foreman')} title={t('navForeman')}>
              <Wrench size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'foreman' ? 1 : 0.6, flexShrink: 0 }} />
              <span className="sidebar-label-text">{t('navForeman')}</span>
            </div>
          )}

          {(currentUserRole === 'CCM' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'rka' ? 'active' : ''}`} onClick={() => handleSelectTab('rka')} title={t('navRKA')}>
              <TrendingUp size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'rka' ? 1 : 0.6, flexShrink: 0 }} />
              <span className="sidebar-label-text">{t('navRKA')}</span>
            </div>
          )}

          <div className={`sidebar-sub-item ${activeTab === 'tv-display' ? 'active' : ''}`} onClick={() => handleSelectTab('tv-display')} title={t('navTVDisplay')}>
            <Tv size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'tv-display' ? 1 : 0.6, flexShrink: 0 }} />
            <span className="sidebar-label-text">{t('navTVDisplay')}</span>
          </div>

          <div className={`sidebar-sub-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleSelectTab('history')} title={t('navHistory')}>
            <History size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'history' ? 1 : 0.6, flexShrink: 0 }} />
            <span className="sidebar-label-text">
              {t('navHistory')}
            </span>
            <span className="sidebar-count-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({historyCount})</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <div
          className={`sidebar-nav-item ${isDrhParentActive ? 'active' : ''}`}
          onClick={handleToggleDrh}
          style={{ cursor: 'pointer' }}
          title="DRH System"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <RefreshCw size={17} color="#0f172a" />
            <span className="sidebar-label-text" style={{ fontWeight: 700 }}>DRH System</span>
          </div>
          <span className="sidebar-arrow" style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {isDrhOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </div>

        <div className={`sidebar-sub-nav ${isDrhOpen && !isEffectiveCollapsed ? 'open' : ''}`}>
          <div className={`sidebar-sub-item ${activeTab === 'drh-dashboard' ? 'active' : ''}`} onClick={() => handleSelectTab('drh-dashboard')} title="Dashboard">
            <LayoutDashboard size={14} style={{ marginRight: '0.5rem', opacity: activeTab === 'drh-dashboard' ? 1 : 0.6, flexShrink: 0 }} />
            <span className="sidebar-label-text">Dashboard</span>
          </div>
        </div>
      </div>

      <div
        className={`sidebar-nav-item ${activeTab === 'sparepart' ? 'active' : ''}`}
        onClick={() => handleSelectTab('sparepart')}
        style={{ cursor: 'pointer' }}
        title="Modul Sparepart"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Package size={17} color="#0f172a" />
          <span className="sidebar-label-text" style={{ fontWeight: 700 }}>Sparepart</span>
        </div>
      </div>
    </aside>
  );
}
