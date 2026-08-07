const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error("Failed fetching bookings");
    return await res.json();
  } catch (e) {
    console.warn("Backend API offline, returning dummy bookings", e);
    return [
      { sdmsBookingId: "B-001", customerName: "Budi Santoso", arrivalPurpose: "Service", licensePlate: "B 1234 ABC", bookingTime: "09:00", categoryPassComm: "Passenger", customerPhone: "081234567890", vehicleModel: "Suzuki XL7 Alpha", serviceType: "Periodic Service 10.000 KM" },
      { sdmsBookingId: "B-002", customerName: "Siti Rahma", arrivalPurpose: "Service", licensePlate: "B 5678 XYZ", bookingTime: "10:30", categoryPassComm: "Passenger", customerPhone: "089876543210", vehicleModel: "Suzuki All New Ertiga", serviceType: "General Repair" },
      { sdmsBookingId: "B-003", customerName: "PT Trans Jaya", arrivalPurpose: "Service", licensePlate: "B 9999 SZK", bookingTime: "11:00", categoryPassComm: "Commercial", customerPhone: "081122334455", vehicleModel: "Suzuki Carry Pick Up", serviceType: "Periodic Service 30.000 KM" }
    ];
  }
}

export async function fetchTickets() {
  try {
    const res = await fetch(`${API_BASE}/tickets`);
    if (!res.ok) throw new Error("Failed fetching tickets");
    return await res.json();
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
    const res = await fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("Backend API offline/error, generating local ticket fallback", e);
    const isService = (data.arrivalPurpose || 'Service') === 'Service';
    return {
      ticketId: 't-' + Date.now(),
      ticketNo: 'TICK-' + Date.now().toString().slice(-6),
      queueNumber: isService ? 'W-' + Math.floor(100 + Math.random() * 900) : null,
      arrivalPurpose: data.arrivalPurpose || 'Service',
      sdmsBookingId: data.sdmsBookingId || null,
      licensePlate: (data.licensePlate || 'B 1234 ABC').toUpperCase(),
      customerName: 'Diisi oleh SA di WAB',
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
    const res = await fetch(`${API_BASE}/security/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { ticketId: data.ticketId, status: 'CheckedOut' };
  }
}

export async function changeArrivalPurpose(data) {
  try {
    const res = await fetch(`${API_BASE}/tickets/purpose`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { ticketId: data.ticketId, arrivalPurpose: data.newPurpose, queueNumber: 'W-999' };
  }
}

export async function submitWabForm(data) {
  try {
    const res = await fetch(`${API_BASE}/tickets/wab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { ticketId: data.ticketId, status: 'Inspected' };
  }
}

export async function updateForemanTracking(data) {
  try {
    const res = await fetch(`${API_BASE}/tickets/foreman-tracking`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { ticketId: data.ticketId, status: 'InService' };
  }
}

export async function updateWorkshopStatus(data) {
  try {
    const res = await fetch(`${API_BASE}/workshop/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { ticketId: data.ticketId, status: data.status };
  }
}
