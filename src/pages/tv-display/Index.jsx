import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { fetchTickets } from './api';
import StatusBoard from './components/StatusBoard';

const PAGE_SIZE = 5;
const PAGE_DURATION = 8000;
const HUB_URL = import.meta.env.VITE_HUB_URL || 'http://localhost:5000/hubs/service-workflow';

export default function TvDisplayPage({ tickets: parentTickets = [] }) {
  const [tickets, setTickets] = useState(parentTickets);
  const [currentTime, setCurrentTime] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageProgress, setPageProgress] = useState(0);

  useEffect(() => {
    if (Array.isArray(parentTickets) && parentTickets.length > 0) {
      setTickets(parentTickets);
    }
  }, [parentTickets]);

  useEffect(() => {
    const updateClock = () =>
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(tickets.length / PAGE_SIZE);
    if (totalPages <= 1) { setCurrentPage(0); setPageProgress(0); return; }

    setPageProgress(0);

    const flipInterval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
      setPageProgress(0);
    }, PAGE_DURATION);

    const tickInterval = setInterval(() => {
      setPageProgress(prev => Math.min(100, prev + (50 / PAGE_DURATION) * 100));
    }, 50);

    return () => {
      clearInterval(flipInterval);
      clearInterval(tickInterval);
    };
  }, [tickets.length]);

  const applyTicketUpdate = (updatedTicket) => {
    setTickets(prev => {
      const index = prev.findIndex(t => t.ticketId === updatedTicket.ticketId);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedTicket;
        return next;
      }
      return [updatedTicket, ...prev];
    });
  };

  useEffect(() => {
    fetchTickets().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setTickets(data);
      }
    });

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    connection.on('vehicleCheckedIn', applyTicketUpdate);
    connection.on('inspectionUpdated', applyTicketUpdate);
    connection.on('workshopStatusUpdated', applyTicketUpdate);
    connection.on('ticketCompleted', applyTicketUpdate);

    connection.start().catch(console.error);
    return () => connection.stop();
  }, []);

  const displayTickets = (tickets && tickets.length > 0) ? tickets : parentTickets;

  const activeTickets = displayTickets.filter(t => {
    const s = String(t.status).toLowerCase();
    return s !== 'checkedout' && s !== '8';
  });

  const totalPages = Math.max(1, Math.ceil(activeTickets.length / PAGE_SIZE));
  const pageTickets = activeTickets.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div style={{ padding: '1.25rem', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#0f172a', overflow: 'hidden' }}>
      <header style={{ flexShrink: 0, background: '#fff', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '1.25rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/assets/logos/suzuki_logo.svg" alt="Suzuki Logo" style={{ height: '45px', objectFit: 'contain' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                  LIVE SCHEDULE &amp; PROGRESS
                </h1>
                {totalPages > 1 && (
                  <span style={{ fontSize: '0.75rem', color: '#0f172a', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {currentPage + 1} / {totalPages}
                  </span>
                )}
              </div>
              <p style={{ margin: '0.15rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Customer Lounge Progress Board
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {typeof window !== 'undefined' && !window.location.search.includes('mode=tv') && (
              <button
                type="button"
                onClick={() => window.open('?mode=tv', '_blank')}
                style={{ background: '#0054a6', color: '#ffffff', border: 'none', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                ↗ Open Fullscreen
              </button>
            )}
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>{currentTime}</div>
              <div style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}>● Live</div>
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div style={{ height: '3px', background: '#eef2f7' }}>
            <div style={{
              height: '100%',
              width: `${pageProgress}%`,
              background: 'linear-gradient(90deg, #cbd5e1, #cbd5e1)',
              transition: 'width 50ms linear',
            }} />
          </div>
        )}
      </header>

      <div style={{ flex: 1, minHeight: 0 }}>
        <StatusBoard tickets={pageTickets} />
      </div>
    </div>
  );
}
