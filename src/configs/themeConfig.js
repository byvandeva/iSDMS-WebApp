export const themeConfig = {
  color: {
    primary: '#0054a6',
    primaryDark: '#002b5c',
    dark: '#0f172a',
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    overlay: 'rgba(15, 23, 42, 0.4)',
    status: {
      checkedIn: '#0284c7',
      inProgress: '#0054a6',
      completed: '#047857',
      completedBg: '#ecfdf5',
      danger: '#dc2626',
      success: '#16a34a',
    },
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
  font: { family: "'Inter', sans-serif", sizeSm: '0.825rem', sizeXs: '0.75rem', sizeMd: '0.9rem' },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.05)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  zIndex: {
    modal: 3500,
    modalTop: 3900,
    modalDropdown: 4000
  }
};

export const theme = themeConfig;
