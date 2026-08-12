import React from 'react';
import { theme } from '../configs/themeConfig';

export default function PageHeader({ title, action }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.25rem',
    }}>
      <h2 style={{
        fontSize: '1.3rem',
        fontWeight: 800,
        color: theme.color.textPrimary,
        margin: 0,
        letterSpacing: '-0.3px',
      }}>
        {title}
      </h2>
      {action && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>{action}</div>}
    </div>
  );
}
