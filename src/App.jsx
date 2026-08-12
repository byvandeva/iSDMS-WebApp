import React, { useState, useCallback, useMemo } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';

import { checkInVehicle, submitWabForm, updateForemanTracking, updateWorkshopStatus, checkOutVehicle } from './pages/services/wab/api';

import { AuthProvider, useAuth } from './utility/hooks/useAuth';
import { AppDataProvider, useAppData } from './utility/context/AppDataContext';
import { WabFormProvider } from './utility/context/WabFormContext';
import { useWabForm } from './utility/context/useWabForm';

import Sidebar from './navigation/Sidebar';
import LoginPage from './pages/auth/Login';

import BookingListTab from './pages/services/wab/tabs/Bookings';
import GuestListTab from './pages/services/wab/tabs/Guests';
import HistoryTab from './pages/services/wab/tabs/History';
import ForemanTab from './pages/services/wab/tabs/Foreman';
import FormWAB from './pages/services/wab/tabs/FormWAB';
import WalkInModal from './pages/services/wab/modals/WalkInModal';
import EditTicketModal from './pages/services/wab/modals/EditTicketModal';
import CheckOutModal from './pages/services/wab/modals/CheckOutModal';
import WabDetailModal from './pages/services/wab/modals/WabDetailModal';

import TvDisplayPage from './pages/tv-display/Index';
import SparepartPage from './pages/sparepart/Index';
import DrhDashboard from './pages/services/drh/tabs/Index';
import RkaPage from './pages/rka/Index';
import AccountPage from './pages/account/Index';

const getPurposeString = (purpose) => {
  if (purpose === null || purpose === undefined || purpose === '') return 'Service';
  let raw = typeof purpose === 'object' ? (purpose.id || purpose.label || purpose.name || '') : purpose;
  let str = String(raw).trim();
  if (str === '0' || str.toLowerCase() === 'service') return 'Service';
  if (str === '1' || str.toLowerCase() === 'sales') return 'Sales';
  if (str === '2' || str.toLowerCase() === 'bodyrepair' || str.toLowerCase() === 'body repair') return 'BodyRepair';
  if (str === '3' || str.toLowerCase() === 'sparepart' || str.toLowerCase() === 'spare part') return 'SparePart';
  return str || 'Service';
};

const getStatusString = (status) => {
  if (status === null || status === undefined || status === '') return 'Check-In';
  const s = String(status).toLowerCase().trim();
  if (s === '0' || s === 'checkedin') return 'Check-In';
  if (s === '1' || s === 'inspected') return 'Form WAB Selesai';
  if (s === '2' || s === 'assignedtostall') return 'Dikerjakan';
  if (s === '3' || s === 'inservice') return 'Dikerjakan';
  if (s === '4' || s === 'pendingadditionalapproval') return 'Menunggu Approval';
  if (s === '5' || s === 'servicecompleted') return 'Selesai';
  if (s === '6' || s === 'prehandoverready') return 'Siap Penyerahan';
  if (s === '7' || s === 'handovercompleted') return 'Selesai Handover';
  if (s === '8' || s === 'checkedout') return 'Check-Out';
  return String(status);
};

function AppShell() {
  const { isLoggedIn, currentUserRole, isProfileDropdownOpen, setIsProfileDropdownOpen, handleLogout, handleQuickLogin } = useAuth();
  const { bookings, setBookings, tickets, setTickets, historyTickets, setHistoryTickets, toast, setToast, showToast } = useAppData();
  const {
    wabStep, setWabStep,
    selectedTicket, setSelectedTicket,
    saCustomerName, setSaCustomerName,
    saCustomerPhone, setSaCustomerPhone,
    saCustomerAddress, setSaCustomerAddress,
    customerComplaints, setCustomerComplaints,
    signatureData, setSignatureData,
    saSignatureData, setSaSignatureData,
    damages, setDamages,
    exteriorTextNotes, setExteriorTextNotes,
    newTextCategory, setNewTextCategory,
    newTextNote, setNewTextNote,
    functionalInspections,
    isModalOpen, setIsModalOpen,
    selectedContext, setSelectedContext,
    focusFrame,
    showExteriorModal, setShowExteriorModal,
    handleFunctionalChange,
    handleAddTextNote,
    handleRemoveTextNote,
    handlePartClick,
    handleSaveDamage,
    handleRemoveDamage,
    handleDamageClick,
    handleEditDamage,
    handleSaveExteriorInspection,
    resetWabForm
  } = useWabForm();

  const ROLE_DEFAULT_TABS = {
    Admin: 'bookings',
    Security: 'bookings',
    ServiceAdvisor: 'daftar-tamu',
    Foreman: 'foreman',
    CCM: 'rka'
  };

  const [activeTab, setActiveTab] = useState('daftar-tamu');
  const [isWabOpen, setIsWabOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [checkInForm, setCheckInForm] = useState({ sdmsBookingId: '', licensePlate: '', vehicleModel: '', serviceType: 'Periodic Service', arrivalPurpose: 'Service' });
  const [editingTicket, setEditingTicket] = useState(null);
  const [editForm, setEditForm] = useState({ licensePlate: '', vehicleModel: '', arrivalPurpose: 'Service' });
  const [checkoutTargetTicket, setCheckoutTargetTicket] = useState(null);
  const [successCheckInModal, setSuccessCheckInModal] = useState(null);
  const [selectedWabDetailTicket, setSelectedWabDetailTicket] = useState(null);
  const [foremanForm, setForemanForm] = useState({ ticketId: '', stallName: 'Stall 01', technicianName: 'Budi (Teknisi 1)', foremanRecommendation: 'Ganti oli mesin & balancing roda depan', addExtraMinutes: 30 });

  React.useEffect(() => {
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

  const executeCheckInProcess = useCallback(async (data, type = 'walkin') => {
    try {
      const result = await checkInVehicle(data);
      const ticketId = result?.ticketId || result?.TicketId;
      if (result && ticketId) {
        setTickets(prev => {
          const exists = prev.some(t => (t.ticketId || t.TicketId) === ticketId);
          return exists ? prev : [result, ...prev];
        });
        if (type === 'booking' && data.sdmsBookingId) {
          setBookings(prev => prev.filter(item => item.sdmsBookingId !== data.sdmsBookingId));
        }
        if (type === 'walkin') {
          setCheckInForm({ sdmsBookingId: '', licensePlate: '', vehicleModel: '', serviceType: 'Periodic Service', arrivalPurpose: 'Service' });
        }

        const qNum = result.queueNumber || result.QueueNumber || (getPurposeString(result.arrivalPurpose).toLowerCase() === 'service' ? 'W-001' : null);
        const plate = (result.licensePlate || result.LicensePlate || data.licensePlate).toUpperCase();
        const purpose = getPurposeString(result.arrivalPurpose || data.arrivalPurpose);

        setSuccessCheckInModal({ queueNumber: qNum, licensePlate: plate, purpose });
        setTimeout(() => setSuccessCheckInModal(null), 2500);
      } else {
        showToast('Check-In Gagal', 'Gagal menyimpan data check-in ke server.', 'error');
      }
    } catch (e) {
      showToast('Koneksi Gagal', 'Terjadi kesalahan sistem backend.', 'error');
    }
  }, [setTickets, setBookings, showToast]);

  const handleCheckInFromBooking = useCallback((b) => {
    const data = {
      sdmsBookingId: b.sdmsBookingId || b.bookingNo,
      bookingNo: b.bookingNo || b.sdmsBookingId,
      queueNumber: b.bookingNo || b.sdmsBookingId || b.queueNumber,
      licensePlate: b.policeRegNo || b.licensePlate || 'B 1697 TYK',
      policeRegNo: b.policeRegNo || b.licensePlate || 'B 1697 TYK',
      vehicleModel: b.groupCode || b.vehicleModel || 'SWIFT (CBU)',
      groupCode: b.groupCode || b.vehicleModel || 'SWIFT (CBU)',
      serviceType: b.jobType || b.serviceType || 'PAKET 10.000 KM',
      jobType: b.jobType || b.serviceType || 'PAKET 10.000 KM',
      arrivalPurpose: 'Service',
      customerName: b.customerName || b.CustomerName || '-',
      telponNo: b.telponNo || b.customerPhone || '-',
      customerPhone: b.telponNo || b.customerPhone || '-',
      categoryPassComm: b.categoryPassComm || 'Passenger',
      reservasiTime: b.reservasiTime || b.bookingTime || b.ReservasiTime || '09:30',
      bookingTime: b.reservasiTime || b.bookingTime || b.ReservasiTime || '09:30',
      reservasiDate: b.reservasiDate || b.ReservasiDate || null,
    };
    executeCheckInProcess(data, 'booking');
  }, [executeCheckInProcess]);

  const handleCheckInSubmit = useCallback((dataOrEvent) => {
    if (dataOrEvent && typeof dataOrEvent.preventDefault === 'function') dataOrEvent.preventDefault();
    const formData = (dataOrEvent && dataOrEvent.licensePlate) ? dataOrEvent : checkInForm;
    if (!formData || !formData.licensePlate) return;
    setShowWalkInModal(false);
    executeCheckInProcess(formData, 'walkin');
  }, [checkInForm, executeCheckInProcess]);

  const handleOpenEditPurposeModal = useCallback((ticket) => {
    setEditingTicket(ticket);
    setEditForm({ licensePlate: ticket.licensePlate || '', vehicleModel: ticket.vehicleModel || 'Suzuki XL7 Alpha', arrivalPurpose: ticket.arrivalPurpose || 'Service' });
  }, []);

  const handleSaveEditPurpose = useCallback(async () => {
    if (!editingTicket) return;
    if (!editForm.licensePlate) { showToast('Form Belum Lengkap', 'Nomor Polisi wajib diisi!', 'error'); return; }
    const isService = editForm.arrivalPurpose === 'Service';
    setTickets(prev => prev.map(t => {
      if (t.ticketId === editingTicket.ticketId) {
        return { ...t, licensePlate: editForm.licensePlate.toUpperCase(), vehicleModel: editForm.vehicleModel, arrivalPurpose: editForm.arrivalPurpose, queueNumber: isService ? (t.queueNumber || 'W-' + Math.floor(100 + Math.random() * 900)) : null };
      }
      return t;
    }));
    setEditingTicket(null);
    showToast('Edit Berhasil!', `Data kendaraan ${editForm.licensePlate.toUpperCase()} berhasil diperbarui.`);
  }, [editingTicket, editForm, setTickets, showToast]);

  const handleStartWab = useCallback(async (ticket) => {
    const purposeStr = getPurposeString(ticket.arrivalPurpose);
    if (purposeStr.toLowerCase() !== 'service') {
      showToast("Akses Terbatas", "Hanya tujuan kedatangan Service yang dapat mengisi Form WAB.", "error");
      return;
    }

    const isWabDone = ticket.status === 'Inspected' || ticket.status === 'WabDone' || ticket.wabSubmitted;
    if (isWabDone) {
      setSelectedWabDetailTicket(ticket);
      return;
    }

    setSelectedTicket(ticket);
    setSaCustomerName((!ticket.customerName || ticket.customerName === '-') ? '' : ticket.customerName);
    setSaCustomerPhone(ticket.customerPhone === '-' ? '' : (ticket.customerPhone || ''));
    setSaCustomerAddress(ticket.customerAddress || '');
    setCustomerComplaints(ticket.customerComplaints || '');
    setDamages(ticket.damages || []);
    setWabStep(1);
    setIsWabOpen(true);
    setActiveTab('wab-form');

    setTickets(prev => prev.map(t => (t.ticketId === ticket.ticketId ? { ...t, status: 'WabInProgress' } : t)));
    showToast('Form WAB (SA)', `Proses WAB dimulai untuk Kendaraan Plat: ${ticket.licensePlate}`);
  }, [setSelectedTicket, setSaCustomerName, setSaCustomerPhone, setSaCustomerAddress, setCustomerComplaints, setDamages, setWabStep, setTickets, showToast]);

  const handleOpenCheckOutModal = useCallback((ticket) => {
    setCheckoutTargetTicket(ticket);
  }, []);

  const handleConfirmCheckOutWeb = useCallback(async () => {
    if (!checkoutTargetTicket) return;
    const target = checkoutTargetTicket;
    setCheckoutTargetTicket(null);

    try {
      await checkOutVehicle({ ticketId: target.ticketId });
      const checkedOutItem = { ...target, status: 'CheckedOut', checkOutTime: new Date().toISOString() };
      setHistoryTickets(prev => [checkedOutItem, ...prev]);
      setTickets(prev => prev.filter(t => t.ticketId !== target.ticketId));

      setSuccessCheckInModal({ title: 'Check-Out Berhasil!', licensePlate: target.licensePlate, queueNumber: null, details: `Kendaraan ${target.licensePlate} telah rilis dari gerbang & dipindahkan ke Riwayat.` });
      setTimeout(() => setSuccessCheckInModal(null), 2500);
    } catch (e) {
      showToast('Check-Out Gagal', 'Gagal melakukan proses check-out.', 'error');
    }
  }, [checkoutTargetTicket, setHistoryTickets, setTickets, showToast]);

  const handleFinalizeWab = useCallback(async () => {
    if (!selectedTicket) return;
    if (!saCustomerName) return showToast('Form Belum Lengkap', 'Mohon lengkapi Nama Pelanggan di Step 1 WAB!', 'error');

    try {
      await submitWabForm({ ticketId: selectedTicket.ticketId, customerName: saCustomerName, customerPhone: saCustomerPhone, customerComplaints, damages, exteriorTextNotes: exteriorTextNotes.filter(n => n.note.trim() !== ''), customerSignatureUrl: "data:image/png;base64,sample_signature_canvas_data" });
    } catch (e) {}

    setTickets(prev => prev.map(t => t.ticketId === selectedTicket.ticketId ? { ...t, status: 'Inspected', wabSubmitted: true, customerName: saCustomerName, customerPhone: saCustomerPhone, customerComplaints, damages } : t));
    showToast('Form WAB Terkirim!', 'Data WAB 5-step berhasil dikirim & diteruskan ke Foreman.');
    resetWabForm();
    setActiveTab('daftar-tamu');
  }, [selectedTicket, saCustomerName, saCustomerPhone, customerComplaints, damages, exteriorTextNotes, setTickets, showToast, resetWabForm]);

  const handleUpdateForemanTracking = useCallback(async (payload) => {
    let data;
    if (payload && payload.preventDefault) {
      payload.preventDefault();
      data = foremanForm;
    } else {
      data = payload || foremanForm;
    }

    if (!data || !data.ticketId) {
      showToast('Perhatian', 'Pilih tiket terlebih dahulu', 'error');
      return;
    }

    try {
      await updateForemanTracking(data);
    } catch (e) {}

    setTickets(prev => prev.map(t => {
      if (t.ticketId === data.ticketId) {
        return {
          ...t,
          status: 'InService',
          stallName: data.stallName || t.stallName,
          technicianName: data.technicianName || t.technicianName,
          foremanRecommendation: data.foremanRecommendation || t.foremanRecommendation,
          foremanExtraMinutes: (t.foremanExtraMinutes || 0) + (Number(data.addExtraMinutes) || 0),
        };
      }
      return t;
    }));

    showToast('Tracking Diperbarui!', 'Estimasi & rekomendasi Foreman berhasil disimpan & dikirim ke TV Display.');
  }, [foremanForm, setTickets, showToast]);

  const handleFinishJob = useCallback(async (ticketId) => {
    if (!ticketId) return;

    try {
      await updateWorkshopStatus({ ticketId, status: 'ServiceCompleted' });
    } catch (e) {}

    setTickets(prev => prev.map(t => {
      if (t.ticketId === ticketId) {
        return {
          ...t,
          status: 'ServiceCompleted',
          serviceFinishTime: new Date().toISOString(),
        };
      }
      return t;
    }));

    showToast('Pengerjaan Selesai!', 'Status servis kendaraan telah diperbarui menjadi Completed & masuk ke Riwayat.');
  }, [setTickets, showToast]);

  const calculatedTicketsCount = useMemo(() => {
    return tickets.filter(t => t.status !== 'CheckedOut').length;
  }, [tickets]);

  const calculatedHistoryCount = useMemo(() => {
    if (currentUserRole === 'Security') {
      const checkedOutFromTickets = tickets.filter(t => t.status === 'CheckedOut').length;
      return historyTickets.length + checkedOutFromTickets;
    }
    if (currentUserRole === 'ServiceAdvisor') {
      return tickets.filter(t => t.status === 'Inspected' || t.status === 'WabDone' || t.wabSubmitted).length;
    }
    if (currentUserRole === 'Foreman') {
      return tickets.filter(t => t.status === 'ServiceCompleted' || t.status === 'PreHandoverReady' || t.status === 'HandoverCompleted').length;
    }
    const checkedOutFromTickets = tickets.filter(t => t.status === 'CheckedOut').length;
    return historyTickets.length + checkedOutFromTickets;
  }, [currentUserRole, tickets, historyTickets]);

  const isTvMode = typeof window !== 'undefined' && window.location.search.includes('mode=tv');
  if (isTvMode) {
    return <TvDisplayPage tickets={tickets} />;
  }

  if (!isLoggedIn) {
    return <LoginPage toast={toast} />;
  }

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
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUserRole={currentUserRole}
          bookingsCount={bookings.length}
          ticketsCount={calculatedTicketsCount}
          historyCount={calculatedHistoryCount}
        />

        <div className="main-wrapper">
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>SDMS</span>
                <span>/</span>
                <span style={{ color: '#64748b', fontWeight: 500 }}>
                  {activeTab === 'drh-dashboard' ? 'DRH System' : activeTab === 'account' ? 'Akun' : activeTab === 'sparepart' ? 'Sparepart' : 'WAB System'}
                </span>
                <span>/</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>
                  {activeTab === 'bookings' ? 'List Booking' :
                   activeTab === 'daftar-tamu' ? 'Daftar Tamu' :
                   activeTab === 'wab-form' ? 'Form WAB' :
                   activeTab === 'foreman' ? 'Workshop Board' :
                   activeTab === 'rka' ? 'RKA Monitoring' :
                   activeTab === 'tv-display' ? 'TV Display Lounge' :
                   activeTab === 'account' ? 'Profil Pengguna' :
                   activeTab === 'sparepart' ? 'Katalog & Inventory' :
                   activeTab === 'history' ? (currentUserRole === 'Security' ? 'Riwayat Check-Out' : currentUserRole === 'ServiceAdvisor' ? 'Riwayat WAB' : currentUserRole === 'Foreman' ? 'Riwayat Workshop' : 'Riwayat Sistem') : 'Dashboard'}
                </span>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.65rem', borderRadius: '8px', border: 'none', background: isProfileDropdownOpen ? '#f1f5f9' : 'transparent', cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s ease' }}
                onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.background = isProfileDropdownOpen ? '#f1f5f9' : 'transparent'}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <User size={15} color="#ffffff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
                    {currentUserRole === 'ServiceAdvisor' ? 'Service Advisor' : currentUserRole === 'Security' ? 'Security Gate' : 'Admin Portal'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Suzuki Staff</span>
                </div>
                <ChevronDown size={14} color="#64748b" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </div>

              {isProfileDropdownOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '210px', background: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', zIndex: 1000, overflow: 'hidden' }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Masuk sebagai</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{currentUserRole}</div>
                  </div>
                  <div style={{ padding: '0.35rem' }}>
                    <div
                      onClick={() => { setIsProfileDropdownOpen(false); setActiveTab('account'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', borderRadius: '5px', fontSize: '0.825rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer', transition: 'background 0.15s ease', marginBottom: '2px' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={15} color="#0f172a" />
                      <span>Profil Akun</span>
                    </div>

                    <div
                      onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', borderRadius: '5px', fontSize: '0.825rem', fontWeight: 600, color: '#be123c', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onMouseOver={e => e.currentTarget.style.background = '#fff1f2'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} color="#be123c" />
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="content">
            {activeTab === 'drh-dashboard' && <DrhDashboard />}

            {activeTab === 'bookings' && (
              <BookingListTab
                bookings={bookings}
                onOpenWalkInModal={() => setShowWalkInModal(true)}
                onCheckInFromBooking={handleCheckInFromBooking}
                getPurposeString={getPurposeString}
              />
            )}

            {activeTab === 'daftar-tamu' && (
              <GuestListTab
                tickets={tickets}
                currentUserRole={currentUserRole}
                onOpenWalkInModal={() => setShowWalkInModal(true)}
                getPurposeString={getPurposeString}
                getStatusString={getStatusString}
                onStartWab={handleStartWab}
                onOpenEditModal={handleOpenEditPurposeModal}
                onOpenCheckOutModal={handleOpenCheckOutModal}
              />
            )}

            {activeTab === 'history' && (
              <HistoryTab
                currentUserRole={currentUserRole}
                tickets={tickets}
                historyTickets={historyTickets}
                onSelectTicket={setSelectedWabDetailTicket}
              />
            )}

            {activeTab === 'wab-form' && (
              <FormWAB
                getPurposeString={getPurposeString}
                setActiveTab={setActiveTab}
                showToast={showToast}
                handleFinalizeWab={handleFinalizeWab}
              />
            )}

            {activeTab === 'foreman' && (
              <ForemanTab
                tickets={tickets}
                getStatusString={getStatusString}
                onFinishJob={handleFinishJob}
                onUpdateTracking={handleUpdateForemanTracking}
              />
            )}

            {activeTab === 'tv-display' && (
              <TvDisplayPage tickets={tickets} />
            )}

            {activeTab === 'sparepart' && (
              <SparepartPage />
            )}

            {activeTab === 'rka' && (
              <RkaPage />
            )}

            {activeTab === 'account' && (
              <AccountPage currentUserRole={currentUserRole} onLogout={handleLogout} />
            )}
          </div>
        </div>
      </div>

      <WalkInModal isOpen={showWalkInModal} onClose={() => setShowWalkInModal(false)} onSubmit={handleCheckInSubmit} />
      <EditTicketModal editingTicket={editingTicket} editForm={editForm} setEditForm={setEditForm} onClose={() => setEditingTicket(null)} onSave={handleSaveEditPurpose} />
      <CheckOutModal checkoutTargetTicket={checkoutTargetTicket} onClose={() => setCheckoutTargetTicket(null)} onConfirm={handleConfirmCheckOutWeb} />
      <WabDetailModal isOpen={Boolean(selectedWabDetailTicket)} ticket={selectedWabDetailTicket} onClose={() => setSelectedWabDetailTicket(null)} />

      {successCheckInModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000 }}>
          <div className="success-pop-card" style={{ background: '#ffffff', padding: '2rem 2.25rem', borderRadius: '16px', width: 380, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.2rem' }}>
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                <circle className="animate-circle" cx="38" cy="38" r="34" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
                <path className="animate-check" d="M24 39L33 48L53 28" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 0.35rem 0', color: '#0f172a', fontSize: '1.35rem', fontWeight: 800 }}>{successCheckInModal.title || 'Check-In Berhasil!'}</h3>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.4 }}>{successCheckInModal.details || `Kendaraan ${successCheckInModal.licensePlate} telah resmi terdaftar.`}</p>
            {successCheckInModal.queueNumber && (
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>NOMOR ANTRIAN</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>{successCheckInModal.queueNumber}</span>
              </div>
            )}
            <button type="button" className="btn" style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '0.7rem', fontWeight: 'bold', fontSize: '0.9rem' }} onClick={() => setSuccessCheckInModal(null)}>Selesai</button>
          </div>
        </div>
      )}

      {showExteriorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3800, padding: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '92vw', maxWidth: '1200px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: '#ffffff', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Inspeksi Bodi 360° (Suzuki XL7)</h3>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Putar kendaraan (0° - 360°) dan klik 2x pada bodi mobil untuk menandai titik kerusakan fisik.</span>
              </div>
              <button type="button" onClick={() => setShowExteriorModal(false)} style={{ color: '#0f172a', borderRadius: '6px', padding: '0.35rem 0.85rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.825rem' }}>✕</button>
            </div>

            <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <VehicleInspector onPartClick={handlePartClick} damages={damages} focusFrame={focusFrame} />
              </div>
              <div style={{ width: '360px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <InspectionSummary damages={damages} onRemoveDamage={handleRemoveDamage} onDamageClick={handleDamageClick} onEditDamage={handleEditDamage} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Total Titik Kerusakan: <b style={{ color: '#0f172a' }}>{damages.length} Titik</b></span>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.55rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }} onClick={() => setShowExteriorModal(false)}>Batal</button>
                <button type="button" className="btn" style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.55rem 1.25rem', fontWeight: 700, fontSize: '0.85rem' }} onClick={handleSaveExteriorInspection}>Simpan Hasil Inspeksi 360°</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeRoleForTabs, setActiveRoleForTabs] = useState('bookings');

  return (
    <AuthProvider onRoleChange={() => {}}>
      <AppDataProvider>
        <WabFormProvider>
          <AppShell />
        </WabFormProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}
