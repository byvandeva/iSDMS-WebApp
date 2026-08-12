import React from 'react';
import { useWabForm } from '../context/useWabForm';
import VehicleInspector from '../../pages/services/wab/components/VehicleInspector';
import InspectionSummary from '../../pages/services/wab/components/InspectionSummary';
import DamageLoggerModal from '../../pages/services/wab/modals/DamageLoggerModal';
import WalkInModal from '../../pages/services/wab/modals/WalkInModal';
import EditTicketModal from '../../pages/services/wab/modals/EditTicketModal';
import CheckOutModal from '../../pages/services/wab/modals/CheckOutModal';
import WabDetailModal from '../../pages/services/wab/modals/WabDetailModal';

export default function GlobalModals({
  showWalkInModal, onCloseWalkInModal, onCheckInSubmit,
  editingTicket, editForm, setEditForm, onCloseEditModal, onSaveEditPurpose,
  checkoutTargetTicket, onCloseCheckOut, onConfirmCheckOut,
  selectedWabDetailTicket, onCloseWabDetail,
  successCheckInModal, onCloseSuccessModal,
}) {
  const {
    isModalOpen, setIsModalOpen, selectedContext,
    handleSaveDamage, handleRemoveDamage, handleDamageClick, handleEditDamage,
    damages, focusFrame, handlePartClick,
    showExteriorModal, setShowExteriorModal, handleSaveExteriorInspection,
  } = useWabForm();

  return (
    <>
      <WalkInModal isOpen={showWalkInModal} onClose={onCloseWalkInModal} onSubmit={onCheckInSubmit} />
      <EditTicketModal editingTicket={editingTicket} editForm={editForm} setEditForm={setEditForm} onClose={onCloseEditModal} onSave={onSaveEditPurpose} />
      <CheckOutModal checkoutTargetTicket={checkoutTargetTicket} onClose={onCloseCheckOut} onConfirm={onConfirmCheckOut} />
      <WabDetailModal isOpen={Boolean(selectedWabDetailTicket)} ticket={selectedWabDetailTicket} onClose={onCloseWabDetail} />
      <DamageLoggerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveDamage} context={selectedContext} />

      {successCheckInModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000 }}>
          <div className="success-pop-card" style={{ background: '#ffffff', padding: '2rem 2.25rem', borderRadius: '16px', width: 380, textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.2rem' }}>
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                <circle className="animate-circle" cx="38" cy="38" r="34" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
                <path className="animate-check" d="M24 39L33 48L53 28" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 0.35rem 0', color: '#0f172a', fontSize: '1.35rem', fontWeight: 800 }}>{successCheckInModal.title || 'Check-In Berhasil!'}</h3>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.4 }}>{successCheckInModal.details || `Kendaraan ${successCheckInModal.licensePlate} telah resmi terdaftar.`}</p>
            {successCheckInModal.queueNumber && (
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>NOMOR ANTRIAN</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>{successCheckInModal.queueNumber}</span>
              </div>
            )}
            <button type="button" className="btn" style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '0.7rem', fontWeight: 'bold', fontSize: '0.9rem' }} onClick={onCloseSuccessModal}>Selesai</button>
          </div>
        </div>
      )}

      {showExteriorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3800, padding: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '92vw', maxWidth: '1200px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: '#ffffff', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Inspeksi Bodi 360° (Suzuki XL7)</h3>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Putar kendaraan (0° - 360°) dan klik 2x pada bodi mobil untuk menandai titik kerusakan fisik.</span>
              </div>
              <button type="button" onClick={() => setShowExteriorModal(false)} style={{ color: '#0f172a', borderRadius: '6px', padding: '0.35rem 0.85rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.825rem' }}>✕</button>
            </div>
            <div style={{ padding: '1.25rem', overflowY: 'auto', display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <VehicleInspector onPartClick={handlePartClick} damages={damages} focusFrame={focusFrame} />
              </div>
              <div style={{ width: '360px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <InspectionSummary damages={damages} onRemoveDamage={handleRemoveDamage} onDamageClick={handleDamageClick} onEditDamage={handleEditDamage} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Total Titik Kerusakan: <b style={{ color: '#0f172a' }}>{damages.length} Titik</b></span>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.55rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }} onClick={() => setShowExteriorModal(false)}>Batal</button>
                <button type="button" className="btn" style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.55rem 1.25rem', fontWeight: 700, fontSize: '0.85rem' }} onClick={handleSaveExteriorInspection}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
