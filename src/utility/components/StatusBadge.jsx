import React from 'react';
import { theme } from '../../configs/themeConfig';

export default function StatusBadge({ status }) {
  const getBadgeStyle = (statusStr) => {
    const s = String(statusStr || '').toLowerCase().trim();
    if (s === 'checkedin' || s === '0') {
      return { bg: '#e0f2fe', color: '#0369a1', dot: '#0369a1', label: 'Check-In' };
    }
    if (s === 'wabinprogress' || s === 'in progress' || s === 'inprogress') {
      return { bg: '#e0e7ff', color: '#3730a3', dot: '#3730a3', label: 'Proses WAB' };
    }
    if (s === 'inspected' || s === 'wabdone' || s === '1') {
      return { bg: '#e0e7ff', color: '#3730a3', dot: '#3730a3', label: 'Form WAB Selesai' };
    }
    if (s === 'in-progress' || s === 'inservice' || s === 'assignedtostall' || s === '2' || s === '3') {
      return { bg: '#fef3c7', color: '#b45309', dot: '#b45309', label: 'Dikerjakan' };
    }
    if (s === 'pendingadditionalapproval' || s === '4') {
      return { bg: '#ffe4e6', color: '#be123c', dot: '#be123c', label: 'Menunggu Approval' };
    }
    if (s === 'completed' || s === 'servicecompleted' || s === '5') {
      return { bg: '#dcfce7', color: '#15803d', dot: '#15803d', label: 'Servis Selesai' };
    }
    if (s === 'prehandoverready' || s === '6') {
      return { bg: '#ecfdf5', color: '#047857', dot: '#047857', label: 'Siap Penyerahan' };
    }
    if (s === 'handovercompleted' || s === '7') {
      return { bg: '#f3e8ff', color: '#6b21a8', dot: '#6b21a8', label: 'Selesai Handover' };
    }
    if (s === 'checkedout' || s === '8') {
      return { bg: '#f1f5f9', color: '#475569', dot: '#475569', label: 'Check-Out' };
    }
    return { bg: '#f1f5f9', color: '#475569', dot: '#475569', label: statusStr || 'Check-In' };
  };

  const info = getBadgeStyle(status);

  return (
    <span
      style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.725rem',
        fontWeight: 700,
        backgroundColor: info.bg,
        border: `1px solid ${info.bg}`,
        color: info.color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        whiteSpace: 'nowrap',
        letterSpacing: '0.2px'
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: info.dot, flexShrink: 0 }} />
      {info.label}
    </span>
  );
}
