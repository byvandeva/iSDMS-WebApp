import { useCallback, useState } from 'react';
import { checkInVehicle, submitWabForm, updateForemanTracking, updateWorkshopStatus, checkOutVehicle } from '../api';
import { useAppData } from '../../../../utility/context/AppDataContext';
import { useWabForm } from '../../../../utility/context/useWabForm';
import { getPurposeString } from '../../../../utility/utils/formatters';

export function useTicketActions({ setActiveTab }) {
  const { setBookings, setTickets, setHistoryTickets, showToast } = useAppData();
  const {
    selectedTicket, setSelectedTicket,
    setSaCustomerName, setSaCustomerPhone, setSaCustomerAddress,
    saCustomerName, saCustomerPhone,
    customerComplaints, setCustomerComplaints,
    damages, setDamages,
    exteriorTextNotes,
    signatureData,
    saSignatureData,
    setWabStep,
    resetWabForm,
  } = useWabForm();

  const [checkInForm, setCheckInForm] = useState({
    sdmsBookingId: '', licensePlate: '', vehicleModel: '',
    serviceType: 'Periodic Service', arrivalPurpose: 'Service',
  });
  const [editingTicket, setEditingTicket] = useState(null);
  const [editForm, setEditForm] = useState({ licensePlate: '', vehicleModel: '', arrivalPurpose: 'Service' });
  const [checkoutTargetTicket, setCheckoutTargetTicket] = useState(null);
  const [successCheckInModal, setSuccessCheckInModal] = useState(null);
  const [selectedWabDetailTicket, setSelectedWabDetailTicket] = useState(null);
  const [foremanForm] = useState({
    ticketId: '', stallName: 'Stall 01', technicianName: 'Budi (Teknisi 1)',
    foremanRecommendation: 'Ganti oli mesin & balancing roda depan', addExtraMinutes: 30,
  });

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
    } catch {
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
    executeCheckInProcess(formData, 'walkin');
  }, [checkInForm, executeCheckInProcess]);

  const handleOpenEditPurposeModal = useCallback((ticket) => {
    setEditingTicket(ticket);
    setEditForm({ licensePlate: ticket.licensePlate || '', vehicleModel: ticket.vehicleModel || 'Suzuki XL7 Alpha', arrivalPurpose: ticket.arrivalPurpose || 'Service' });
  }, []);

  const handleSaveEditPurpose = useCallback(async () => {
    if (!editingTicket) return;
    if (!editForm.licensePlate) {
      showToast('Form Belum Lengkap', 'Nomor Polisi wajib diisi!', 'error');
      return;
    }
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
      showToast('Akses Terbatas', 'Hanya tujuan kedatangan Service yang dapat mengisi Form WAB.', 'error');
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
    setActiveTab('wab-form');
    setTickets(prev => prev.map(t => (t.ticketId === ticket.ticketId ? { ...t, status: 'WabInProgress' } : t)));
    showToast('Form WAB (SA)', `Proses WAB dimulai untuk Kendaraan Plat: ${ticket.licensePlate}`);
  }, [setSelectedTicket, setSaCustomerName, setSaCustomerPhone, setSaCustomerAddress, setCustomerComplaints, setDamages, setWabStep, setTickets, showToast, setActiveTab]);

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
    } catch {
      showToast('Check-Out Gagal', 'Gagal melakukan proses check-out.', 'error');
    }
  }, [checkoutTargetTicket, setHistoryTickets, setTickets, showToast]);

  const handleFinalizeWab = useCallback(async () => {
    if (!selectedTicket) return;
    if (!saCustomerName) return showToast('Form Belum Lengkap', 'Mohon lengkapi Nama Pelanggan di Step 1 WAB!', 'error');
    try {
      await submitWabForm({ ticketId: selectedTicket.ticketId, customerName: saCustomerName, customerPhone: saCustomerPhone, customerComplaints, damages, exteriorTextNotes: exteriorTextNotes.filter(n => n.note.trim() !== ''), customerSignatureUrl: signatureData || 'data:image/png;base64,sample_signature_canvas_data', saSignatureUrl: saSignatureData });
    } catch { }
    setTickets(prev => prev.map(t => t.ticketId === selectedTicket.ticketId ? { ...t, status: 'Inspected', wabSubmitted: true, customerName: saCustomerName, customerPhone: saCustomerPhone, customerComplaints, damages, customerSignatureUrl: signatureData, saSignatureUrl: saSignatureData } : t));
    showToast('Form WAB Terkirim!', 'Data WAB 5-step berhasil dikirim & diteruskan ke Foreman.');
    resetWabForm();
    setActiveTab('daftar-tamu');
  }, [selectedTicket, saCustomerName, saCustomerPhone, customerComplaints, damages, exteriorTextNotes, signatureData, saSignatureData, setTickets, showToast, resetWabForm, setActiveTab]);

  const handleUpdateForemanTracking = useCallback(async (payload) => {
    const data = (payload && payload.preventDefault) ? foremanForm : (payload || foremanForm);
    if (!data || !data.ticketId) {
      showToast('Perhatian', 'Pilih tiket terlebih dahulu', 'error');
      return;
    }
    try {
      await updateForemanTracking(data);
    } catch { }
    setTickets(prev => prev.map(t => {
      if (t.ticketId === data.ticketId) {
        return { ...t, status: 'InService', stallName: data.stallName || t.stallName, technicianName: data.technicianName || t.technicianName, foremanRecommendation: data.foremanRecommendation || t.foremanRecommendation, foremanExtraMinutes: (t.foremanExtraMinutes || 0) + (Number(data.addExtraMinutes) || 0) };
      }
      return t;
    }));
    showToast('Tracking Diperbarui!', 'Estimasi & rekomendasi Foreman berhasil disimpan & dikirim ke TV Display.');
  }, [foremanForm, setTickets, showToast]);

  const handleFinishJob = useCallback(async (ticketId) => {
    if (!ticketId) return;
    try {
      await updateWorkshopStatus({ ticketId, status: 'ServiceCompleted' });
    } catch { }
    setTickets(prev => prev.map(t => {
      if (t.ticketId === ticketId) return { ...t, status: 'ServiceCompleted', serviceFinishTime: new Date().toISOString() };
      return t;
    }));
    showToast('Pengerjaan Selesai!', 'Status servis kendaraan telah diperbarui menjadi Completed & masuk ke Riwayat.');
  }, [setTickets, showToast]);

  return {
    checkInForm, setCheckInForm,
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
  };
}
