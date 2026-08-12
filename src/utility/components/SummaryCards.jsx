import React from 'react';
import { theme } from '../../configs/themeConfig';

export default function SummaryCards({ cards }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
      gap: '1rem',
      marginBottom: '1.25rem',
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: theme.color.surface,
          border: `1px solid ${theme.color.borderLight}`,
          borderRadius: theme.radius.lg,
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: card.color || theme.color.textMuted,
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: theme.font.sizeXs,
              color: theme.color.textMuted,
              fontWeight: 500,
            }}>
              {card.label}
            </span>
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: theme.color.textPrimary,
            lineHeight: 1.1,
          }}>
            {card.value}
          </div>
          {card.sub && (
            <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, fontWeight: 500 }}>
              {card.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
