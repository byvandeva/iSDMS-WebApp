import React from 'react';
import { theme } from '../../configs/themeConfig';

export default function ModalWrapper({ children, zIndex = theme.zIndex.modal, backdropColor = theme.color.overlay }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: backdropColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: zIndex,
        padding: '1rem',
      }}
    >
      {children}
    </div>
  );
}

export function ModalCard({ children, width = 500, style = {} }) {
  return (
    <div
      style={{
        backgroundColor: theme.color.surface,
        borderRadius: theme.radius.lg,
        padding: '1.5rem',
        width: '100%',
        maxWidth: typeof width === 'number' ? `${width}px` : width,
        boxShadow: theme.shadow.modal,
        border: `1px solid ${theme.color.border}`,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
