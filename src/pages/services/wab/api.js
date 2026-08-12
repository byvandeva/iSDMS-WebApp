import httpClient from '../../../utility/http/httpClient';

export function normalizeSdmsBooking(raw) {
  if (!raw) return null;
  return {
    companyCode: raw.CompanyCode || raw.companyCode || '',
    branchCode: raw.BranchCode || raw.branchCode || '',
    sdmsBookingId: raw.BookingNo || raw.bookingNo || raw.sdmsBookingId || '',
    bookingNo: raw.BookingNo || raw.bookingNo || raw.sdmsBookingId || '',
    reservasiDate: raw.ReservasiDate || raw.reservasiDate || '',
    reservasiTime: raw.ReservasiTime || raw.reservasiTime || raw.bookingTime || '',
    bookingTime: raw.ReservasiTime || raw.reservasiTime || raw.bookingTime || '',
    stallCode: raw.StallCode || raw.stallCode || '',
    bookingSource: raw.BookingSource || raw.bookingSource || 'SDMS',
    customerName: raw.CustomerName || raw.customerName || '',
    customerPhone: raw.TelponNo || raw.telponNo || raw.customerPhone || '',
    telponNo: raw.TelponNo || raw.telponNo || raw.customerPhone || '',
    licensePlate: (raw.PoliceRegNo || raw.policeRegNo || raw.licensePlate || '').toUpperCase(),
    policeRegNo: (raw.PoliceRegNo || raw.policeRegNo || raw.licensePlate || '').toUpperCase(),
    vehicleModel: raw.GroupCode || raw.groupCode || raw.vehicleModel || '',
    groupCode: raw.GroupCode || raw.groupCode || raw.vehicleModel || '',
    odometer: raw.Odometer || raw.odometer || 0,
    serviceType: raw.JobType || raw.jobType || raw.serviceType || 'Periodic Service',
    jobType: raw.JobType || raw.jobType || raw.serviceType || 'Periodic Service',
    jobTime: raw.JobTime || raw.jobTime || null,
    additionalTime: raw.AdditionalTime ?? raw.additionalTime ?? 0,
    finishJobTime: raw.FinishJobTime || raw.finishJobTime || null,
    finishTime: raw.FinishTime || raw.finishTime || null,
    serviceRequest: raw.ServiceRequest || raw.serviceRequest || '1',
    remark: raw.Remark || raw.remark || null,
    serviceAdvisor: raw.ServiceAdvisor || raw.serviceAdvisor || '',
    foremanId: raw.ForemanID || raw.foremanId || null,
    mechanicId: raw.MechanicID || raw.mechanicId || null,
    createdBy: raw.CreatedBy || raw.createdBy || '',
    createdDate: raw.CreatedDate || raw.createdDate || '',
    updatedBy: raw.UpdatedBy || raw.updatedBy || '',
    updatedDate: raw.UpdatedDate || raw.updatedDate || '',
    arrivalPurpose: raw.arrivalPurpose || 'Service',
    isPriorityBooking: true,
  };
}

export async function fetchBookings() {
  try {
    const res = await httpClient.get('/bookings');
    const rawList = res.data || res || [];
    return Array.isArray(rawList) ? rawList.map(normalizeSdmsBooking) : [];
  } catch (e) {
    return [
      normalizeSdmsBooking({
        CompanyCode: "6006406",
        BranchCode: "6006401",
        BookingNo: "BO401/25/002479",
        ReservasiDate: "2026-02-26 00:00:00.000",
        ReservasiTime: "09:30",
        StallCode: "STALL-01",
        BookingSource: "NEW",
        CustomerName: "ANANTYA NALA PRABATA",
        TelponNo: "08118207657",
        PoliceRegNo: "B1697TYK",
        GroupCode: "SWIFT (CBU)",
        Odometer: "2222222",
        JobType: "PAKET 10.000 KM",
        JobTime: null,
        AdditionalTime: 0,
        FinishJobTime: null,
        FinishTime: null,
        ServiceRequest: "1",
        Remark: null,
        ServiceAdvisor: "58970",
        ForemanID: null,
        MechanicID: null,
        CreatedBy: "ga",
        CreatedDate: "2026-02-24 13:28:48.860",
        UpdatedBy: "ga",
        UpdatedDate: "2026-02-24 13:28:48.860"
      }),
      normalizeSdmsBooking({
        CompanyCode: "6006406",
        BranchCode: "6006401",
        BookingNo: "BO401/25/002480",
        ReservasiDate: "2026-02-26 00:00:00.000",
        ReservasiTime: "10:30",
        StallCode: "STALL-02",
        BookingSource: "SDMS",
        CustomerName: "Siti Rahma",
        TelponNo: "089876543210",
        PoliceRegNo: "B5678XYZ",
        GroupCode: "SUZUKI ALL NEW ERTIGA HYBRID",
        Odometer: "15000",
        JobType: "GENERAL REPAIR",
        ServiceAdvisor: "58970"
      }),
      normalizeSdmsBooking({
        CompanyCode: "6006406",
        BranchCode: "6006401",
        BookingNo: "BO401/25/002481",
        ReservasiDate: "2026-02-26 00:00:00.000",
        ReservasiTime: "11:00",
        StallCode: "STALL-03",
        BookingSource: "SDMS",
        CustomerName: "PT Trans Jaya",
        TelponNo: "081122334455",
        PoliceRegNo: "B9999SZK",
        GroupCode: "SUZUKI CARRY PICK UP",
        Odometer: "30000",
        JobType: "PAKET 30.000 KM",
        ServiceAdvisor: "58971"
      })
    ];
  }
}

const MOCK_FALLBACK_TICKETS = [
  {
    ticketId: 't-101',
    ticketNo: 'TICK-1001',
    queueNumber: 'BO401/25/002479',
    arrivalPurpose: 'Service',
    sdmsBookingId: 'BO401/25/002479',
    bookingNo: 'BO401/25/002479',
    licensePlate: 'B 1697 TYK',
    policeRegNo: 'B 1697 TYK',
    customerName: 'ANANTYA NALA PRABATA',
    customerPhone: '08118207657',
    telponNo: '08118207657',
    vehicleModel: 'SWIFT (CBU)',
    groupCode: 'SWIFT (CBU)',
    serviceType: 'PAKET 10.000 KM',
    jobType: 'PAKET 10.000 KM',
    odometer: 2222222,
    reservasiDate: '2026-02-26 00:00:00.000',
    reservasiTime: '09:30',
    stallCode: 'STALL-01',
    serviceAdvisor: '58970',
    companyCode: '6006406',
    branchCode: '6006401',
    bookingSource: 'NEW',
    status: 'InService',
    stallName: 'Stall 01',
    checkInTime: new Date(Date.now() - 3600000).toISOString(),
    saTargetFinishTime: new Date(Date.now() + 1800000).toISOString(),
    foremanExtraMinutes: 0
  },
  {
    ticketId: 't-102',
    ticketNo: 'TICK-1002',
    queueNumber: 'BO401/25/002480',
    arrivalPurpose: 'Service',
    sdmsBookingId: 'BO401/25/002480',
    bookingNo: 'BO401/25/002480',
    licensePlate: 'B 5678 XYZ',
    policeRegNo: 'B 5678 XYZ',
    customerName: 'Siti Rahma',
    customerPhone: '089876543210',
    telponNo: '089876543210',
    vehicleModel: 'SUZUKI ALL NEW ERTIGA HYBRID',
    groupCode: 'SUZUKI ALL NEW ERTIGA HYBRID',
    serviceType: 'GENERAL REPAIR',
    jobType: 'GENERAL REPAIR',
    odometer: 15000,
    reservasiDate: '2026-02-26 00:00:00.000',
    reservasiTime: '10:30',
    stallCode: 'STALL-02',
    serviceAdvisor: '58970',
    companyCode: '6006406',
    branchCode: '6006401',
    bookingSource: 'SDMS',
    status: 'ServiceCompleted',
    stallName: 'Stall 02',
    checkInTime: new Date(Date.now() - 5400000).toISOString(),
    saTargetFinishTime: new Date(Date.now() + 600000).toISOString(),
    foremanExtraMinutes: 15,
    isOverdueWithForemanExtension: true
  },
  {
    ticketId: 't-103',
    ticketNo: 'TICK-1003',
    queueNumber: 'W-003',
    arrivalPurpose: 'Service',
    sdmsBookingId: null,
    licensePlate: 'B 9999 SZK',
    policeRegNo: 'B 9999 SZK',
    customerName: 'PT Trans Jaya',
    customerPhone: '081122334455',
    telponNo: '081122334455',
    vehicleModel: 'SUZUKI CARRY PICK UP',
    groupCode: 'SUZUKI CARRY PICK UP',
    serviceType: 'PAKET 30.000 KM',
    jobType: 'PAKET 30.000 KM',
    odometer: 30000,
    reservasiDate: '',
    reservasiTime: '',
    stallCode: 'STALL-03',
    serviceAdvisor: '58971',
    companyCode: '6006406',
    branchCode: '6006401',
    bookingSource: 'WALK-IN',
    status: 'CheckedIn',
    stallName: 'Penerimaan',
    checkInTime: new Date(Date.now() - 1800000).toISOString(),
    saTargetFinishTime: new Date(Date.now() + 7200000).toISOString(),
    foremanExtraMinutes: 0
  },
  {
    ticketId: 't-104',
    ticketNo: 'TICK-1004',
    queueNumber: 'W-004',
    arrivalPurpose: 'Service',
    sdmsBookingId: null,
    licensePlate: 'B 2345 DEF',
    policeRegNo: 'B 2345 DEF',
    customerName: 'Agus Wijaya',
    customerPhone: '081234567890',
    vehicleModel: 'SUZUKI GRAND VITARA',
    groupCode: 'SUZUKI GRAND VITARA',
    serviceType: 'PAKET 20.000 KM',
    status: 'InService',
    stallName: 'Stall 02',
    checkInTime: new Date(Date.now() - 2700000).toISOString(),
    saTargetFinishTime: new Date(Date.now() + 3600000).toISOString(),
    foremanExtraMinutes: 0
  }
];

export async function fetchTickets() {
  try {
    const res = await httpClient.get('/tickets');
    const data = res.data || res;
    return Array.isArray(data) && data.length > 0 ? data : MOCK_FALLBACK_TICKETS;
  } catch (e) {
    return MOCK_FALLBACK_TICKETS;
  }
}

export async function checkInVehicle(data) {
  try {
    const payload = {
      CompanyCode: data.companyCode || '6006406',
      BranchCode: data.branchCode || '6006401',
      BookingNo: data.sdmsBookingId || data.bookingNo || null,
      PoliceRegNo: (data.licensePlate || '').toUpperCase().trim(),
      GroupCode: data.vehicleModel || 'Suzuki XL7',
      JobType: data.serviceType || 'Periodic Service',
      arrivalPurpose: data.arrivalPurpose || 'Service'
    };
    const res = await httpClient.post('/checkin', payload);
    return res.data || res;
  } catch (e) {
    const isService = (data.arrivalPurpose || 'Service') === 'Service';
    const bookingId = data.sdmsBookingId || data.bookingNo;
    let qNum = null;
    if (isService) {
      if (bookingId) {
        qNum = bookingId;
      } else {
        qNum = 'W-' + Math.floor(100 + Math.random() * 900);
      }
    }
    return {
      ticketId: 't-' + Date.now(),
      ticketNo: 'TICK-' + Date.now().toString().slice(-6),
      queueNumber: qNum,
      arrivalPurpose: data.arrivalPurpose || 'Service',
      sdmsBookingId: bookingId || null,
      bookingNo: bookingId || null,
      licensePlate: (data.licensePlate || data.policeRegNo || 'B 1234 ABC').toUpperCase(),
      policeRegNo: (data.policeRegNo || data.licensePlate || 'B 1234 ABC').toUpperCase(),
      customerName: data.customerName || '-',
      customerPhone: data.customerPhone || data.telponNo || '-',
      telponNo: data.telponNo || data.customerPhone || '-',
      vehicleModel: data.vehicleModel || data.groupCode || 'Suzuki XL7',
      groupCode: data.groupCode || data.vehicleModel || 'Suzuki XL7',
      serviceType: data.serviceType || data.jobType || 'Periodic Service',
      jobType: data.jobType || data.serviceType || 'Periodic Service',
      reservasiTime: data.reservasiTime || data.bookingTime || data.ReservasiTime || null,
      bookingTime: data.reservasiTime || data.bookingTime || data.ReservasiTime || null,
      reservasiDate: data.reservasiDate || data.ReservasiDate || null,
      status: 'CheckedIn',
      checkInTime: new Date().toISOString()
    };
  }
}

export async function checkOutVehicle(data) {
  try {
    const res = await httpClient.post('/security/checkout', data);
    return res.data || res;
  } catch (e) {
    return { ticketId: data.ticketId, status: 'CheckedOut' };
  }
}

export async function changeArrivalPurpose(data) {
  try {
    const res = await httpClient.put('/tickets/purpose', data);
    return res.data || res;
  } catch (e) {
    return { ticketId: data.ticketId, arrivalPurpose: data.newPurpose, queueNumber: 'W-999' };
  }
}

export async function submitWabForm(data) {
  try {
    const res = await httpClient.post('/tickets/wab', data);
    return res.data || res;
  } catch (e) {
    return { ticketId: data.ticketId, status: 'Inspected' };
  }
}

export async function updateForemanTracking(data) {
  try {
    const res = await httpClient.put('/tickets/foreman-tracking', data);
    return res.data || res;
  } catch (e) {
    return { ticketId: data.ticketId, status: 'InService' };
  }
}

export async function updateWorkshopStatus(data) {
  try {
    const res = await httpClient.post('/workshop/status', data);
    return res.data || res;
  } catch (e) {
    return { ticketId: data.ticketId, status: data.status };
  }
}
