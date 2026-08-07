import React, { useState, useEffect } from 'react';
import { fetchBookings, fetchTickets, checkInVehicle, changeArrivalPurpose, submitWabForm, updateForemanTracking, updateWorkshopStatus, checkOutVehicle } from './services/api';
import { createSignalRConnection } from './services/signalr';

import { Car, List, Users, FileText, Wrench, ShoppingBag, Layers, Package, History, ChevronDown, ChevronRight, Menu, User, LogOut, Eye, EyeOff } from 'lucide-react';

import VehicleInspector from './modules/wab/components/VehicleInspector';
import DamageLoggerModal from './modules/wab/components/DamageLoggerModal';
import InspectionSummary from './modules/wab/components/InspectionSummary';
import SignaturePad from './modules/wab/components/SignaturePad';
import Sidebar from './components/Sidebar';

import BookingListTab from './modules/wab/tabs/BookingListTab';
import GuestListTab from './modules/wab/tabs/GuestListTab';
import HistoryTab from './modules/wab/tabs/HistoryTab';
import ForemanTab from './modules/wab/tabs/ForemanTab';
import WalkInModal from './modules/wab/modals/WalkInModal';
import EditTicketModal from './modules/wab/modals/EditTicketModal';
import CheckOutModal from './modules/wab/modals/CheckOutModal';
import WabDetailModal from './modules/wab/modals/WabDetailModal';

import DrhDashboard from './modules/drh/tabs/DrhDashboard';

export default function App() {
  const [currentUserRole, setCurrentUserRole] = useState('Admin');
  const [activeTab, setActiveTab] = useState('bookings');
  const [isWabOpen, setIsWabOpen] = useState(false); 
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [signalStatus, setSignalStatus] = useState('Disconnected');
  const [toast, setToast] = useState(null); 

  const showToast = (title, message = '', type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

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

  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    sdmsBookingId: '',
    licensePlate: '',
    vehicleModel: '',
    serviceType: 'Periodic Service',
    arrivalPurpose: 'Service'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginRole, setLoginRole] = useState('Security');
  const [loginUsername, setLoginUsername] = useState('security_user');
  const [emailInput, setEmailInput] = useState('sa@suzuki.co.id');
  const [passwordInput, setPasswordInput] = useState('suzuki2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLoginRole, setSelectedLoginRole] = useState('ServiceAdvisor');

  const handleQuickLogin = (role) => {
    const targetRole = role || selectedLoginRole;
    setLoginRole(targetRole);
    setCurrentUserRole(targetRole);
    if (targetRole === 'Admin' || targetRole === 'Security') setActiveTab('bookings');
    if (targetRole === 'ServiceAdvisor') setActiveTab('daftar-tamu');
    if (targetRole === 'Foreman') setActiveTab('foreman');
    setIsLoggedIn(true);
    showToast('Login Berhasil', `Selamat datang! Masuk sebagai ${targetRole}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Logout Berhasil', 'Anda telah keluar dari sistem.');
  };

  const [wabStep, setWabStep] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [saCustomerName, setSaCustomerName] = useState('');
  const [saCustomerPhone, setSaCustomerPhone] = useState('');
  const [saCustomerAddress, setSaCustomerAddress] = useState('');
  const [customerComplaints, setCustomerComplaints] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const [saSignatureData, setSaSignatureData] = useState(null);
  const [showExteriorModal, setShowExteriorModal] = useState(false);
  const [damages, setDamages] = useState([]);
  const [exteriorTextNotes, setExteriorTextNotes] = useState([
    { id: '1', category: 'Spion', note: '' },
    { id: '2', category: 'Ban Serep', note: '' }
  ]);
  const [newTextCategory, setNewTextCategory] = useState('');
  const [newTextNote, setNewTextNote] = useState('');

  const [functionalInspections, setFunctionalInspections] = useState([
    { id: 'horn', name: 'Klakson / Horn', status: 'OK', notes: '' },
    { id: 'wiper', name: 'Wiper & Air Washer', status: 'OK', notes: '' },
    { id: 'ac', name: 'Sistem AC / Pendingin', status: 'OK', notes: '' },
    { id: 'tires', name: 'Kondisi Ban & Tekanan Angin', status: 'OK', notes: '' },
    { id: 'radiator', name: 'Cairan Radiator / Coolant', status: 'OK', notes: '' },
    { id: 'lights', name: 'Sistem Lampu (Headlamp/Tail/Sein)', status: 'OK', notes: '' },
    { id: 'battery', name: 'Aki / Baterai', status: 'OK', notes: '' },
    { id: 'brake', name: 'Sistem Rem / Minyak Rem', status: 'OK', notes: '' }
  ]);

  const handleFunctionalChange = (id, field, value) => {
    setFunctionalInspections(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // 360 Hotspot Inspectors
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState(null);
  const [focusFrame, setFocusFrame] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Search, Filter, & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Web Edit & Check-Out Modal States
  const [editingTicket, setEditingTicket] = useState(null);
  const [editForm, setEditForm] = useState({
    licensePlate: '',
    vehicleModel: '',
    arrivalPurpose: 'Service'
  });
  const [checkoutTargetTicket, setCheckoutTargetTicket] = useState(null);

  // Foreman Edit & Tracking State
  const [foremanForm, setForemanForm] = useState({
    ticketId: '',
    stallName: 'Stall 01',
    technicianName: 'Budi (Teknisi 1)',
    foremanRecommendation: 'Ganti oli mesin & balancing roda depan',
    addExtraMinutes: 30
  });

  const loadData = async () => {
    try {
      const bData = await fetchBookings();
      setBookings(bData);
      const tData = await fetchTickets();
      setTickets(tData);
    } catch (e) {
      console.error("Failed fetching data", e);
    }
  };

  useEffect(() => {
    loadData();

    const connection = createSignalRConnection((eventName, ticket) => {
      console.log(`Real-time Event [${eventName}]:`, ticket);
      const ticketId = ticket.ticketId || ticket.TicketId;
      const licensePlate = ticket.licensePlate || ticket.LicensePlate;
      const sdmsBookingId = ticket.sdmsBookingId || ticket.SdmsBookingId;

      if (sdmsBookingId) {
        setBookings(prev => prev.filter(b => b.sdmsBookingId !== sdmsBookingId));
      }

      setTickets(prev => {
        const index = prev.findIndex(t => (t.ticketId || t.TicketId) === ticketId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = ticket;
          return updated;
        }
        return [ticket, ...prev];
      });

      if (eventName === 'vehicleCheckedIn') {
        showToast('Check-In Gerbang Real-Time', `Kendaraan ${licensePlate || ''} telah berhasil check-in di gerbang.`);
      }
    });

    connection.start()
      .then(() => setSignalStatus('Connected (Live SignalR)'))
      .catch(err => setSignalStatus('Disconnected (Offline)'));

    return () => {
      connection.stop();
    };
  }, []);

  const handleRoleChange = (newRole) => {
    setCurrentUserRole(newRole);
    if (newRole === 'Security') setActiveTab('bookings');
    if (newRole === 'ServiceAdvisor') setActiveTab('daftar-tamu');
    if (newRole === 'Foreman') setActiveTab('foreman');
  };

  // Check-In Confirmation & Animated Success Modal States
  const [successCheckInModal, setSuccessCheckInModal] = useState(null); // { queueNumber, licensePlate, purpose }

  // Handlers
  const executeCheckInProcess = async (data, type = 'walkin') => {
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

        // Show Animated Centered Success Popup
        setSuccessCheckInModal({
          queueNumber: qNum,
          licensePlate: plate,
          purpose: purpose
        });

        // Auto-dismiss after 2.5s
        setTimeout(() => {
          setSuccessCheckInModal(null);
        }, 2500);
      } else {
        showToast('Check-In Gagal', 'Gagal menyimpan data check-in ke server.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Koneksi Gagal', 'Terjadi kesalahan sistem backend.', 'error');
    }
  };

  const handleCheckInFromBooking = (b) => {
    const data = {
      sdmsBookingId: b.sdmsBookingId,
      licensePlate: b.licensePlate || 'B 1234 ABC',
      vehicleModel: b.vehicleModel || 'Suzuki XL7',
      serviceType: b.serviceType || 'Periodic Service',
      arrivalPurpose: 'Service',
      customerName: b.customerName,
      categoryPassComm: b.categoryPassComm || 'Passenger'
    };
    executeCheckInProcess(data, 'booking');
  };

  const handleCheckInSubmit = (dataOrEvent) => {
    if (dataOrEvent && typeof dataOrEvent.preventDefault === 'function') {
      dataOrEvent.preventDefault();
    }
    const formData = (dataOrEvent && dataOrEvent.licensePlate) ? dataOrEvent : checkInForm;
    if (!formData || !formData.licensePlate) return;

    setShowWalkInModal(false);
    executeCheckInProcess(formData, 'walkin');
  };

  const handleOpenEditPurposeModal = (ticket) => {
    setEditingTicket(ticket);
    setEditForm({
      licensePlate: ticket.licensePlate || '',
      vehicleModel: ticket.vehicleModel || 'Suzuki XL7 Alpha',
      arrivalPurpose: ticket.arrivalPurpose || 'Service'
    });
  };

  const handleSaveEditPurpose = async () => {
    if (!editingTicket) return;
    if (!editForm.licensePlate) {
      showToast('Form Belum Lengkap', 'Nomor Polisi wajib diisi!', 'error');
      return;
    }
    const isService = editForm.arrivalPurpose === 'Service';
    setTickets(prev => prev.map(t => {
      if (t.ticketId === editingTicket.ticketId) {
        return {
          ...t,
          licensePlate: editForm.licensePlate.toUpperCase(),
          vehicleModel: editForm.vehicleModel,
          arrivalPurpose: editForm.arrivalPurpose,
          queueNumber: isService ? (t.queueNumber || 'W-' + Math.floor(100 + Math.random() * 900)) : null
        };
      }
      return t;
    }));
    setEditingTicket(null);
    showToast('Edit Berhasil!', `Data kendaraan ${editForm.licensePlate.toUpperCase()} berhasil diperbarui.`);
  };

  const [selectedWabDetailTicket, setSelectedWabDetailTicket] = useState(null);

  const handleStartWab = async (ticket) => {
    const purposeStr = getPurposeString(ticket.arrivalPurpose);
    const isService = purposeStr.toLowerCase() === 'service';
    if (!isService) {
      showToast("Akses Terbatas", "Hanya tujuan kedatangan Service yang dapat mengisi Form WAB.", "error");
      return;
    }

    const isWabDone = ticket.status === 'Inspected' || ticket.status === 'WabDone' || ticket.wabSubmitted;

    // If WAB is ALREADY COMPLETED, open read-only WabDetailModal popup!
    if (isWabDone) {
      setSelectedWabDetailTicket(ticket);
      return;
    }

    // Otherwise, open editable WAB 5-step form
    setSelectedTicket(ticket);
    setSaCustomerName((!ticket.customerName || ticket.customerName === 'Diisi oleh SA di WAB') ? '' : ticket.customerName);
    setSaCustomerPhone(ticket.customerPhone === '-' ? '' : (ticket.customerPhone || ''));
    setSaCustomerAddress(ticket.customerAddress || '');
    setCustomerComplaints(ticket.customerComplaints || '');
    setDamages(ticket.damages || []);
    setWabStep(1);
    setIsWabOpen(true);
    setActiveTab('wab-form');

    setTickets(prev => prev.map(t => (t.ticketId === ticket.ticketId ? { ...t, status: 'WabInProgress' } : t)));
    showToast('Form WAB (SA)', `Proses WAB dimulai untuk Kendaraan Plat: ${ticket.licensePlate}`);
  };

  const [historyTickets, setHistoryTickets] = useState([]);

  const handleOpenCheckOutModal = (ticket) => {
    setCheckoutTargetTicket(ticket);
  };

  const handleConfirmCheckOutWeb = async () => {
    if (!checkoutTargetTicket) return;
    const target = checkoutTargetTicket;
    setCheckoutTargetTicket(null);

    try {
      await checkOutVehicle({ ticketId: target.ticketId });
      const checkedOutItem = {
        ...target,
        status: 'CheckedOut',
        checkOutTime: new Date().toISOString()
      };
      setHistoryTickets(prev => [checkedOutItem, ...prev]);
      setTickets(prev => prev.filter(t => t.ticketId !== target.ticketId));

      // Trigger Centered Animated Success Popup Notification!
      setSuccessCheckInModal({
        title: 'Check-Out Berhasil!',
        licensePlate: target.licensePlate,
        queueNumber: null,
        details: `Kendaraan ${target.licensePlate} telah rilis dari gerbang & dipindahkan ke Riwayat.`
      });

      setTimeout(() => {
        setSuccessCheckInModal(null);
      }, 2500);
    } catch (e) {
      console.error(e);
      showToast('Check-Out Gagal', 'Gagal melakukan proses check-out.', 'error');
    }
  };

  // Step 4 Text Note Handlers
  const handleAddTextNote = () => {
    if (!newTextNote) return;
    setExteriorTextNotes([...exteriorTextNotes, { id: Date.now().toString(), category: newTextCategory || 'Exterior', note: newTextNote }]);
    setNewTextCategory('');
    setNewTextNote('');
  };

  const handleRemoveTextNote = (id) => {
    setExteriorTextNotes(exteriorTextNotes.filter(n => n.id !== id));
  };

  // 360 Hotspot Handlers
  const handlePartClick = (context) => {
    const ctx = typeof context === 'string' ? { part: context } : context;
    setSelectedContext(ctx);
    setIsModalOpen(true);
  };

  const handleSaveDamage = (damageRecord) => {
    if (selectedContext && selectedContext.id) {
      setDamages(damages.map(d => d.id === selectedContext.id ? { ...d, ...damageRecord } : d));
      showToast('Data Kerusakan Diperbarui', `Titik kerusakan ${damageRecord.type} (${damageRecord.severity}) berhasil diubah.`);
    } else {
      const newDamage = {
        ...selectedContext,
        ...damageRecord,
        id: Date.now().toString()
      };
      setDamages([...damages, newDamage]);
      showToast('Kerusakan Dicatat', `Titik kerusakan ${damageRecord.type} (${damageRecord.severity}) ditambahkan.`);
    }
    setIsModalOpen(false);
  };

  const handleRemoveDamage = (id) => {
    setDamages(damages.filter(d => d.id !== id));
  };

  const handleDamageClick = (damage) => {
    if (damage.frame !== undefined) {
      setFocusFrame({ frame: damage.frame, ts: Date.now() });
    }
  };

  const handleEditDamage = (damage) => {
    if (damage.frame !== undefined) {
      setFocusFrame({ frame: damage.frame, ts: Date.now() });
    }
    setSelectedContext(damage);
    setIsModalOpen(true);
  };

  const handleSaveExteriorInspection = () => {
    setShowExteriorModal(false);
    showToast('Inspeksi 360° Disimpan', `Berhasil menyimpan ${damages.length} titik catatan kerusakan bodi.`);
  };

  const handleFinalizeWab = async () => {
    if (!selectedTicket) return;
    if (!saCustomerName) return showToast('Form Belum Lengkap', 'Mohon lengkapi Nama Pelanggan di Step 1 WAB!', 'error');

    try {
      await submitWabForm({
        ticketId: selectedTicket.ticketId,
        customerName: saCustomerName,
        customerPhone: saCustomerPhone,
        customerComplaints,
        damages,
        exteriorTextNotes: exteriorTextNotes.filter(n => n.note.trim() !== ''),
        customerSignatureUrl: "data:image/png;base64,sample_signature_canvas_data"
      });
    } catch (e) { }

    setTickets(prev => prev.map(t =>
      t.ticketId === selectedTicket.ticketId
        ? {
          ...t,
          status: 'Inspected',
          wabSubmitted: true,
          customerName: saCustomerName,
          customerPhone: saCustomerPhone,
          customerComplaints,
          damages,
        }
        : t
    ));

    showToast('Form WAB Terkirim!', 'Data WAB 5-step berhasil dikirim & diteruskan ke Foreman.');
    setSelectedTicket(null);
    setActiveTab('daftar-tamu');
  };

  // Foreman Handlers
  const handleUpdateForemanTracking = async (e) => {
    e.preventDefault();
    if (!foremanForm.ticketId) return showToast('Perhatian', 'Pilih tiket terlebih dahulu', 'error');
    await updateForemanTracking(foremanForm);
    showToast('Tracking Diperbarui!', 'Estimasi & rekomendasi Foreman berhasil disimpan.');
  };

  const handleFinishJob = async (ticketId) => {
    await updateWorkshopStatus({ ticketId, status: 'ServiceCompleted' });
    showToast('Pengerjaan Selesai!', 'Status servis kendaraan telah diperbarui menjadi Completed.');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', width: '100vw', background: '#ffffff', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
        {toast && (
          <div style={{ position: 'fixed', top: '1.25rem', right: '1.5rem', zIndex: 9999, background: '#ffffff', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a', borderRadius: '6px', padding: '0.85rem 1.25rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{toast.title}</div>
          </div>
        )}

        {/* LEFT SIDE*/}
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

        {/* RIGHT SIDE*/}
        <div style={{ flex: '1 1 45%', minWidth: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3.5rem', backgroundColor: '#ffffff', position: 'relative' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ marginBottom: '2.25rem' }}>
              <img src="/suzuki_logo.svg" alt="Suzuki Logo" style={{ height: '42px', objectFit: 'contain', marginBottom: '1.25rem' }} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleQuickLogin(selectedLoginRole); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.15s ease'
                  }}
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
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.75rem 0.75rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
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

              {/* QUICK ROLE BYPASS SELECTION CHIPS */}
              <div style={{ marginTop: '0.35rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                  Pilih Role Akses (Bypass Login Cepat):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { role: 'Security', label: 'Security Gate', email: 'security@suzuki.co.id' },
                    { role: 'ServiceAdvisor', label: 'Service Advisor', email: 'sa@suzuki.co.id' },
                    { role: 'Foreman', label: 'Foreman', email: 'foreman@suzuki.co.id' },
                    { role: 'Admin', label: 'Super Admin', email: 'admin@suzuki.co.id' }
                  ].map(item => {
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

  return (
    <div>
      {/* ENTERPRISE TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.5rem',
          zIndex: 9999,
          background: '#ffffff',
          border: toast.type === 'error' ? '1px solid #fecdd3' : '1px solid #bbf7d0',
          borderLeft: toast.type === 'error' ? '4px solid #be123c' : '4px solid #16a34a',
          borderRadius: '6px',
          padding: '0.85rem 1.25rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          minWidth: '340px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: toast.type === 'error' ? '#ffe4e6' : '#dcfce7',
            color: toast.type === 'error' ? '#be123c' : '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            flexShrink: 0
          }}>
            {toast.type === 'error' ? '✕' : '✓'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{toast.title}</div>
            {toast.message && <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '2px' }}>{toast.message}</div>}
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', padding: 0, lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      )}

      <div className="app-layout">
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUserRole={currentUserRole}
          bookingsCount={bookings.length}
          ticketsCount={tickets.length}
          historyCount={historyTickets.length}
        />

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="main-wrapper">
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* SIDEBAR TOGGLE BUTTON */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#0f172a',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Menu size={16} color="#0f172a" />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Suzuki Dealer Portal</span>
                <span>/</span>
                <span style={{ color: '#64748b', fontWeight: 500 }}>{activeTab === 'drh-dashboard' ? 'DRH System' : 'WAB'}</span>
                <span>/</span>
                <span style={{ color: '#0f172a', fontWeight: 700, textTransform: 'capitalize' }}>
                  {activeTab === 'bookings' ? 'List Booking' : activeTab === 'daftar-tamu' ? 'Daftar Tamu' : activeTab === 'wab-form' ? 'Form WAB' : activeTab === 'foreman' ? 'Workshop Board' : activeTab === 'history' ? 'Riwayat Check-Out' : 'Dashboard'}
                </span>
              </div>
            </div>

            {/* LOGGED IN USER PROFILE DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isProfileDropdownOpen ? '#f1f5f9' : 'transparent',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
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
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                    Suzuki Staff
                  </span>
                </div>
                <ChevronDown size={14} color="#64748b" style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </div>

              {/* FLOATING DROPDOWN MENU */}
              {isProfileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '210px',
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Masuk sebagai</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{currentUserRole}</div>
                  </div>

                  <div style={{ padding: '0.35rem' }}>
                    <div
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '5px',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: '#be123c',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
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
            {/* TAB 0: DRH SYSTEM DASHBOARD */}
            {activeTab === 'drh-dashboard' && <DrhDashboard />}

            {/* TAB 1: LIST BOOKING SDMS */}
            {activeTab === 'bookings' && (
              <BookingListTab
                bookings={bookings}
                onOpenWalkInModal={() => setShowWalkInModal(true)}
                onCheckInFromBooking={handleCheckInFromBooking}
                getPurposeString={getPurposeString}
              />
            )}

            {/* TAB 2: DAFTAR TAMU GERBANG */}
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

            {/* TAB 5: HALAMAN RIWAYAT CHECK-OUT */}
            {activeTab === 'history' && (
              <HistoryTab historyTickets={historyTickets} />
            )}


            {/* TAB 3: SA WAB FORM (5-STEP) */}
            {activeTab === 'wab-form' && (
              <div>
                {!selectedTicket ? (
                  <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', maxWidth: '650px', margin: '2rem auto' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <FileText size={24} color="#0f172a" />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem' }}>Halaman WAB Service Advisor</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      Silakan buka tab <b>Daftar Tamu</b> lalu klik <b>Mulai</b> pada kendaraan yang akan diproses inspeksi.
                    </p>
                    <button className="btn" style={{ backgroundColor: '#0f172a', padding: '0.65rem 1.25rem' }} onClick={() => setActiveTab('daftar-tamu')}>
                      &larr; Buka Halaman Daftar Tamu
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* WAB STEPPER BAR (CORPORATE MONOCHROME DESIGN) */}
                    <div style={{ background: '#ffffff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {[
                          { step: 1, title: 'Data Pelanggan' },
                          { step: 2, title: 'Data Kendaraan' },
                          { step: 3, title: 'Keluhan Customer' },
                          { step: 4, title: 'Inspeksi 360°' },
                          { step: 5, title: 'Tanda Tangan & Final' }
                        ].map((item, idx) => {
                          const isActive = wabStep === item.step;
                          const isDone = wabStep > item.step;
                          return (
                            <React.Fragment key={item.step}>
                              <div
                                onClick={() => setWabStep(item.step)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.6rem',
                                  cursor: 'pointer',
                                  opacity: isActive || isDone ? 1 : 0.55
                                }}
                              >
                                <div
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    background: isActive ? '#0f172a' : isDone ? '#475569' : '#f1f5f9',
                                    color: isActive || isDone ? '#ffffff' : '#475569',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    border: isActive ? 'none' : '1px solid #cbd5e1'
                                  }}
                                >
                                  {isDone ? '✓' : item.step}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0f172a' : '#475569' }}>
                                  {item.title}
                                </span>
                              </div>
                              {idx < 4 && (
                                <div style={{ flex: 1, height: '2px', background: isDone ? '#0f172a' : '#e2e8f0', margin: '0 0.75rem' }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* WAB HORIZONTAL HEADER BANNER: INFORMASI ANTRIAN & KENDARAAN (CLEAN ENTERPRISE FRAMELESS) */}
                    <div style={{ background: '#ffffff', padding: '1rem 1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ background: '#0f172a', color: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: '6px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', display: 'block', lineHeight: 1 }}>ANTRIAN</span>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1.2 }}>
                            {selectedTicket.queueNumber || 'Non-Service'}
                          </span>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NOMOR POLISI</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.2px' }}>
                            {selectedTicket.licensePlate}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div>
                          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MODEL KENDARAAN</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                            {selectedTicket.vehicleModel}
                          </div>
                        </div>

                        <div style={{ width: '1px', height: '28px', background: '#e2e8f0' }} />

                        <div>
                          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TUJUAN KEDATANGAN</div>
                          <div style={{ marginTop: '2px' }}>
                            <span className={`badge badge-${getPurposeString(selectedTicket.arrivalPurpose).toLowerCase()}`}>
                              {getPurposeString(selectedTicket.arrivalPurpose)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STEP 1: DATA PELANGGAN (FULL WIDTH ENTERPRISE GRID) */}
                    {wabStep === 1 && (
                      <div style={{ width: '100%' }}>
                        {/* FORM INPUT */}
                        <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                          <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 1: Pengisian Data Pelanggan</h4>
                          <form onSubmit={(e) => { e.preventDefault(); if (!saCustomerName) return showToast('Form Belum Lengkap', 'Nama Pelanggan wajib diisi', 'error'); setWabStep(2); }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                              <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Nama Pelanggan / Pemilik (Wajib)</label>
                                <input
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }}
                                  value={saCustomerName}
                                  onChange={e => setSaCustomerName(e.target.value)}
                                  placeholder="Contoh: Budi Santoso"
                                  required
                                />
                              </div>

                              <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Nomor Telepon / WhatsApp</label>
                                <input
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }}
                                  value={saCustomerPhone}
                                  onChange={e => setSaCustomerPhone(e.target.value)}
                                  placeholder="Contoh: 081234567890"
                                />
                              </div>
                            </div>

                            <div style={{ marginBottom: '1.75rem' }}>
                              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Alamat Pelanggan / Alamat Domisili</label>
                              <textarea
                                rows={2}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                                value={saCustomerAddress}
                                onChange={e => setSaCustomerAddress(e.target.value)}
                                placeholder="Contoh: Jl. Sudirman No. 123, Kel. Kebayoran Baru, Jakarta Selatan"
                              />
                            </div>

                            <button type="submit" className="btn" style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                              Continue
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: DATA KENDARAAN (FULL WIDTH ENTERPRISE) */}
                    {wabStep === 2 && (
                      <div style={{ width: '100%' }}>
                        <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                          <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 2: Konfirmasi Data Kendaraan & Antrian</h4>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.25rem', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                            <div>
                              <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NOMOR ANTRIAN</div>
                              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>{selectedTicket.queueNumber || 'Non-Service'}</div>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NOMOR POLISI</div>
                              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedTicket.licensePlate}</div>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>MODEL KENDARAAN</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>{selectedTicket.vehicleModel}</div>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NAMA PELANGGAN</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>{saCustomerName || '-'}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(1)}>Kembali</button>
                            <button className="btn" style={{ flex: 2, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 'bold' }} onClick={() => setWabStep(3)}>Continue</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: PERMINTAAN KELUHAN PELANGGAN (FULL WIDTH ENTERPRISE) */}
                    {wabStep === 3 && (
                      <div style={{ width: '100%' }}>
                        <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 3: Catatan Keluhan & Permintaan Pelanggan</h4>
                          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                            Tuliskan secara spesifik keluhan atau pekerjaan tambahan yang diminta oleh pemilik kendaraan.
                          </p>

                          <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Keluhan Utama & Catatan Servis</label>
                            <textarea
                              rows={5}
                              style={{ width: '100%', padding: '0.75rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }}
                              placeholder="Contoh: Suara mesin agak kasar saat AC dinyalakan, rem depan terasa kurang pakem saat pengereman mendadak..."
                              value={customerComplaints}
                              onChange={e => setCustomerComplaints(e.target.value)}
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(2)}>Kembali</button>
                            <button className="btn" style={{ flex: 2, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 'bold' }} onClick={() => setWabStep(4)}>Continue</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: PEMERIKSAAN KENDARAAN (360 MODAL POPUP & FUNCTIONAL TABLE) */}
                    {wabStep === 4 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                        {/* 360 INSPECTION TRIGGER CARD */}
                        <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>Step 4: Inspeksi Bodi 360° & Catatan Fisik</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.825rem' }}>
                              Tekan tombol di samping untuk membuka modul inspeksi visual 360° bodi kendaraan.
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600, background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                              Catatan Bodi: <b>{damages.length} Titik</b>
                            </span>
                            <button
                              type="button"
                              className="btn"
                              style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.85rem' }}
                              onClick={() => setShowExteriorModal(true)}
                            >
                              Mulai Inspeksi
                            </button>
                          </div>
                        </div>

                        {/* 360 DEGREE LOGGED DAMAGES SUMMARY TABLE (DISPLAYED ABOVE TEXT NOTES) */}
                        <div style={{ width: '100%' }}>
                          <InspectionSummary
                            damages={damages}
                            onRemoveDamage={handleRemoveDamage}
                            onDamageClick={(d) => {
                              handleDamageClick(d);
                              setShowExteriorModal(true);
                            }}
                            onEditDamage={(d) => {
                              handleEditDamage(d);
                              setShowExteriorModal(true);
                            }}
                          />
                        </div>

                        {/* EXTERIOR TEXT NOTES */}
                        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                          <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Catatan Kondisi Fisik Luar (Text Note)</h5>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input style={{ width: 170, padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }} placeholder="Kategori (e.g. Spion)" value={newTextCategory} onChange={e => setNewTextCategory(e.target.value)} />
                            <input style={{ flex: 1, padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }} placeholder="Catatan kondisi (e.g. Spion Kiri tidak ada)" value={newTextNote} onChange={e => setNewTextNote(e.target.value)} />
                            <button className="btn" style={{ backgroundColor: '#0f172a', color: '#ffffff' }} onClick={handleAddTextNote}>+ Tambah</button>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {exteriorTextNotes.map(n => (
                              <div key={n.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>[{n.category}]:</span>
                                <span style={{ color: '#475569' }}>{n.note || 'Belum diisi'}</span>
                                {n.note && (
                                  <button style={{ color: '#be123c', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', marginLeft: 4 }} onClick={() => handleRemoveTextNote(n.id)}>&times;</button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* FUNCTIONAL INSPECTION TABLE (PLAIN ENTERPRISE DMS STYLE) */}
                        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Pemeriksaan Komponen & Fungsi</h5>

                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', background: '#f8fafc' }}>
                                <th style={{ padding: '0.5rem 0.6rem', width: '35px', textAlign: 'center' }}>No</th>
                                <th style={{ padding: '0.5rem 0.6rem', fontWeight: 700 }}>Komponen Kendaraan</th>
                                <th style={{ padding: '0.5rem 0.6rem', fontWeight: 700, width: '180px' }}>Kondisi</th>
                                <th style={{ padding: '0.5rem 0.6rem', fontWeight: 700 }}>Catatan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {functionalInspections.map((item, idx) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                                  <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600, color: '#0f172a' }}>{item.name}</td>
                                  <td style={{ padding: '0.5rem 0.6rem' }}>
                                    <select
                                      value={item.status}
                                      onChange={(e) => handleFunctionalChange(item.id, 'status', e.target.value)}
                                      style={{
                                        padding: '0.35rem 0.5rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: item.status === 'OK' ? '#0f172a' : '#be123c',
                                        fontWeight: item.status === 'OK' ? 500 : 700,
                                        width: '100%',
                                        background: '#ffffff'
                                      }}
                                    >
                                      <option value="OK">Baik (OK)</option>
                                      <option value="Defect">Perlu Perbaikan</option>
                                    </select>
                                  </td>
                                  <td style={{ padding: '0.5rem 0.6rem' }}>
                                    <input
                                      type="text"
                                      placeholder="Catatan jika ada..."
                                      value={item.notes}
                                      onChange={(e) => handleFunctionalChange(item.id, 'notes', e.target.value)}
                                      style={{
                                        width: '100%',
                                        padding: '0.35rem 0.5rem',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: '#0f172a',
                                        boxSizing: 'border-box'
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button className="btn btn-secondary" style={{ width: '150px' }} onClick={() => setWabStep(3)}>Kembali</button>
                          <button className="btn" style={{ flex: 1, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.65rem' }} onClick={() => setWabStep(5)}>Continue</button>
                        </div>
                      </div>
                    )}

                    {/* STEP 5: OVERVIEW & TTD (ENTERPRISE WORKORDER LAYOUT) */}
                    {wabStep === 5 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                        <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }}>
                          <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 5: Ringkasan Workorder & Tanda Tangan Digital</h4>

                          {/* ENTERPRISE WORKORDER SUMMARY TABLE */}
                          <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', marginBottom: '1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                              <tbody>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                  <td style={{ padding: '0.65rem 0.85rem', width: '160px', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Nomor Antrian</td>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.95rem' }}>{selectedTicket.queueNumber || 'Non-Service'}</td>
                                  <td style={{ padding: '0.65rem 0.85rem', width: '160px', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Nama Pelanggan</td>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{saCustomerName || '-'} {saCustomerPhone ? `(${saCustomerPhone})` : ''}</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Kendaraan</td>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{selectedTicket.licensePlate} ({selectedTicket.vehicleModel})</td>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Catatan Kerusakan</td>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{damages.length} Titik Dicatat</td>
                                </tr>
                                {saCustomerAddress && (
                                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Alamat Pelanggan</td>
                                    <td colSpan={3} style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>{saCustomerAddress}</td>
                                  </tr>
                                )}
                                <tr>
                                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Keluhan Utama</td>
                                  <td colSpan={3} style={{ padding: '0.65rem 0.85rem', color: '#0f172a' }}>{customerComplaints || '-'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* 1. RINGKASAN KERUSAKAN FISIK 360° */}
                          <div style={{ marginBottom: '1.25rem' }}>
                            <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Catatan Kerusakan Bodi 360° ({damages.length} Titik)</h5>
                            <InspectionSummary damages={damages} onRemoveDamage={handleRemoveDamage} onDamageClick={handleDamageClick} onEditDamage={handleEditDamage} />
                          </div>

                          {/* 2. RINGKASAN PEMERIKSAAN KOMPONEN & FUNGSI */}
                          <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Pemeriksaan Komponen & Fungsi ({functionalInspections.length} Item)</h5>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                              {functionalInspections.map((item) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.65rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                  <span style={{ color: '#334155', fontWeight: 500 }}>{item.name}</span>
                                  <span style={{ fontWeight: 700, color: item.status === 'OK' ? '#16a34a' : '#dc2626', background: item.status === 'OK' ? '#f0fdf4' : '#fef2f2', padding: '1px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                    {item.status === 'OK' ? '✓ OK' : '✕ Defect'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. DUAL DIGITAL SIGNATURES (SA & CUSTOMER) */}
                          <div style={{ marginBottom: '1.75rem' }}>
                            <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Pengesahan & Tanda Tangan Digital</h5>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>

                              {/* TTD SA */}
                              <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ margin: '0 0 0.6rem 0', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', alignSelf: 'flex-start' }}>1. Tanda Tangan Service Advisor (SA)</p>
                                <SignaturePad onSignChange={setSaSignatureData} />
                              </div>

                              {/* TTD CUSTOMER */}
                              <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ margin: '0 0 0.6rem 0', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', alignSelf: 'flex-start' }}>2. Tanda Tangan Pelanggan (Customer)</p>
                                <SignaturePad onSignChange={setSignatureData} />
                              </div>

                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-secondary" style={{ width: '140px' }} onClick={() => setWabStep(4)}>Kembali</button>
                            <button className="btn" style={{ flex: 1, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 700, fontSize: '0.9rem' }} onClick={handleFinalizeWab}>
                              Kirim WAB & Teruskan Ke Foreman
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <DamageLoggerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveDamage} context={selectedContext} />
              </div>
            )}

            {/* TAB 4: FOREMAN WORKSHOP BOARD */}
            {activeTab === 'foreman' && (
              <ForemanTab
                tickets={tickets}
                getStatusString={getStatusString}
                onFinishJob={handleFinishJob}
                onUpdateTracking={handleUpdateForemanTracking}
              />
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <WalkInModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSubmit={handleCheckInSubmit}
      />

      <EditTicketModal
        editingTicket={editingTicket}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={() => setEditingTicket(null)}
        onSave={handleSaveEditPurpose}
      />

      <CheckOutModal
        checkoutTargetTicket={checkoutTargetTicket}
        onClose={() => setCheckoutTargetTicket(null)}
        onConfirm={handleConfirmCheckOutWeb}
      />

      <WabDetailModal
        isOpen={Boolean(selectedWabDetailTicket)}
        ticket={selectedWabDetailTicket}
        onClose={() => setSelectedWabDetailTicket(null)}
      />



      {/* 2. ANIMATED CENTERED SUCCESS POPUP NOTIFICATION */}
      {successCheckInModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000 }}>
          <div className="success-pop-card" style={{ background: '#ffffff', padding: '2rem 2.25rem', borderRadius: '16px', width: 380, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0' }}>

            {/* ANIMATED SVG CHECKMARK */}
            <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.2rem' }}>
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                <circle className="animate-circle" cx="38" cy="38" r="34" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
                <path className="animate-check" d="M24 39L33 48L53 28" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 style={{ margin: '0 0 0.35rem 0', color: '#0f172a', fontSize: '1.35rem', fontWeight: 800 }}>
              {successCheckInModal.title || 'Check-In Berhasil!'}
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.4 }}>
              {successCheckInModal.details || `Kendaraan ${successCheckInModal.licensePlate} telah resmi terdaftar.`}
            </p>

            {successCheckInModal.queueNumber && (
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>NOMOR ANTRIAN</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>{successCheckInModal.queueNumber}</span>
              </div>
            )}

            <button
              type="button"
              className="btn"
              style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '0.7rem', fontWeight: 'bold', fontSize: '0.9rem' }}
              onClick={() => setSuccessCheckInModal(null)}
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* 3. 360 DEGREE EXTERIOR INSPECTION POP-UP MODAL */}
      {showExteriorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3800, padding: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '92vw', maxWidth: '1200px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            {/* MODAL HEADER (WHITE BACKGROUND ENTERPRISE STYLE) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: '#ffffff', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Inspeksi Bodi 360° (Suzuki XL7)</h3>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Putar kendaraan (0° - 360°) dan klik 2x pada bodi mobil untuk menandai titik kerusakan fisik.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowExteriorModal(false)}
                style={{ color: '#0f172a', borderRadius: '6px', padding: '0.35rem 0.85rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.825rem' }}
              >
                ✕
              </button>
            </div>

            {/* MODAL BODY (HORIZONTAL ROW: LEFT 360, RIGHT SUMMARY) */}
            <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <VehicleInspector onPartClick={handlePartClick} damages={damages} focusFrame={focusFrame} />
              </div>

              <div style={{ width: '360px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <InspectionSummary
                  damages={damages}
                  onRemoveDamage={handleRemoveDamage}
                  onDamageClick={handleDamageClick}
                  onEditDamage={handleEditDamage}
                />
              </div>
            </div>

            {/* MODAL FOOTER (SAVE VALIDATION BAR) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>
                Total Titik Kerusakan: <b style={{ color: '#0f172a' }}>{damages.length} Titik</b>
              </span>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }}
                  onClick={() => setShowExteriorModal(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.55rem 1.25rem', fontWeight: 700, fontSize: '0.85rem' }}
                  onClick={handleSaveExteriorInspection}
                >
                  Simpan Hasil Inspeksi 360°
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
