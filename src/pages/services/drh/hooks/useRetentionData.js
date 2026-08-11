import { useState, useEffect } from 'react';

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
    chassisNo: 'MHKNC51S8NK001234',
    engineNo: 'K15B123456',
    policeRegNo: 'B 1234 SKT',
    periodYear: '2026',
    periodMonth: '08',
    remindDate: '2026-08-01',
    cannotCallCode: 'TIDAK TERHUBUNG',
    jobType: 'PM 10.000 KM',
    isPDI: 'TIDAK',
    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    categoryKM: 'Reminder Servis (10k-20k KM)',
    odometer: 10250,
    isConfirmed: '0',
    bookingServiceNo: '',
    reason: 'Nomor tidak diangkat setelah 3x mencoba',
    reminderDate: '2026-08-01',
    followUpDate: '2026-08-03',
    remark: 'Follow up ulang via WhatsApp',
    callHistory: [
      { seqNo: 1, callDate: '2026-08-01 09:30', isConfirmed: 'TIDAK', reason: 'Tidak diangkat', employeeName: 'CRO Staff A', remarks: 'Panggilan 1 jam 09:30' },
      { seqNo: 2, callDate: '2026-08-02 14:15', isConfirmed: 'TIDAK', reason: 'Nada sibuk', employeeName: 'CRO Staff A', remarks: 'Panggilan 2 jam 14:15' },
    ],
  },
  {
    retentionNo: 'RET-2026-002',
    customerCode: 'CUST-00431',
    customerName: 'Siti Rahma',
    jobOrderNo: 'SPK-8901',
    jobOrderDate: '2026-01-15',
    jobOrderClosed: '2026-01-15',
    contactName: 'Siti Rahma',
    phoneNo: '081765432109',
    mobilePhone: '081765432109',
    basicModel: 'Ertiga Hybrid',
    transmissionType: 'MT',
    chassisCode: 'NC52S',
    chassisNo: 'MHKNC52S8NK005678',
    engineNo: 'K15B654321',
    policeRegNo: 'B 5678 BDA',
    periodYear: '2026',
    periodMonth: '08',
    remindDate: '2026-08-02',
    cannotCallCode: 'BERHASIL BOOKING',
    jobType: 'Checkup First Month',
    isPDI: 'TIDAK',
    address: 'Jl. Gatot Subroto No. 12, Jakarta Pusat',
    categoryKM: 'Reminder Unit (<10k KM)',
    odometer: 1200,
    isConfirmed: '1',
    bookingServiceNo: 'BKG-2026-0881',
    reason: 'Customer bersedia booking',
    reminderDate: '2026-08-02',
    followUpDate: '2026-08-02',
    remark: 'Booking disetujui tgl 15 Aug 2026 jam 09:00',
    callHistory: [
      { seqNo: 1, callDate: '2026-08-02 10:00', isConfirmed: 'YA', reason: 'Setuju Booking', employeeName: 'CRO Staff B', remarks: 'Booking tgl 15 Aug jam 09:00' },
    ],
  },
  {
    retentionNo: 'RET-2026-003',
    customerCode: 'CUST-01105',
    customerName: 'Hendra Wijaya',
    jobOrderNo: 'SPK-7741',
    jobOrderDate: '2025-11-20',
    jobOrderClosed: '2025-11-20',
    contactName: 'Hendra Wijaya',
    phoneNo: '085611223344',
    mobilePhone: '085611223344',
    basicModel: 'Grand Vitara',
    transmissionType: 'AT',
    chassisCode: 'NC53S',
    chassisNo: 'MHKNC53S8NK009988',
    engineNo: 'K15C998877',
    policeRegNo: 'B 9988 GVT',
    periodYear: '2026',
    periodMonth: '08',
    remindDate: '2026-08-04',
    cannotCallCode: 'DILUAR KOTA',
    jobType: 'PM 20.000 KM',
    isPDI: 'TIDAK',
    address: 'Jl. Rasuna Said No. 88, Jakarta Selatan',
    categoryKM: 'Reminder Servis (10k-20k KM)',
    odometer: 19800,
    isConfirmed: '0',
    bookingServiceNo: '',
    reason: 'Mobil sedang dipakai keluar kota hingga akhir bulan',
    reminderDate: '2026-08-04',
    followUpDate: '2026-08-25',
    remark: 'Hubungi kembali akhir bulan',
    callHistory: [
      { seqNo: 1, callDate: '2026-08-04 11:20', isConfirmed: 'TIDAK', reason: 'Diluar kota', employeeName: 'CRO Staff A', remarks: 'Minta dihubungi lagi tgl 25 Aug' },
    ],
  },
];

export function useRetentionData(filters) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setData(MOCK_RETENTION_LIST);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [filters.year, filters.month]);

  const filteredList = data.filter(item => {
    if (filters.categoryKM && filters.categoryKM !== 'ALL') {
      if (filters.categoryKM === 'Unit' && !item.categoryKM.includes('Unit')) return false;
      if (filters.categoryKM === 'Service' && !item.categoryKM.includes('Servis')) return false;
    }

    if (filters.groupJobType && filters.groupJobType !== 'ALL') {
      if (filters.groupJobType === 'EXPRESS' && !item.jobType.includes('PM')) return false;
      if (filters.groupJobType === 'REGULER' && item.jobType.includes('PM')) return false;
    }

    if (filters.searchPlate && filters.searchPlate.trim() !== '') {
      const q = filters.searchPlate.toLowerCase().trim();
      const matchPlate = item.policeRegNo.toLowerCase().includes(q);
      const matchName  = item.customerName.toLowerCase().includes(q);
      if (!matchPlate && !matchName) return false;
    }

    return true;
  });

  const summary = {
    total: data.length,
    unitCount: data.filter(d => d.categoryKM.includes('Unit')).length,
    serviceCount: data.filter(d => d.categoryKM.includes('Servis')).length,
    bookedCount: data.filter(d => d.isConfirmed === '1').length,
  };

  return { filteredList, summary, isLoading };
}
