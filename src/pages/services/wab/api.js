import httpClient from '../../../utility/http/httpClient';

export async function fetchBookings() {
  try {
    const res = await httpClient.get('/bookings');
    return res.data || res;
  } catch (e) {
    return [
      { sdmsBookingId: "B-001", customerName: "Budi Santoso", arrivalPurpose: "Service", licensePlate: "B 1234 ABC", bookingTime: "09:00", categoryPassComm: "Passenger", customerPhone: "081234567890", vehicleModel: "Suzuki XL7 Alpha", serviceType: "Periodic Service 10.000 KM", isPriorityBooking: true },
      { sdmsBookingId: "B-002", customerName: "Siti Rahma", arrivalPurpose: "Service", licensePlate: "B 5678 XYZ", bookingTime: "10:30", categoryPassComm: "Passenger", customerPhone: "089876543210", vehicleModel: "Suzuki All New Ertiga", serviceType: "General Repair", isPriorityBooking: true },
      { sdmsBookingId: "B-003", customerName: "PT Trans Jaya", arrivalPurpose: "Service", licensePlate: "B 9999 SZK", bookingTime: "11:00", categoryPassComm: "Commercial", customerPhone: "081122334455", vehicleModel: "Suzuki Carry Pick Up", serviceType: "Periodic Service 30.000 KM", isPriorityBooking: true },
      { sdmsBookingId: "B-004", customerName: "Rudi Hermawan", arrivalPurpose: "Service", licensePlate: "B 7777 RDI", bookingTime: "13:00", categoryPassComm: "Passenger", customerPhone: "081399887766", vehicleModel: "Suzuki Jimny 5-Door", serviceType: "General Repair", isPriorityBooking: false }
    ];
  }
}

export async function fetchTickets() {
  try {
    const res = await httpClient.get('/tickets');
    return res.data || res;
  } catch (e) {
    return [];
  }
}

export async function checkInVehicle(data) {
  try {
    const payload = {
      sdmsBookingId: data.sdmsBookingId || null,
      licensePlate: (data.licensePlate || '').toUpperCase().trim(),
      vehicleModel: data.vehicleModel || 'Suzuki XL7',
      serviceType: data.serviceType || 'Periodic Service',
      arrivalPurpose: data.arrivalPurpose || 'Service',
      categoryPassComm: data.categoryPassComm || 'Passenger'
    };
    const res = await httpClient.post('/checkin', payload);
    return res.data || res;
  } catch (e) {
    const isService = (data.arrivalPurpose || 'Service') === 'Service';
    const isBooking = Boolean(data.sdmsBookingId);
    let qNum = null;
    if (isService) {
      if (isBooking) {
        qNum = data.sdmsBookingId.startsWith('B-') ? data.sdmsBookingId : `B-${data.sdmsBookingId}`;
      } else {
        qNum = 'W-' + Math.floor(100 + Math.random() * 900);
      }
    }
    return {
      ticketId: 't-' + Date.now(),
      ticketNo: 'TICK-' + Date.now().toString().slice(-6),
      queueNumber: qNum,
      arrivalPurpose: data.arrivalPurpose || 'Service',
      sdmsBookingId: data.sdmsBookingId || null,
      licensePlate: (data.licensePlate || 'B 1234 ABC').toUpperCase(),
      customerName: data.customerName || '-',
      customerPhone: '-',
      vehicleModel: data.vehicleModel || 'Suzuki XL7',
      serviceType: data.serviceType || 'Periodic Service',
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
