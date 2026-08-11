import React from 'react';
import { theme } from '../../../../configs/themeConfig';
import ModalWrapper, { ModalCard } from '../../../../utility/components/ModalWrapper';

export default function CheckOutModal({ checkoutTargetTicket, onClose, onConfirm }) {
  if (!checkoutTargetTicket) return null;

  return (
    <ModalWrapper>
      <ModalCard width={440}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: theme.color.textPrimary, fontSize: '1.1rem' }}>Konfirmasi Check-Out Gerbang</h3>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', color: theme.color.textSecondary, lineHeight: 1.4 }}>
          Apakah Anda yakin kendaraan <b style={{ color: theme.color.textPrimary }}>{checkoutTargetTicket.licensePlate}</b> ({checkoutTargetTicket.vehicleModel}) telah rilis dan keluar dari gerbang?
        </p>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Batal</button>
          <button type="button" className="btn" style={{ flex: 1.5, backgroundColor: theme.color.dark, color: theme.color.surface }} onClick={onConfirm}>Check-Out</button>
        </div>
      </ModalCard>
    </ModalWrapper>
  );
}
