import React from 'react';
import { FileText } from 'lucide-react';
import { useWabForm } from '../../../../utility/context/useWabForm';
import VehicleInspector from '../components/VehicleInspector';
import DamageLoggerModal from '../modals/DamageLoggerModal';
import InspectionSummary from '../components/InspectionSummary';
import SignaturePad from '../components/SignaturePad';

export default function FormWAB({ getPurposeString, setActiveTab, showToast, handleFinalizeWab }) {
  const {
    wabStep, setWabStep,
    selectedTicket,
    saCustomerName, setSaCustomerName,
    saCustomerPhone, setSaCustomerPhone,
    saCustomerAddress, setSaCustomerAddress,
    customerComplaints, setCustomerComplaints,
    setSignatureData,
    setSaSignatureData,
    damages,
    exteriorTextNotes,
    newTextCategory, setNewTextCategory,
    newTextNote, setNewTextNote,
    functionalInspections,
    isModalOpen, setIsModalOpen,
    selectedContext,
    focusFrame,
    setShowExteriorModal,
    handleFunctionalChange,
    handleMarkAllFunctionalOk,
    handleAddTextNote,
    handleRemoveTextNote,
    handlePartClick,
    handleSaveDamage,
    handleRemoveDamage,
    handleDamageClick,
    handleEditDamage,
  } = useWabForm();

  if (!selectedTicket) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', maxWidth: '650px', margin: '2rem auto' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
          <FileText size={24} color="#0f172a" />
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem' }}>Halaman WAB Service Advisor</h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Silakan buka tab <b>Daftar Tamu</b> lalu klik <b>Mulai</b> pada kendaraan yang akan diproses inspeksi.
        </p>
        <button className="btn" style={{ backgroundColor: '#0f172a', padding: '0.65rem 1.25rem' }} onClick={() => setActiveTab('daftar-tamu')}>
          &larr; Buka Halaman Daftar Tamu
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: '#ffffff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {[
            { step: 1, title: 'Data Pelanggan' },
            { step: 2, title: 'Data Kendaraan' },
            { step: 3, title: 'Keluhan Customer' },
            { step: 4, title: 'Inspeksi 360°' },
            { step: 5, title: 'Tanda Tangan & Final' }
          ].map((item, idx) => {
            const isActive = wabStep === item.step;
            const isDone = wabStep > item.step;
            return (
              <React.Fragment key={item.step}>
                <div onClick={() => setWabStep(item.step)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', opacity: isActive || isDone ? 1 : 0.55 }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: isActive ? '#0f172a' : isDone ? '#475569' : '#f1f5f9', color: isActive || isDone ? '#ffffff' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', border: isActive ? 'none' : '1px solid #cbd5e1' }}>
                    {item.step}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0f172a' : '#475569' }}>{item.title}</span>
                </div>
                {idx < 4 && (<div style={{ flex: 1, height: '2px', background: isDone ? '#0f172a' : '#e2e8f0', margin: '0 0.75rem' }} />)}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '1rem 1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#0f172a', color: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: '6px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', display: 'block', lineHeight: 1 }}>ANTRIAN</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1.2 }}>{selectedTicket.queueNumber || selectedTicket.bookingNo || 'Non-Service'}</span>
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NOMOR POLISI</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.2px' }}>{selectedTicket.policeRegNo || selectedTicket.licensePlate}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MODEL KENDARAAN</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{selectedTicket.groupCode || selectedTicket.vehicleModel}</div>
          </div>
          <div style={{ width: '1px', height: '28px', background: '#e2e8f0' }} />
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TUJUAN KEDATANGAN</div>
            <div style={{ marginTop: '2px' }}>
              <span className={`badge badge-${getPurposeString(selectedTicket.arrivalPurpose).toLowerCase()}`}>{getPurposeString(selectedTicket.arrivalPurpose)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Customer Data */}
      {wabStep === 1 && (
        <div style={{ width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 1: Pengisian Data Pelanggan</h4>
            <form onSubmit={(e) => { e.preventDefault(); if (!saCustomerName) return showToast('Form Belum Lengkap', 'Nama Pelanggan wajib diisi', 'error'); setWabStep(2); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Nama Pelanggan / Pemilik (Wajib)</label>
                  <input style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }} value={saCustomerName} onChange={e => setSaCustomerName(e.target.value)} placeholder="Contoh: Budi Santoso" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Nomor Telepon / WhatsApp</label>
                  <input style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box' }} value={saCustomerPhone} onChange={e => setSaCustomerPhone(e.target.value)} placeholder="Contoh: 081234567890" />
                </div>
              </div>
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Alamat Pelanggan / Alamat Domisili</label>
                <textarea rows={2} style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} value={saCustomerAddress} onChange={e => setSaCustomerAddress(e.target.value)} placeholder="Contoh: Jl. Sudirman No. 123, Kel. Kebayoran Baru, Jakarta Selatan" />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Continue</button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: Vehicle Data Confirmation */}
      {wabStep === 2 && (
        <div style={{ width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 2: Konfirmasi Data Kendaraan & Antrian</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.25rem', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <div><div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NOMOR ANTRIAN</div><div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>{selectedTicket.queueNumber || selectedTicket.bookingNo || 'Non-Service'}</div></div>
              <div><div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NOMOR POLISI</div><div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedTicket.policeRegNo || selectedTicket.licensePlate}</div></div>
              <div><div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>MODEL KENDARAAN</div><div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>{selectedTicket.groupCode || selectedTicket.vehicleModel}</div></div>
              <div><div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NAMA PELANGGAN</div><div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>{saCustomerName || '-'}</div></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(1)}>Kembali</button>
              <button className="btn" style={{ flex: 2, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 'bold' }} onClick={() => setWabStep(3)}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Customer Complaints */}
      {wabStep === 3 && (
        <div style={{ width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 3: Catatan Keluhan & Permintaan Pelanggan</h4>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>Tuliskan secara spesifik keluhan atau pekerjaan tambahan yang diminta oleh pemilik kendaraan.</p>
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Keluhan Utama & Catatan Servis</label>
              <textarea rows={5} style={{ width: '100%', padding: '0.75rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }} placeholder="Contoh: Suara mesin agak kasar saat AC dinyalakan..." value={customerComplaints} onChange={e => setCustomerComplaints(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(2)}>Kembali</button>
              <button className="btn" style={{ flex: 2, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 'bold' }} onClick={() => setWabStep(4)}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 360 Exterior & Functional Inspection */}
      {wabStep === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>Step 4: Inspeksi Bodi 360° & Catatan Fisik</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.825rem' }}>Swipe/Drag mobil di bawah untuk putar 360° & double click (klik 2x) pada lokasi kerusakan untuk menandai titik bodi.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600, background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>Catatan Bodi: <b>{damages.length} Titik</b></span>
              <button type="button" className="btn btn-outline" style={{ padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.85rem' }} onClick={() => setShowExteriorModal(true)}>Layar Penuh Modal 360°</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <VehicleInspector onPartClick={handlePartClick} damages={damages} focusFrame={focusFrame} />
            </div>
            <div style={{ height: '100%' }}>
              <InspectionSummary damages={damages} onRemoveDamage={handleRemoveDamage} onDamageClick={handleDamageClick} onEditDamage={(d) => { handleEditDamage(d); handlePartClick(d); }} />
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Catatan Kondisi Fisik Luar (Text Note)</h5>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input style={{ width: 170, padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }} placeholder="Kategori (e.g. Spion)" value={newTextCategory} onChange={e => setNewTextCategory(e.target.value)} />
              <input style={{ flex: 1, padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }} placeholder="Catatan kondisi" value={newTextNote} onChange={e => setNewTextNote(e.target.value)} />
              <button className="btn" style={{ backgroundColor: '#0f172a', color: '#ffffff' }} onClick={handleAddTextNote}>+ Tambah</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {exteriorTextNotes.map(n => (
                <div key={n.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>[{n.category}]:</span>
                  <span style={{ color: '#475569' }}>{n.note || 'Belum diisi'}</span>
                  {n.note && (<button style={{ color: '#be123c', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', marginLeft: 4 }} onClick={() => handleRemoveTextNote(n.id)}>&times;</button>)}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h5 style={{ margin: 0, color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Pemeriksaan Komponen & Fungsi</h5>
              {handleMarkAllFunctionalOk && (
                <button
                  type="button"
                  onClick={handleMarkAllFunctionalOk}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #16a34a',
                    backgroundColor: '#ffffff',
                    color: '#15803d',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>✓</span>
                  <span>Set Semua Baik (OK)</span>
                </button>
              )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', background: '#f8fafc' }}>
                  <th style={{ padding: '0.5rem 0.6rem', width: '35px', textAlign: 'center' }}>No</th>
                  <th style={{ padding: '0.5rem 0.6rem', fontWeight: 700 }}>Komponen Kendaraan</th>
                  <th style={{ padding: '0.5rem 0.6rem', fontWeight: 700, width: '220px' }}>Kondisi</th>
                  <th style={{ padding: '0.5rem 0.6rem', fontWeight: 700 }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {functionalInspections.map((item, idx) => {
                  const isOk = item.status === 'OK';
                  const toggleStatus = () => {
                    handleFunctionalChange(item.id, 'status', isOk ? 'Defect' : 'OK');
                  };

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600, color: '#0f172a' }}>{item.name}</td>
                      <td style={{ padding: '0.5rem 0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            type="button"
                            onClick={toggleStatus}
                            style={{
                              width: '50px',
                              height: '26px',
                              borderRadius: '13px',
                              backgroundColor: isOk ? '#16a34a' : '#dc2626',
                              padding: '3px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isOk ? 'flex-start' : 'flex-end',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#ffffff',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              color: isOk ? '#16a34a' : '#dc2626'
                            }}>
                              {isOk ? '✓' : '✕'}
                            </div>
                          </button>

                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: isOk ? '#15803d' : '#be123c'
                          }}>
                            {isOk ? 'Baik (OK)' : 'Perlu Perbaikan'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0.5rem 0.6rem' }}>
                        <input type="text" placeholder="Catatan jika ada..." value={item.notes} onChange={(e) => handleFunctionalChange(item.id, 'notes', e.target.value)} style={{ width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem', color: '#0f172a', boxSizing: 'border-box' }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ width: '150px' }} onClick={() => setWabStep(3)}>Kembali</button>
            <button className="btn" style={{ flex: 1, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.65rem' }} onClick={() => setWabStep(5)}>Continue</button>
          </div>
        </div>
      )}

      {/* Step 5: Workorder Summary & Digital Signature */}
      {wabStep === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '1.75rem 2rem', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>Step 5: Ringkasan Workorder & Tanda Tangan Digital</h4>

            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.65rem 0.85rem', width: '160px', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Nomor Antrian</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.95rem' }}>{selectedTicket.queueNumber || selectedTicket.bookingNo || 'Non-Service'}</td>
                    <td style={{ padding: '0.65rem 0.85rem', width: '160px', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Nama Pelanggan</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{saCustomerName || '-'} {saCustomerPhone ? `(${saCustomerPhone})` : ''}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Kendaraan</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{selectedTicket.policeRegNo || selectedTicket.licensePlate} ({selectedTicket.groupCode || selectedTicket.vehicleModel})</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Catatan Kerusakan</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#0f172a' }}>{damages.length} Titik Dicatat</td>
                  </tr>
                  {saCustomerAddress && (
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Alamat Pelanggan</td>
                      <td colSpan={3} style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>{saCustomerAddress}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#475569', background: '#f8fafc' }}>Keluhan Utama</td>
                    <td colSpan={3} style={{ padding: '0.65rem 0.85rem', color: '#0f172a' }}>{customerComplaints || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Catatan Kerusakan Bodi 360° ({damages.length} Titik)</h5>
              <InspectionSummary damages={damages} onRemoveDamage={handleRemoveDamage} onDamageClick={handleDamageClick} onEditDamage={handleEditDamage} />
            </div>

            <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Pemeriksaan Komponen & Fungsi ({functionalInspections.length} Item)</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                {functionalInspections.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.65rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                    <span style={{ color: '#334155', fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: item.status === 'OK' ? '#16a34a' : '#dc2626', background: item.status === 'OK' ? '#f0fdf4' : '#fef2f2', padding: '1px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {item.status === 'OK' ? 'OK' : 'Defect'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Pengesahan & Tanda Tangan Digital</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ margin: '0 0 0.6rem 0', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', alignSelf: 'flex-start' }}>1. Tanda Tangan Service Advisor (SA)</p>
                  <SignaturePad onSignChange={setSaSignatureData} />
                </div>
                <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ margin: '0 0 0.6rem 0', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', alignSelf: 'flex-start' }}>2. Tanda Tangan Pelanggan (Customer)</p>
                  <SignaturePad onSignChange={setSignatureData} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ width: '140px' }} onClick={() => setWabStep(4)}>Kembali</button>
              <button className="btn" style={{ flex: 1, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 700, fontSize: '0.9rem' }} onClick={handleFinalizeWab}>Submit</button>
            </div>
          </div>
        </div>
      )}

      <DamageLoggerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveDamage} context={selectedContext} />
    </div>
  );
}
