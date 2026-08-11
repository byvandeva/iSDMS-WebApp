import httpClient from '../../utility/http/httpClient';

const FALLBACK_TICKETS = [
  { ticketId: '1', queueNumber: 'W-001', licensePlate: 'B 1234 ABC', customerName: 'Budi Santoso', vehicleModel: 'Suzuki XL7 Alpha', status: 'InService', stallName: 'Stall 01', checkInTime: new Date().toISOString(), saTargetFinishTime: new Date(Date.now() + 3600000).toISOString(), foremanExtraMinutes: 0 },
  { ticketId: '2', queueNumber: 'W-002', licensePlate: 'B 5678 XYZ', customerName: 'Siti Rahma', vehicleModel: 'Suzuki All New Ertiga', status: 'ServiceCompleted', stallName: 'Stall 03', checkInTime: new Date().toISOString(), saTargetFinishTime: new Date(Date.now() + 1800000).toISOString(), foremanExtraMinutes: 15, isOverdueWithForemanExtension: true },
  { ticketId: '3', queueNumber: 'W-003', licensePlate: 'B 9999 SZK', customerName: 'PT Trans Jaya', vehicleModel: 'Suzuki Carry Pick Up', status: 'CheckedIn', stallName: 'Penerimaan', checkInTime: new Date().toISOString(), saTargetFinishTime: new Date(Date.now() + 5400000).toISOString(), foremanExtraMinutes: 0 },
  { ticketId: '4', queueNumber: 'W-004', licensePlate: 'B 2345 DEF', customerName: 'Agus Wijaya', vehicleModel: 'Suzuki Grand Vitara', status: 'InService', stallName: 'Stall 02', checkInTime: new Date().toISOString(), saTargetFinishTime: new Date(Date.now() + 2700000).toISOString(), foremanExtraMinutes: 0 },
];

export async function fetchTickets() {
  try {
    const res = await httpClient.get('/tickets');
    const data = res.data || res;
    return Array.isArray(data) ? data : FALLBACK_TICKETS;
  } catch (err) {
    return FALLBACK_TICKETS;
  }
}
