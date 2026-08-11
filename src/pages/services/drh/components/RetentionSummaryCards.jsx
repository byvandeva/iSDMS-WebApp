import React from 'react';

export default function RetentionSummaryCards({ summary }) {
  const cards = [
    {
      label: 'Total Retensi',
      value: summary.total,
      unit: 'Unit',
      description: 'Daily Retention Queue',
    },
    {
      label: 'Reminder Unit (<10k KM)',
      value: summary.unitCount,
      unit: 'Unit',
      description: 'Servis Pertama & Checkup Awal',
    },
    {
      label: 'Reminder Servis (10k-20k KM)',
      value: summary.serviceCount,
      unit: 'Unit',
      description: 'Periodic Maintenance',
    },
    {
      label: 'Booking Terkonfirmasi',
      value: summary.bookedCount,
      unit: 'Unit',
      description: 'Terhubung & Booking Service',
    },
  ];

  return (
    <div className="drh-summary-cards">
      {cards.map(card => (
        <div key={card.label} className="drh-summary-card">
          <div className="drh-card-label">{card.label}</div>
          <div className="drh-card-value">
            {card.value}
            <span className="drh-card-unit"> {card.unit}</span>
          </div>
          <div className="drh-card-description">{card.description}</div>
        </div>
      ))}
    </div>
  );
}
