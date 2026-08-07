import * as signalR from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_HUB_URL || 'http://localhost:5000/hubs/service-workflow';

export function createSignalRConnection(onEventReceived) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL)
    .withAutomaticReconnect()
    .build();

  connection.on('vehicleCheckedIn', (ticket) => onEventReceived('vehicleCheckedIn', ticket));
  connection.on('inspectionUpdated', (ticket) => onEventReceived('inspectionUpdated', ticket));
  connection.on('workshopStatusUpdated', (ticket) => onEventReceived('workshopStatusUpdated', ticket));
  connection.on('ticketCompleted', (ticket) => onEventReceived('ticketCompleted', ticket));

  return connection;
}
