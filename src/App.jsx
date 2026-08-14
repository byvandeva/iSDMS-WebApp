import React, { useState, useMemo, useEffect } from 'react';
import { User, LogOut, ChevronDown, Globe } from 'lucide-react';

import { AuthProvider, useAuth } from './utility/hooks/useAuth';
import { AppDataProvider, useAppData } from './utility/context/AppDataContext';
import { WabFormProvider } from './utility/context/WabFormContext';
import { LanguageThemeProvider, useLanguageTheme } from './utility/context/LanguageThemeContext';

import { useTicketActions } from './pages/services/wab/hooks/useTicketActions';
import { getPurposeString, getStatusString } from './utility/utils/formatters';
import GlobalModals from './utility/components/GlobalModals';

import Sidebar from './navigation/Sidebar';
import LoginPage from './pages/auth/Login';

import BookingListTab from './pages/services/wab/tabs/Bookings';
import GuestListTab from './pages/services/wab/tabs/Guests';
import HistoryTab from './pages/services/wab/tabs/History';
import ForemanTab from './pages/services/wab/tabs/Foreman';
import FormWAB from './pages/services/wab/tabs/FormWAB';
import TvDisplayPage from './pages/tv-display/Index';
import SparepartPage from './pages/sparepart/Index';
import DrhDashboard from './pages/services/drh/tabs/Index';
import RkaPage from './pages/rka/Index';
import AccountPage from './pages/account/Index';

const TAB_LABELS = {
  bookings: 'navBooking', 'daftar-tamu': 'navDaftarTamu',
  'wab-form': 'navFormWAB', foreman: 'navForeman',
  rka: 'navRKA', 'tv-display': 'navTVDisplay',
  account: 'navAccount', sparepart: 'navSparepart', history: 'navHistory',
};

const SECTION_LABELS = {
  'drh-dashboard': 'DRH System', account: 'Akun', sparepart: 'Sparepart',
};

function AppShell() {
  const { language, cycleLanguage, t } = useLanguageTheme();
  const { isLoggedIn, currentUserRole, isProfileDropdownOpen, setIsProfileDropdownOpen, handleLogout } = useAuth();
  const { bookings, tickets, historyTickets, toast, setToast, showToast } = useAppData();

  const [activeTab, setActiveTab] = useState('daftar-tamu');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  const {
    editingTicket, setEditingTicket,
    editForm, setEditForm,
    checkoutTargetTicket, setCheckoutTargetTicket,
    successCheckInModal, setSuccessCheckInModal,
    selectedWabDetailTicket, setSelectedWabDetailTicket,
    handleCheckInFromBooking,
    handleCheckInSubmit,
    handleOpenEditPurposeModal,
    handleSaveEditPurpose,
    handleStartWab,
    handleOpenCheckOutModal,
    handleConfirmCheckOutWeb,
    handleFinalizeWab,
    handleUpdateForemanTracking,
    handleFinishJob,
  } = useTicketActions({ setActiveTab });

  useEffect(() => {
    if (currentUserRole === 'ServiceAdvisor' && (activeTab === 'bookings' || activeTab === 'foreman')) {
      setActiveTab('daftar-tamu');
    } else if (currentUserRole === 'Foreman' && (activeTab === 'bookings' || activeTab === 'daftar-tamu' || activeTab === 'wab-form')) {
      setActiveTab('foreman');
    } else if (currentUserRole === 'Security' && (activeTab === 'wab-form' || activeTab === 'foreman')) {
      setActiveTab('bookings');
    } else if (currentUserRole === 'CCM' && activeTab !== 'rka' && activeTab !== 'account') {
      setActiveTab('rka');
    }
  }, [currentUserRole, activeTab]);

  const calculatedTicketsCount = useMemo(() => tickets.filter(t => t.status !== 'CheckedOut').length, [tickets]);

  const calculatedHistoryCount = useMemo(() => {
    const checkedOutInTickets = tickets.filter(t => t.status === 'CheckedOut' || t.status === '8').length;
    if (currentUserRole === 'ServiceAdvisor') {
      return tickets.filter(t => t.wabSubmitted || t.status === 'Inspected' || t.status === 'WabDone').length;
    }
    if (currentUserRole === 'Foreman') {
      const foremanStatuses = ['ServiceCompleted', 'PreHandoverReady', 'HandoverCompleted', 'CheckedOut', '5', '6', '7', '8'];
      return tickets.filter(t => foremanStatuses.includes(String(t.status))).length + historyTickets.length;
    }
    return historyTickets.length + checkedOutInTickets;
  }, [currentUserRole, tickets, historyTickets]);

  const isTvMode = typeof window !== 'undefined' && window.location.search.includes('mode=tv');
  if (isTvMode) return <TvDisplayPage tickets={tickets} />;
  if (!isLoggedIn) return <LoginPage toast={toast} />;

  const sectionLabel = SECTION_LABELS[activeTab] || 'WAB System';
  const tabKey = TAB_LABELS[activeTab];
  const roleName = currentUserRole === 'ServiceAdvisor' ? 'Service Advisor' : currentUserRole === 'Security' ? 'Security Gate' : 'Admin Portal';

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '1.25rem', right: '1.5rem', zIndex: 9999, background: '#ffffff', border: toast.type === 'error' ? '1px solid #fecdd3' : '1px solid #bbf7d0', borderLeft: toast.type === 'error' ? '4px solid #be123c' : '4px solid #16a34a', borderRadius: '6px', padding: '0.85rem 1.25rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '340px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: toast.type === 'error' ? '#ffe4e6' : '#dcfce7', color: toast.type === 'error' ? '#be123c' : '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
            {toast.type === 'error' ? '✕' : '✓'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{toast.title}</div>
            {toast.message && <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '2px' }}>{toast.message}</div>}
          </div>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', padding: 0, lineHeight: 1 }}>&times;</button>
        </div>
      )}

      <div className="app-layout">
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}
          activeTab={activeTab} setActiveTab={setActiveTab} currentUserRole={currentUserRole}
          bookingsCount={bookings.length} ticketsCount={calculatedTicketsCount} historyCount={calculatedHistoryCount}
        />

        <div className="main-wrapper">
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>SDMS</span>
              <span>/</span>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{sectionLabel}</span>
              <span>/</span>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>{tabKey ? t(tabKey) : 'Dashboard'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.65rem', borderRadius: '8px', border: 'none', background: isProfileDropdownOpen ? '#f1f5f9' : 'transparent', cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s ease' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseOut={e => e.currentTarget.style.background = isProfileDropdownOpen ? '#f1f5f9' : 'transparent'}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={15} color="#ffffff" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>{roleName}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Suzuki Staff</span>
                  </div>
                  <ChevronDown size={14} color="#64748b" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                </div>

                {isProfileDropdownOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '210px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', zIndex: 1000, overflow: 'hidden' }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{roleName}</div>
                    </div>
                    <div style={{ padding: '0.35rem' }}>
                      <div
                        onClick={() => { setIsProfileDropdownOpen(false); setActiveTab('account'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', borderRadius: '5px', fontSize: '0.825rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer', transition: 'background 0.15s ease', marginBottom: '2px' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <User size={15} color="#0f172a" />
                        <span>{t('profilAkun')}</span>
                      </div>
                      <div
                        onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', borderRadius: '5px', fontSize: '0.825rem', fontWeight: 600, color: '#be123c', cursor: 'pointer', transition: 'background 0.15s ease' }}
                        onMouseOver={e => e.currentTarget.style.background = '#fff1f2'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={15} color="#be123c" />
                        <span>{t('logout')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="content">
            {activeTab === 'drh-dashboard' && <DrhDashboard />}
            {activeTab === 'bookings' && <BookingListTab bookings={bookings} onOpenWalkInModal={() => setShowWalkInModal(true)} onCheckInFromBooking={handleCheckInFromBooking} getPurposeString={getPurposeString} />}
            {activeTab === 'daftar-tamu' && <GuestListTab tickets={tickets} currentUserRole={currentUserRole} onOpenWalkInModal={() => setShowWalkInModal(true)} getPurposeString={getPurposeString} getStatusString={getStatusString} onStartWab={handleStartWab} onOpenEditModal={handleOpenEditPurposeModal} onOpenCheckOutModal={handleOpenCheckOutModal} />}
            {activeTab === 'history' && <HistoryTab currentUserRole={currentUserRole} tickets={tickets} historyTickets={historyTickets} onSelectTicket={setSelectedWabDetailTicket} />}
            {activeTab === 'wab-form' && <FormWAB getPurposeString={getPurposeString} setActiveTab={setActiveTab} showToast={showToast} handleFinalizeWab={handleFinalizeWab} />}
            {activeTab === 'foreman' && <ForemanTab tickets={tickets} getStatusString={getStatusString} onFinishJob={handleFinishJob} onUpdateTracking={handleUpdateForemanTracking} />}
            {activeTab === 'tv-display' && <TvDisplayPage tickets={tickets} />}
            {activeTab === 'sparepart' && <SparepartPage />}
            {activeTab === 'rka' && <RkaPage />}
            {activeTab === 'account' && <AccountPage currentUserRole={currentUserRole} onLogout={handleLogout} />}
          </div>
        </div>
      </div>

      <GlobalModals
        showWalkInModal={showWalkInModal} onCloseWalkInModal={() => setShowWalkInModal(false)} onCheckInSubmit={handleCheckInSubmit}
        editingTicket={editingTicket} editForm={editForm} setEditForm={setEditForm} onCloseEditModal={() => setEditingTicket(null)} onSaveEditPurpose={handleSaveEditPurpose}
        checkoutTargetTicket={checkoutTargetTicket} onCloseCheckOut={() => setCheckoutTargetTicket(null)} onConfirmCheckOut={handleConfirmCheckOutWeb}
        selectedWabDetailTicket={selectedWabDetailTicket} onCloseWabDetail={() => setSelectedWabDetailTicket(null)}
        successCheckInModal={successCheckInModal} onCloseSuccessModal={() => setSuccessCheckInModal(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageThemeProvider>
      <AuthProvider onRoleChange={() => { }}>
        <AppDataProvider>
          <WabFormProvider>
            <AppShell />
          </WabFormProvider>
        </AppDataProvider>
      </AuthProvider>
    </LanguageThemeProvider>
  );
}
