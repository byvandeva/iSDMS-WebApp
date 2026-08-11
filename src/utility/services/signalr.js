import * as signalR from '@microsoft/signalr';
import { apiConfig } from '../../configs/apiConfig';

export function createSignalRConnection(onTicketEvent) {
  try {
    const hubUrl = `${apiConfig.baseUrl.replace(/\/api$/, '')}/hubs/service-workflow`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('sdms_auth_token') || ''
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('vehicleCheckedIn', (t) => onTicketEvent && onTicketEvent('vehicleCheckedIn', t));
    connection.on('inspectionUpdated', (t) => onTicketEvent && onTicketEvent('inspectionUpdated', t));
    connection.on('workshopStatusUpdated', (t) => onTicketEvent && onTicketEvent('workshopStatusUpdated', t));
    connection.on('ticketCompleted', (t) => onTicketEvent && onTicketEvent('ticketCompleted', t));

    return connection;
  } catch (err) {
    return {
      start: async () => {},
      stop: async () => {},
      on: () => {},
    };
  }
}
