import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Static retention data (mirrors SDMS DRH schema)
// Replace this with a real API call to GET /api/drh/retention-list when backend is ready
const MOCK_RETENTION_LIST = [
  {
    retentionNo: 'RET-2026-001',
    customerCode: 'CUST-00912',
    customerName: 'Budi Santoso',
    jobOrderNo: 'SPK-8812',
    jobOrderDate: '2026-02-10',
    jobOrderClosed: '2026-02-10',
    contactName: 'Budi Santoso',
    phoneNo: '081234567890',
    mobilePhone: '081234567890',
    basicModel: 'XL7 Alpha',
    transmissionType: 'AT',
    chassisCode: 'NC51S',
    chassisNo: 'XL7-881921',
    policeRegNo: 'B 1982 SZX',
    odometer: 4200,
    lastServiceDate: '2026-02-10',
    jobType: 'Reguler Service',
    remark: 'Servis Gratis 5.000 KM & Checkup Awal',
    followUpDate: '2026-08-04',
    visitInitialDesc: 'Walk-In',
    isConfirmed: '0',
    reminderDate: '2026-08-04',
    isBooked: '0',
    bookingDate: '2026-08-10',
    isVisited: '0',
    isSatisfied: '1',
    reason: '',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    isFollowUp: 'TIDAK',
    isReminder: 'YA',
    cannotCallCode: 'NC01',
    regChk: 'A',
    exChk: '',
    categoryKM: 'Unit (<10k KM)',
    periodYear: '2026',
    periodMonth: '08',
    callHistory: [
      { seqNo: 1, jobOrderNo: 'SPK-8812', jobType: 'Reguler Service', callDate: '2026-08-01 10:30', isConfirmed: 'TIDAK', reason: 'Tidak Ada Jawaban (NC01)', remarks: 'Telepon 3x tidak diangkat', employeeName: 'Siti SA' }
    ]
  },
  {
    retentionNo: 'RET-2026-002',
    customerCode: 'CUST-00441',
    customerName: 'Siti Rahma',
    jobOrderNo: 'SPK-7719',
    jobOrderDate: '2025-11-15',
    jobOrderClosed: '2025-11-15',
    contactName: 'Siti Rahma',
    phoneNo: '081398765432',
    mobilePhone: '081398765432',
    basicModel: 'All New Ertiga Hybrid',
    transmissionType: 'AT',
    chassisCode: 'NC32S',
    chassisNo: 'ERT-442109',
    policeRegNo: 'B 2410 ERT',
    odometer: 12500,
    lastServiceDate: '2025-11-15',
    jobType: 'Express Maintenance',
    remark: 'Servis Berkala 10.000 KM Periodic Maintenance',
    followUpDate: '2026-08-02',
    visitInitialDesc: 'Booking SDMS',
    isConfirmed: '1',
    reminderDate: '2026-08-01',
    isBooked: '1',
    bookingDate: '2026-08-08',
    isVisited: '0',
    isSatisfied: '1',
    reason: 'Booking Service CC01',
    address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
    isFollowUp: 'YA',
    isReminder: 'YA',
    cannotCallCode: 'CC01',
    regChk: '10K',
    exChk: 'A',
    categoryKM: 'Service (10k-20k KM)',
    periodYear: '2026',
    periodMonth: '08',
    callHistory: [
      { seqNo: 1, jobOrderNo: 'SPK-7719', jobType: 'Express Maintenance', callDate: '2026-08-02 14:15', isConfirmed: 'YA', reason: 'Booking Service (CC01)', remarks: 'Pelanggan setuju booking tanggal 8 Aug jam 09:00', employeeName: 'Budi SA' }
    ]
  },
  {
    retentionNo: 'RET-2026-003',
    customerCode: 'CUST-00812',
    customerName: 'Hendra Wijaya',
    jobOrderNo: 'SPK-9011',
    jobOrderDate: '2026-01-20',
    jobOrderClosed: '2026-01-20',
    contactName: 'Hendra Wijaya',
    phoneNo: '081122334455',
    mobilePhone: '081122334455',
    basicModel: 'Grand Vitara',
    transmissionType: 'AT',
    chassisCode: 'NC72S',
    chassisNo: 'GVT-991204',
    policeRegNo: 'B 8821 GVT',
    odometer: 8900,
    lastServiceDate: '2026-01-20',
    jobType: 'Reguler Service',
    remark: 'Ganti Oli & Filter Udara',
    followUpDate: '2026-08-03',
    visitInitialDesc: 'Walk-In',
    isConfirmed: '1',
    reminderDate: '2026-08-03',
    isBooked: '0',
    bookingDate: '2026-08-12',
    isVisited: '0',
    isSatisfied: '1',
    reason: 'KM Belum Sampai CC02',
    address: 'Jl. Asia Afrika No. 8, Jakarta Pusat',
    isFollowUp: 'TIDAK',
    isReminder: 'YA',
    cannotCallCode: 'CC02',
    regChk: 'B',
    exChk: '',
    categoryKM: 'Unit (<10k KM)',
    periodYear: '2026',
    periodMonth: '08',
    callHistory: [
      { seqNo: 1, jobOrderNo: 'SPK-9011', jobType: 'Reguler Service', callDate: '2026-08-03 11:00', isConfirmed: 'YA', reason: 'KM Belum sampai (CC02)', remarks: 'KM saat ini baru 8.900, akan kembali 2 minggu lagi', employeeName: 'Siti SA' }
    ]
  },
  {
    retentionNo: 'RET-2026-004',
    customerCode: 'CUST-00319',
    customerName: 'Rian Pratama',
    jobOrderNo: 'SPK-6102',
    jobOrderDate: '2025-09-10',
    jobOrderClosed: '2025-09-10',
    contactName: 'Rian Pratama',
    phoneNo: '081765432109',
    mobilePhone: '081765432109',
    basicModel: 'Jimny 5-Door',
    transmissionType: 'MT',
    chassisCode: 'NC44S',
    chassisNo: 'JMN-331002',
    policeRegNo: 'B 3019 JMN',
    odometer: 18400,
    lastServiceDate: '2025-09-10',
    jobType: 'Reguler Service',
    remark: 'Servis Berkala 20.000 KM & Tuning Mesin',
    followUpDate: '2026-08-04',
    visitInitialDesc: 'Booking WAB',
    isConfirmed: '1',
    reminderDate: '2026-08-02',
    isBooked: '1',
    bookingDate: '2026-08-05',
    isVisited: '1',
    isSatisfied: '1',
    reason: 'Booking Service CC01',
    address: 'Jl. Boulevard Kelapa Gading No. 12, Jakarta Utara',
    isFollowUp: 'YA',
    isReminder: 'YA',
    cannotCallCode: 'CC01',
    regChk: '20K',
    exChk: '',
    categoryKM: 'Service (10k-20k KM)',
    periodYear: '2026',
    periodMonth: '08',
    callHistory: [
      { seqNo: 1, jobOrderNo: 'SPK-6102', jobType: 'Reguler Service', callDate: '2026-08-02 09:30', isConfirmed: 'YA', reason: 'Booking Service (CC01)', remarks: 'Konfirmasi WAB untuk tanggal 5 Aug jam 10:00', employeeName: 'Budi SA' }
    ]
  }
];

/**
 * Hook to load and filter DRH retention data.
 * Currently uses local mock data; swap `fetchFromApi` call when the backend is ready.
 *
 * @param {object} filters - { year, month, transOption, inclPDI, inclCRO, groupJobType, categoryKM, searchPlate }
 */
export function useRetentionData(filters = {}) {
  const {
    year = '2026',
    month = '08',
    transOption = '0',
    inclPDI = '0',
    inclCRO = '0',
    groupJobType = 'ALL',
    categoryKM = 'ALL',
    searchPlate = '',
  } = filters;

  const [retentionList, setRetentionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // TODO: replace with real API call:
    // fetch(`${API_BASE}/drh/retention-list?year=${year}&month=${month}&...`)
    const timer = setTimeout(() => {
      setRetentionList(MOCK_RETENTION_LIST);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [year, month]);

  // Client-side filtering (mirrors legacy svDailyRetention filter logic)
  const filteredList = retentionList.filter(item => {
    if (transOption === '1' && item.isFollowUp !== 'YA') return false;
    if (categoryKM === 'Unit' && item.categoryKM !== 'Unit (<10k KM)') return false;
    if (categoryKM === 'Service' && item.categoryKM !== 'Service (10k-20k KM)') return false;
    if (groupJobType === 'EXPRESS' && item.jobType !== 'Express Maintenance') return false;
    if (groupJobType === 'REGULER' && item.jobType !== 'Reguler Service') return false;
    if (searchPlate && !item.policeRegNo.toLowerCase().includes(searchPlate.toLowerCase())) return false;
    return true;
  });

  // Summary counts derived from full list (not filtered)
  const summary = {
    total: retentionList.length,
    unitCount: retentionList.filter(r => r.categoryKM === 'Unit (<10k KM)').length,
    serviceCount: retentionList.filter(r => r.categoryKM === 'Service (10k-20k KM)').length,
    bookedCount: retentionList.filter(r => r.isBooked === '1').length,
  };

  return { filteredList, summary, isLoading, error };
}
