import React, { useEffect } from 'react';
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
    saCustomerEmail, setSaCustomerEmail,
    saDriverName, setSaDriverName,
    saIdentityNo, setSaIdentityNo,
    saCustomerAddress, setSaCustomerAddress,
    saPoliceRegNo, setSaPoliceRegNo,
    saVehicleModel, setSaVehicleModel,
    saOdometer, setSaOdometer,
    saJobType, setSaJobType,
    saStallCode, setSaStallCode,
    saServiceAdvisor, setSaServiceAdvisor,
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

  useEffect(() => {
    if (selectedTicket) {
      const nameFromSdms = selectedTicket.customerName || selectedTicket.CustomerName || selectedTicket.wabCustomerName;
      const phoneFromSdms = selectedTicket.customerPhone || selectedTicket.telponNo || selectedTicket.TelponNo;
      const plateFromSdms = selectedTicket.policeRegNo || selectedTicket.licensePlate || selectedTicket.PoliceRegNo;
      const modelFromSdms = selectedTicket.groupCode || selectedTicket.vehicleModel || selectedTicket.GroupCode;
      const odoFromSdms = selectedTicket.odometer || selectedTicket.Odometer;
      const jobFromSdms = selectedTicket.jobType || selectedTicket.serviceType || selectedTicket.JobType;
      const stallFromSdms = selectedTicket.stallCode || selectedTicket.StallCode || selectedTicket.stallName;
      const saFromSdms = selectedTicket.serviceAdvisor || selectedTicket.ServiceAdvisor;

      if (nameFromSdms) setSaCustomerName(nameFromSdms);
      if (phoneFromSdms) setSaCustomerPhone(phoneFromSdms);
      if (plateFromSdms) setSaPoliceRegNo(plateFromSdms);
      if (modelFromSdms) setSaVehicleModel(modelFromSdms);
      if (odoFromSdms) setSaOdometer(String(odoFromSdms));
      if (jobFromSdms) setSaJobType(jobFromSdms);
      if (stallFromSdms) setSaStallCode(stallFromSdms);
      if (saFromSdms) setSaServiceAdvisor(saFromSdms);
    }
  }, [selectedTicket]);

  if (!selectedTicket) {
    return (
      <div className="card" style={{
        textAlign: 'center',
        padding: '3.5rem 2rem',
        maxWidth: '620px',
        margin: '2rem auto',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <FileText size={26} color="#0f172a" />
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 700 }}>
          Halaman WAB Service Advisor
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Silakan buka tab <b>Daftar Tamu</b> lalu klik <b>Mulai</b> pada kendaraan yang akan diproses inspeksi.
        </p>
        <button className="btn" style={{ backgroundColor: '#0f172a', padding: '0.65rem 1.25rem', fontWeight: 700, borderRadius: '8px' }} onClick={() => setActiveTab('daftar-tamu')}>
          &larr; Buka Halaman Daftar Tamu
        </button>
      </div>
    );
  }

  const isBookingGuest = Boolean(selectedTicket.sdmsBookingId || selectedTicket.bookingNo || selectedTicket.BookingNo);
  const bookingNo = selectedTicket.queueNumber || selectedTicket.bookingNo || selectedTicket.sdmsBookingId || selectedTicket.BookingNo || 'WALK-IN';
  const policeRegNo = selectedTicket.policeRegNo || selectedTicket.licensePlate || selectedTicket.PoliceRegNo || 'B 9999 SZK';
  const vehicleModel = selectedTicket.groupCode || selectedTicket.vehicleModel || selectedTicket.GroupCode || 'SUZUKI CARRY PICK UP';
  const odometerVal = selectedTicket.odometer || selectedTicket.Odometer;
  const odometerDisplay = odometerVal ? `${Number(odometerVal).toLocaleString('id-ID')} KM` : '-';
  const jobType = selectedTicket.jobType || selectedTicket.serviceType || selectedTicket.JobType || 'Periodic Service';
  const reservasiDate = selectedTicket.reservasiDate || selectedTicket.ReservasiDate || '';
  const reservasiTime = selectedTicket.reservasiTime || selectedTicket.bookingTime || selectedTicket.ReservasiTime || '';
  const stallCode = selectedTicket.stallCode || selectedTicket.StallCode || '-';
  const serviceAdvisorId = selectedTicket.serviceAdvisor || selectedTicket.ServiceAdvisor || '-';
  const companyBranch = `${selectedTicket.branchCode || selectedTicket.BranchCode || '6006401'} / ${selectedTicket.companyCode || selectedTicket.CompanyCode || '6006406'}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{
        background: '#ffffff',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
      }}>
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
                <div
                  onClick={() => setWabStep(item.step)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    cursor: 'pointer',
                    opacity: isActive || isDone ? 1 : 0.55,
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isActive ? '#0f172a' : isDone ? '#475569' : '#f1f5f9',
                    color: isActive || isDone ? '#ffffff' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    border: isActive ? 'none' : '1px solid #cbd5e1',
                  }}>
                    {item.step}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0f172a' : '#475569' }}>
                    {item.title}
                  </span>
                </div>
                {idx < 4 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: isDone ? '#0f172a' : '#e2e8f0',
                    margin: '0 0.75rem',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        padding: '1.15rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0',
        alignItems: 'center'
      }}>
        <div style={{ paddingRight: '1.25rem', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ANTRIAN / BOOKING
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
            {bookingNo}
          </div>
        </div>

        <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            NOMOR POLISI
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            {policeRegNo}
          </div>
        </div>

        <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            MODEL KENDARAAN
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
            {vehicleModel}
          </div>
        </div>

        <div style={{ paddingLeft: '1.25rem' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TUJUAN KEDATANGAN
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
            {getPurposeString(selectedTicket.arrivalPurpose)}
          </div>
        </div>
      </div>

      {wabStep === 1 && (
        <div style={{ width: '100%' }}>
          <div style={{
            background: '#ffffff',
            padding: '1.75rem 2rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>
              Step 1: Pengisian Data Pelanggan &amp; Kendaraan
            </h4>

            <form onSubmit={(e) => { e.preventDefault(); if (!saCustomerName) return showToast('Form Belum Lengkap', 'Nama Pelanggan wajib diisi', 'error'); setWabStep(2); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Nama Pelanggan / Pemilik (Wajib)
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saCustomerName}
                    onChange={e => setSaCustomerName(e.target.value)}
                    placeholder="Masukkan nama pemilik / STNK..."
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Nama Pengemudi / Pembawa Kendaraan
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saDriverName}
                    onChange={e => setSaDriverName(e.target.value)}
                    placeholder="Nama pengemudi (jika berbeda dari pemilik)..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Nomor Telepon / WhatsApp (Wajib)
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saCustomerPhone}
                    onChange={e => setSaCustomerPhone(e.target.value)}
                    placeholder="Contoh: 08118207657"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Email Pelanggan
                  </label>
                  <input
                    type="email"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saCustomerEmail}
                    onChange={e => setSaCustomerEmail(e.target.value)}
                    placeholder="Contoh: pelanggan@suzuki.co.id"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    No. KTP / Identitas
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saIdentityNo}
                    onChange={e => setSaIdentityNo(e.target.value)}
                    placeholder="Contoh: 3171234567890001"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Nomor Polisi (Plat Nomor)
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saPoliceRegNo}
                    onChange={e => setSaPoliceRegNo(e.target.value)}
                    placeholder="Contoh: B 1697 TYK"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Model Kendaraan
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saVehicleModel}
                    onChange={e => setSaVehicleModel(e.target.value)}
                    placeholder="Contoh: SWIFT (CBU)"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Odometer Saat Ini (KM)
                  </label>
                  <input
                    type="number"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saOdometer}
                    onChange={e => setSaOdometer(e.target.value)}
                    placeholder="Contoh: 2222222"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Job Type / Paket Servis
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saJobType}
                    onChange={e => setSaJobType(e.target.value)}
                    placeholder="Contoh: PAKET 10.000 KM"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Stall Bengkel
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saStallCode}
                    onChange={e => setSaStallCode(e.target.value)}
                    placeholder="Contoh: STALL-01"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                    Service Advisor ID
                  </label>
                  <input
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    value={saServiceAdvisor}
                    onChange={e => setSaServiceAdvisor(e.target.value)}
                    placeholder="Contoh: 58970"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                  Alamat Pelanggan / Domisili
                </label>
                <textarea
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                  value={saCustomerAddress}
                  onChange={e => setSaCustomerAddress(e.target.value)}
                  placeholder="Masukkan alamat domisili pelanggan..."
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: Vehicle & SDMS Booking Data Confirmation */}
      {wabStep === 2 && (
        <div style={{ width: '100%' }}>
          <div style={{
            background: '#ffffff',
            padding: '1.75rem 2rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>
              Step 2: Konfirmasi Data Kendaraan &amp; Antrian
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '1.75rem' }}>
              {/* Data Pelanggan */}
              <div>
                <h5 style={{ margin: '0 0 0.85rem 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.4rem' }}>
                  DATA PELANGGAN &amp; IDENTITAS
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem 1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NAMA PEMILIK / STNK</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{saCustomerName || selectedTicket.customerName || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NAMA PENGEMUDI</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{saDriverName || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NO. TELEPON / WA</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{saCustomerPhone || selectedTicket.telponNo || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>EMAIL PELANGGAN</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{saCustomerEmail || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NO. KTP / IDENTITAS</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{saIdentityNo || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>ALAMAT DOMISILI</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{saCustomerAddress || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Data Kendaraan */}
              <div>
                <h5 style={{ margin: '0 0 0.85rem 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.4rem' }}>
                  DATA KENDARAAN &amp; SDMS BOOKING
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem 1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NO. BOOKING SDMS</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', marginTop: '3px' }}>{bookingNo}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NOMOR POLISI</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>{saPoliceRegNo || policeRegNo}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>MODEL KENDARAAN</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginTop: '3px' }}>{saVehicleModel || vehicleModel}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>ODOMETER SAAT INI</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                      {saOdometer ? `${Number(saOdometer).toLocaleString('id-ID')} KM` : odometerDisplay}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>JOB TYPE / PAKET SERVIS</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{saJobType || jobType}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>JADWAL RESERVASI</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginTop: '3px' }}>
                      {reservasiDate ? `${reservasiDate.substring(0, 10)} (${reservasiTime || '09:30'})` : '-'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>STALL BENGKEL</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>{saStallCode || stallCode}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>SERVICE ADVISOR ID</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginTop: '3px' }}>{saServiceAdvisor || serviceAdvisorId}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(1)}>
                Kembali
              </button>
              <button className="btn" style={{ flex: 2, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 'bold' }} onClick={() => setWabStep(3)}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Customer Complaints */}
      {wabStep === 3 && (
        <div style={{ width: '100%' }}>
          <div style={{
            background: '#ffffff',
            padding: '1.75rem 2rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <h4 style={{ margin: '0 0 1.25rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>
              Step 3: Keluhan Pelanggan &amp; Catatan Servis
            </h4>
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                Keluhan / Permintaan Khusus Pelanggan
              </label>
              <textarea
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                }}
                value={customerComplaints}
                onChange={e => setCustomerComplaints(e.target.value)}
                placeholder="Tuliskan detail keluhan pelanggan atau catatan khusus teknisi..."
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(2)}>
                Kembali
              </button>
              <button className="btn" style={{ flex: 2, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 'bold' }} onClick={() => setWabStep(4)}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 360 Exterior & Functional Inspection */}
      {wabStep === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div style={{
            background: '#ffffff',
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>
                Step 4: Inspeksi Bodi 360° &amp; Catatan Fisik
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
              <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600, background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                Catatan Bodi: <b>{damages.length} Titik</b>
              </span>
              <button type="button" className="btn btn-outline" style={{ padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.85rem' }} onClick={() => setShowExteriorModal(true)}>
                Layar Penuh Modal 360°
              </button>
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
                  <span style={{ color: '#475569' }}>{n.note || '-'}</span>
                  <button style={{ color: '#be123c', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', marginLeft: 4 }} onClick={() => handleRemoveTextNote(n.id)}>&times;</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h5 style={{ margin: 0, color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>Pemeriksaan Komponen &amp; Fungsi</h5>
              {handleMarkAllFunctionalOk && (
                <button
                  type="button"
                  onClick={handleMarkAllFunctionalOk}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
                >
                  ✓ Tandai Semua OK
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {functionalInspections.map(item => (
                <div key={item.id} style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>{item.name}</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {['OK', 'Perlu Cek', 'Rusak'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleFunctionalChange(item.id, 'status', st)}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          border: item.status === st ? '1px solid #0f172a' : '1px solid #cbd5e1',
                          background: item.status === st ? '#0f172a' : '#ffffff',
                          color: item.status === st ? '#ffffff' : '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: item.status === st ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(3)}>
              Kembali
            </button>
            <button className="btn" style={{ flex: 2, backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 'bold' }} onClick={() => setWabStep(5)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Signature & Finalize */}
      {wabStep === 5 && (
        <div style={{ width: '100%' }}>
          <div style={{
            background: '#ffffff',
            padding: '1.75rem 2rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 700 }}>
              Step 5: Tanda Tangan Pelanggan &amp; Finalisasi Form WAB
            </h4>

            <div style={{
              background: '#ffffff',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Data Pelanggan */}
              <div>
                <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.4rem' }}>
                  DATA PELANGGAN &amp; IDENTITAS
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem 1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>NAMA PEMILIK / STNK</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>{saCustomerName || selectedTicket.customerName || '-'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>NAMA PENGEMUDI</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{saDriverName || '-'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>NO. TELEPON / WA</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>{saCustomerPhone || selectedTicket.telponNo || '-'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>EMAIL PELANGGAN</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{saCustomerEmail || '-'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>NO. KTP / IDENTITAS</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{saIdentityNo || '-'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>ALAMAT DOMISILI</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{saCustomerAddress || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Data Kendaraan */}
              <div>
                <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.4rem' }}>
                  DATA KENDARAAN &amp; SDMS BOOKING
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem 1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>NO. BOOKING SDMS</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 800, fontFamily: 'monospace' }}>{bookingNo}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>NOMOR POLISI</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 800 }}>{saPoliceRegNo || policeRegNo}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>MODEL KENDARAAN</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>{saVehicleModel || vehicleModel}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>ODOMETER SAAT INI</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 800 }}>
                      {saOdometer ? `${Number(saOdometer).toLocaleString('id-ID')} KM` : odometerDisplay}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>JOB TYPE / PAKET SERVIS</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>{saJobType || jobType}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>STALL BENGKEL</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>{saStallCode || stallCode}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>SERVICE ADVISOR ID</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>{saServiceAdvisor || serviceAdvisorId}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', fontWeight: 600 }}>KODE CABANG / DEALER</span>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>{companyBranch}</span>
                  </div>
                </div>
              </div>

              {/* Keluhan & Permintaan */}
              <div>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.4rem' }}>
                  KELUHAN &amp; PERMINTAAN PELANGGAN
                </h5>
                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155', minHeight: '38px' }}>
                  {customerComplaints || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Tidak ada keluhan khusus yang dicatat.</span>}
                </div>
              </div>

              {/* Catatan Kerusakan & Eksterior 360° */}
              <div>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.4rem' }}>
                  CATATAN KERUSAKAN &amp; EKSTERIOR BODI 360° ({damages.length} Titik Kerusakan)
                </h5>

                {damages.length === 0 ? (
                  <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.825rem', color: '#16a34a', fontWeight: 600 }}>
                    ✓ Tidak ada titik kerusakan bodi yang ditandai (Bodi Mobil Mulus).
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    {damages.map((d, i) => (
                      <div key={d.id || i} style={{ background: '#ffffff', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.partName || d.category || `Titik #${i + 1}`}</span>
                          {d.note && <span style={{ color: '#64748b', marginLeft: '6px' }}>({d.note})</span>}
                        </div>
                        <span style={{
                          background: d.severity === 'Severe' || d.severity === 'Berat' ? '#fee2e2' : d.severity === 'Moderate' || d.severity === 'Sedang' ? '#fef3c7' : '#e0f2fe',
                          color: d.severity === 'Severe' || d.severity === 'Berat' ? '#991b1b' : d.severity === 'Moderate' || d.severity === 'Sedang' ? '#92400e' : '#075985',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 700
                        }}>
                          {d.type || 'Kerusakan'} ({d.severity || 'Ringan'})
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Notes */}
                {exteriorTextNotes && exteriorTextNotes.length > 0 && (
                  <div style={{ marginTop: '0.65rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {exteriorTextNotes.map(n => (
                      <span key={n.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.775rem' }}>
                        <strong style={{ color: '#0f172a' }}>[{n.category}]:</strong> {n.note}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Inspeksi Komponen & Fungsi */}
              <div>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.4rem' }}>
                  HASIL INSPEKSI KOMPONEN &amp; FUNGSI KENDARAAN
                </h5>
                {(() => {
                  const notOkItems = functionalInspections.filter(item => item.status !== 'OK');
                  return (
                    <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.825rem' }}>
                      {notOkItems.length === 0 ? (
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Seluruh {functionalInspections.length} Komponen &amp; Fungsi Kendaraan Terbukti OK.</span>
                      ) : (
                        <div>
                          <span style={{ color: '#dc2626', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                            ⚠️ Terdeteksi {notOkItems.length} komponen perlu perhatian:
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {notOkItems.map(item => (
                              <span key={item.id} style={{ background: item.status === 'Rusak' ? '#fee2e2' : '#fef3c7', color: item.status === 'Rusak' ? '#991b1b' : '#92400e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                                {item.name}: {item.status}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                  Tanda Tangan Pelanggan / Pemilik
                </label>
                <SignaturePad onSave={(data) => setSignatureData(data)} title="Tanda Tangan Pelanggan" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                  Tanda Tangan Service Advisor
                </label>
                <SignaturePad onSave={(data) => setSaSignatureData(data)} title="Tanda Tangan SA" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setWabStep(4)}>
                Kembali
              </button>
              <button className="btn" style={{ flex: 2, backgroundColor: '#16a34a', color: '#ffffff', padding: '0.85rem', fontWeight: 800, fontSize: '0.95rem' }} onClick={handleFinalizeWab}>
                ✓ Kirim &amp; Finalisasi Form WAB 5-Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Logger Titik Kerusakan */}
      <DamageLoggerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveDamage} context={selectedContext} />
    </div>
  );
}
