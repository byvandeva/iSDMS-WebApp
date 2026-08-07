import React, { useState } from 'react';
import { Car, List, Users, FileText, Wrench, History, ChevronDown, ChevronRight, LayoutDashboard, RefreshCw } from 'lucide-react';

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
  const [isDrhOpen, setIsDrhOpen] = useState(false); // Default: DRH closed when WAB is active
  const [isHovered, setIsHovered] = useState(false);

  // Exclusive Accordion Handlers (Opening WAB closes DRH and vice versa)
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

  // Automatically keep the corresponding accordion active when switching tabs
  const handleSelectTab = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'drh-dashboard') {
      setIsDrhOpen(true);
      setIsWabOpen(false);
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

      <div className="sidebar-section-title">Modul Servis & Bengkel</div>

      {/* 1. MAIN WAB TAB GROUP (MUTUAL EXCLUSIVE ACCORDION) */}
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

      {/* WAB SUB-MODULES NAV LINKS */}
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

          <div className={`sidebar-sub-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleSelectTab('history')} title="Riwayat Check-Out">
            <History size={15} color="#0f172a" />
            <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>Riwayat Check-Out</span>
            <span className="sidebar-count-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>({historyCount})</span>
          </div>
        </div>
      )}

      {/* 2. DRH SYSTEM GROUP (TIGHTER SPACING & MUTUAL EXCLUSIVE ACCORDION) */}
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

        {/* DRH SUB-MODULES NAV LINKS */}
        {isDrhOpen && (
          <div className="sidebar-sub-nav">
            <div className={`sidebar-sub-item ${activeTab === 'drh-dashboard' ? 'active' : ''}`} onClick={() => handleSelectTab('drh-dashboard')} title="Dashboard">
              <LayoutDashboard size={15} color="#0f172a" />
              <span className="sidebar-label-text" style={{ marginLeft: '0.5rem' }}>Dashboard</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
