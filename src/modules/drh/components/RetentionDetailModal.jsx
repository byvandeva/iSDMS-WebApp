import React from 'react';
import { X, Car, Phone, Wrench, Calendar, History, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Read-only detail modal for a single DRH retention item.
 * Shows customer info, vehicle info, and call history log.
 * No form inputs — DRH is view-only.
 */
export default function RetentionDetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="drh-modal-overlay" onClick={onClose}>
      <div className="drh-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drh-modal-header">
          <div>
            <h3 className="drh-modal-title">Detail Retensi</h3>
            <p className="drh-modal-subtitle">{item.retentionNo} · {item.periodYear}/{item.periodMonth}</p>
          </div>
          <button type="button" className="drh-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drh-modal-body">
          {/* Customer Info */}
          <section className="drh-modal-section">
            <div className="drh-modal-section-title">
              <Phone size={14} />
              <span>Data Pelanggan</span>
            </div>
            <div className="drh-modal-grid">
              <InfoRow label="Nama" value={item.customerName} />
              <InfoRow label="Kode Pelanggan" value={item.customerCode} />
              <InfoRow label="No. Telepon" value={item.phoneNo} />
              <InfoRow label="Alamat" value={item.address} />
            </div>
          </section>

          {/* Vehicle Info */}
          <section className="drh-modal-section">
            <div className="drh-modal-section-title">
              <Car size={14} />
              <span>Data Kendaraan</span>
            </div>
            <div className="drh-modal-grid">
              <InfoRow label="No. Polisi" value={item.policeRegNo} />
              <InfoRow label="Model" value={`${item.basicModel} (${item.transmissionType})`} />
              <InfoRow label="No. Rangka" value={item.chassisNo} />
              <InfoRow label="Odometer" value={`${item.odometer.toLocaleString('id-ID')} km`} />
              <InfoRow label="Kategori KM" value={item.categoryKM} />
            </div>
          </section>

          {/* Service Info */}
          <section className="drh-modal-section">
            <div className="drh-modal-section-title">
              <Wrench size={14} />
              <span>Data Servis</span>
            </div>
            <div className="drh-modal-grid">
              <InfoRow label="No. SPK" value={item.jobOrderNo} />
              <InfoRow label="Tgl. SPK" value={item.jobOrderDate} />
              <InfoRow label="Jenis Servis" value={item.jobType} />
              <InfoRow label="Keterangan" value={item.remark || '-'} />
              <InfoRow label="Tgl. Reminder" value={item.reminderDate} />
              <InfoRow label="Tgl. Follow Up" value={item.followUpDate} />
            </div>
          </section>

          {/* Call History Log */}
          <section className="drh-modal-section">
            <div className="drh-modal-section-title">
              <History size={14} />
              <span>Riwayat Kontak ({item.callHistory?.length ?? 0})</span>
            </div>

            {(!item.callHistory || item.callHistory.length === 0) ? (
              <p className="drh-modal-empty">Belum ada riwayat kontak.</p>
            ) : (
              <div className="drh-call-history">
                {item.callHistory.map(log => (
                  <div key={log.seqNo} className="drh-call-entry">
                    <div className="drh-call-meta">
                      <span className="drh-call-seq">#{log.seqNo}</span>
                      <span className="drh-call-date">{log.callDate}</span>
                      <span className="drh-call-employee">{log.employeeName}</span>
                    </div>
                    <div className="drh-call-status">
                      {log.isConfirmed === 'YA' ? (
                        <CheckCircle2 size={14} className="drh-call-icon drh-call-icon--success" />
                      ) : (
                        <XCircle size={14} className="drh-call-icon drh-call-icon--fail" />
                      )}
                      <span>{log.reason}</span>
                    </div>
                    {log.remarks && (
                      <div className="drh-call-remarks">{log.remarks}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="drh-info-row">
      <span className="drh-info-label">{label}</span>
      <span className="drh-info-value">{value}</span>
    </div>
  );
}
