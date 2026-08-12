import React from 'react';
import TicketCard, { TIME_SLOTS } from './TicketCard';

export default function StatusBoard({ tickets }) {
  if (tickets.length === 0) {
    return (
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔧</div>
        <div style={{ color: '#475569', fontSize: '1.15rem', fontWeight: 600 }}>
          Belum ada kendaraan yang masuk di bengkel hari ini.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
      overflow: 'hidden',
    }}>
      <div style={{
        flexShrink: 0,
        display: 'grid',
        gridTemplateColumns: `280px repeat(${TIME_SLOTS.length}, minmax(90px, 1fr))`,
        background: '#0f172a',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '0.85rem',
        textAlign: 'center',
        borderBottom: '2px solid #0054a6',
      }}>
        <div style={{ padding: '0.75rem 1rem', textAlign: 'left', borderRight: '1px solid #334155' }}>
          INFO SERVICE &amp; JANJI SELESAI
        </div>
        {TIME_SLOTS.map(slot => (
          <div key={slot} style={{ padding: '0.75rem 0.25rem', borderRight: '1px solid #334155', letterSpacing: '0.5px' }}>
            {slot}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {tickets.map((ticket, index) => (
          <TicketCard key={ticket.ticketId || index} ticket={ticket} rowIndex={index} />
        ))}
      </div>
    </div>
  );
}
