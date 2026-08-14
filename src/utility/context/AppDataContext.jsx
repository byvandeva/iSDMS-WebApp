import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchBookings, fetchTickets } from '../../pages/services/wab/api';
import { createSignalRConnection } from '../services/signalr';

const AppDataContext = createContext(null);

export function AppDataProvider({ children, onCheckIn }) {
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  const [signalStatus, setSignalStatus] = useState('Disconnected');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, message = '', type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const bData = await fetchBookings();
      setBookings(bData);
      const tData = await fetchTickets();
      setTickets(tData);
    } catch (e) {}
  }, []);

  useEffect(() => {
    loadData();

    const connection = createSignalRConnection((eventName, ticket) => {
      const ticketId = ticket.ticketId || ticket.TicketId;
      const licensePlate = ticket.licensePlate || ticket.LicensePlate;
      const sdmsBookingId = ticket.sdmsBookingId || ticket.SdmsBookingId;

      if (sdmsBookingId) {
        setBookings(prev => prev.filter(b => b.sdmsBookingId !== sdmsBookingId));
      }

      setTickets(prev => {
        const index = prev.findIndex(t => (t.ticketId || t.TicketId) === ticketId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = ticket;
          return updated;
        }
        return [ticket, ...prev];
      });

      if (eventName === 'vehicleCheckedIn') {
        showToast('Check-In Gerbang Real-Time', `Kendaraan ${licensePlate || ''} telah berhasil check-in di gerbang.`);
        if (onCheckIn) onCheckIn();
      }
    });

    if (connection) {
      connection.start()
        .then(() => setSignalStatus('Connected (Live SignalR)'))
        .catch(() => setSignalStatus('Disconnected (Offline)'));

      return () => connection.stop();
    }
  }, [loadData, showToast, onCheckIn]);

  useEffect(() => {
    if (Array.isArray(tickets) && tickets.length > 0) {
      try {
        localStorage.setItem('sdms_wab_tickets', JSON.stringify(tickets));
      } catch (e) {}
    }
  }, [tickets]);

  return (
    <AppDataContext.Provider value={{
      bookings, setBookings,
      tickets, setTickets,
      historyTickets, setHistoryTickets,
      signalStatus,
      toast, setToast, showToast,
      loadData
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
