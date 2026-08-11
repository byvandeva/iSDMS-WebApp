import React from 'react';
import { theme } from '../configs/themeConfig';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: `1px solid ${theme.color.borderLight}`, paddingBottom: '0.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: theme.color.textPrimary, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: theme.font.sizeSm, color: theme.color.textMuted, margin: '2px 0 0 0' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
