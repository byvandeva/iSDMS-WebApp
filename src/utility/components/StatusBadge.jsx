import React from 'react';
import { theme } from '../../configs/themeConfig';

export default function StatusBadge({ status }) {
  const getBadgeStyle = (statusStr) => {
    const s = String(statusStr || '').toLowerCase().trim();
    if (s === 'checkedin' || s === '0') {
      return { bg: '#e0f2fe', color: '#0369a1', label: 'Check-In' };
    }
    if (s === 'inspected' || s === 'wabdone' || s === '1') {
      return { bg: '#e0e7ff', color: '#3730a3', label: 'Form WAB Selesai' };
    }
    if (s === 'in-progress' || s === 'inservice' || s === 'assignedtostall' || s === '2' || s === '3') {
      return { bg: '#dbeafe', color: '#1e40af', label: 'Dikerjakan' };
    }
    if (s === 'completed' || s === 'servicecompleted' || s === '5') {
      return { bg: '#dcfce7', color: '#15803d', label: 'Selesai' };
    }
    if (s === 'prehandoverready' || s === '6') {
      return { bg: '#fef9c3', color: '#a16207', label: 'Siap Penyerahan' };
    }
    if (s === 'handovercompleted' || s === '7') {
      return { bg: '#f3e8ff', color: '#6b21a8', label: 'Selesai Handover' };
    }
    if (s === 'checkedout' || s === '8') {
      return { bg: '#f1f5f9', color: '#475569', label: 'Check-Out' };
    }
    return { bg: '#f1f5f9', color: '#475569', label: statusStr || 'Draft' };
  };

  const info = getBadgeStyle(status);

  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: theme.radius.sm,
        fontSize: theme.font.sizeXs,
        fontWeight: 700,
        backgroundColor: info.bg,
        color: info.color,
        display: 'inline-block',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}
    >
      {info.label}
    </span>
  );
}
