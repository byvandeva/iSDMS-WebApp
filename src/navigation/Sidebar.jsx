import React, { useState } from 'react';
import { Car, List, Users, FileText, Wrench, History, ChevronDown, ChevronRight, LayoutDashboard, RefreshCw, Tv, Package } from 'lucide-react';

export default function Sidebar({
  isSidebarCollapsed,
  activeTab,
  setActiveTab,
  currentUserRole,
  bookingsCount,
  ticketsCount,
  historyCount
}) {
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
    } else if (tabKey === 'tv-display' || tabKey === 'sparepart') {
      setIsWabOpen(false);
      setIsDrhOpen(false);
    } else {
      setIsWabOpen(true);
      setIsDrhOpen(false);
    }
  };

  const isEffectiveCollapsed = isSidebarCollapsed && !isHovered;

  return (
    <aside
      className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarCollapsed && isHovered ? 'hover-expanded' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-brand">
        <img
          src={isEffectiveCollapsed ? "/s_logo.svg" : "/suzuki_logo.svg"}
          alt="Suzuki Logo"
          style={{ height: '32px', objectFit: 'contain' }}
        />
      </div>

      <div className="sidebar-section-title">Modul Servis &amp; Bengkel</div>

      <div
        className={`sidebar-nav-item ${isWabOpen ? 'active' : ''}`}
        onClick={handleToggleWab}
        style={{ cursor: 'pointer' }}
        title="WAB System"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Car size={17} color="#0f172a" />
          <span className="sidebar-label-text" style={{ fontWeight: 700 }}>WAB System</span>
        </div>
        <span className="sidebar-arrow" style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {isWabOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </div>

      {isWabOpen && (
        <div className="sidebar-sub-nav">
          {(currentUserRole === 'Security' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => handleSelectTab('bookings')} title="List Booking">
              <List size={15} color="#0f172a" />
              <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>List Booking</span>
              <span className="sidebar-count-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({bookingsCount})</span>
            </div>
          )}

          {(currentUserRole === 'Security' || currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'daftar-tamu' ? 'active' : ''}`} onClick={() => handleSelectTab('daftar-tamu')} title="Daftar Tamu">
              <Users size={15} color="#0f172a" />
              <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>Daftar Tamu</span>
              <span className="sidebar-count-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({ticketsCount})</span>
            </div>
          )}

          {(currentUserRole === 'ServiceAdvisor' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'wab-form' ? 'active' : ''}`} onClick={() => handleSelectTab('wab-form')} title="Form WAB">
              <FileText size={15} color="#0f172a" />
              <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>Form WAB</span>
            </div>
          )}

          {(currentUserRole === 'Foreman' || currentUserRole === 'Admin') && (
            <div className={`sidebar-sub-item ${activeTab === 'foreman' ? 'active' : ''}`} onClick={() => handleSelectTab('foreman')} title="Workshop Board">
              <Wrench size={15} color="#0f172a" />
              <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>Workshop Board</span>
            </div>
          )}

          <div className={`sidebar-sub-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleSelectTab('history')} title="Riwayat">
            <History size={15} color="#0f172a" />
            <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>
              {currentUserRole === 'Security' ? 'Riwayat Check-Out' :
               currentUserRole === 'ServiceAdvisor' ? 'Riwayat WAB' :
               currentUserRole === 'Foreman' ? 'Riwayat Workshop' : 'Riwayat Sistem'}
            </span>
            <span className="sidebar-count-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({historyCount})</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: '0.25rem' }}>
        <div
          className={`sidebar-nav-item ${isDrhOpen ? 'active' : ''}`}
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

        {isDrhOpen && (
          <div className="sidebar-sub-nav">
            <div className={`sidebar-sub-item ${activeTab === 'drh-dashboard' ? 'active' : ''}`} onClick={() => handleSelectTab('drh-dashboard')} title="Dashboard">
              <LayoutDashboard size={15} color="#0f172a" />
              <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>Dashboard</span>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-section-title" style={{ marginTop: '1rem' }}>Modul Tambahan</div>

      <div
        className={`sidebar-nav-item ${activeTab === 'tv-display' ? 'active' : ''}`}
        onClick={() => handleSelectTab('tv-display')}
        style={{ cursor: 'pointer' }}
        title="TV Display Lounge"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Tv size={17} color="#0f172a" />
          <span className="sidebar-label-text" style={{ fontWeight: 700 }}>TV Display Lounge</span>
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
