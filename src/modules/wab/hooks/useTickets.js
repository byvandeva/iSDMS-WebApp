import { useState, useEffect, useCallback } from 'react';
import { fetchBookings, fetchTickets } from '../../../services/api';
import { createSignalRConnection } from '../../../services/signalr';

/**
 * Hook that owns all WAB ticket and booking data.
 * Handles initial fetch, SignalR real-time updates, and exposes a manual refresh.
 */
export function useTickets() {
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [signalStatus, setSignalStatus] = useState('Disconnected');

  const applyTicketUpdate = useCallback((ticket) => {
    const id = ticket.ticketId || ticket.TicketId;
    const sdmsId = ticket.sdmsBookingId || ticket.SdmsBookingId;

    if (sdmsId) {
      setBookings(prev => prev.filter(b => b.sdmsBookingId !== sdmsId));
    }

    setTickets(prev => {
      const index = prev.findIndex(t => (t.ticketId || t.TicketId) === id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = ticket;
        return updated;
      }
      return [ticket, ...prev];
    });
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [bookingData, ticketData] = await Promise.all([
        fetchBookings(),
        fetchTickets(),
      ]);
      setBookings(bookingData);
      setTickets(ticketData);
    } catch (err) {
      console.error('Failed to load WAB data', err);
    }
  }, []);

  useEffect(() => {
    loadData();

    const connection = createSignalRConnection((eventName, ticket) => {
      applyTicketUpdate(ticket);
    });

    if (connection) {
      connection.start()
        .then(() => setSignalStatus('Connected'))
        .catch(() => setSignalStatus('Disconnected'));

      connection.onclose(() => setSignalStatus('Disconnected'));
      connection.onreconnecting(() => setSignalStatus('Reconnecting...'));
      connection.onreconnected(() => setSignalStatus('Connected'));
    }

    return () => {
      connection?.stop();
    };
  }, [loadData, applyTicketUpdate]);

  return { bookings, setBookings, tickets, setTickets, signalStatus, refresh: loadData };
}
