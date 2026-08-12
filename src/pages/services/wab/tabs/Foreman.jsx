import React, { useState, useCallback } from 'react';
import { Wrench, History, Inbox, Layers, UserPlus, FileText, PlusCircle, CornerUpRight, CheckCircle2, Trash2, Edit2, Clock, CornerDownRight, X, AlertCircle, User, Users } from 'lucide-react';
import { theme } from '../../../../configs/themeConfig';
import PageHeader from '../../../../navigation/PageHeader';
import ModalWrapper, { ModalCard } from '../../../../utility/components/ModalWrapper';

const MOCK_TECHNICIANS = [
  { id: 't1', name: 'Budi Santoso', specialty: 'Mesin & Transmisi' },
  { id: 't2', name: 'Agus Pratama', specialty: 'Elektrikal & AC' },
  { id: 't3', name: 'Dedi Kurniawan', specialty: 'Body & Cat' },
  { id: 't4', name: 'Rudi Hermawan', specialty: 'Rem & Suspensi' },
  { id: 't5', name: 'Wahyu Setiawan', specialty: 'General Service' },
];

const MOCK_FOREMEN = [
  { id: 'f1', name: 'Foreman A' },
  { id: 'f2', name: 'Foreman B' },
  { id: 'f3', name: 'Foreman C' },
];

const DATE_CHIPS = [
  { label: 'Hari ini', offset: 0 },
  { label: '+1 Hari', offset: 1 },
  { label: '+2 Hari', offset: 2 },
  { label: '+3 Hari', offset: 3 },
  { label: '+1 Minggu', offset: 7 },
];

const TIME_CHIPS = [
  { label: '+30m', minutes: 30 },
  { label: '+1j', minutes: 60 },
  { label: '+1.5j', minutes: 90 },
  { label: '+2j', minutes: 120 },
  { label: '+3j', minutes: 180 },
];

function pad(n) { return String(n).padStart(2, '0'); }

function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return '-'; }
}

function formatDate(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return `${days[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch { return '-'; }
}

function getDateFromOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function addMinutesToNow(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

export default function ForemanTab({ tickets, getStatusString, onFinishJob, onUpdateTracking, onSelectTicket }) {
  const [activeTab, setActiveTab] = useState('undistributed');
  const [foremanCurrentName] = useState('Foreman A');
  const [jobs, setJobs] = useState({});

  const [assignModal, setAssignModal] = useState({ visible: false, ticket: null });
  const [recModal, setRecModal] = useState({ visible: false, ticketId: null, existingRec: null });
  const [delRecModal, setDelRecModal] = useState({ visible: false, ticketId: null, rec: null });
  const [trackModal, setTrackModal] = useState({ visible: false, ticketId: null });
  const [delegModal, setDelegModal] = useState({ visible: false, ticketId: null });
  const [finishConfirmModal, setFinishConfirmModal] = useState({ visible: false, ticket: null });

  const [assignTech, setAssignTech] = useState(null);
  const [assignStall, setAssignStall] = useState('');

  const [recDesc, setRecDesc] = useState('');
  const [recDateOffset, setRecDateOffset] = useState(1);
  const [recCustomDate, setRecCustomDate] = useState(getDateFromOffset(1).split('T')[0]);

  const [trackLabel, setTrackLabel] = useState('');
  const [trackMinutes, setTrackMinutes] = useState(60);

  const [delegSubTab, setDelegSubTab] = useState('tech');
  const [delegTech, setDelegTech] = useState(null);
  const [delegForeman, setDelegForeman] = useState(null);
  const [delegStall, setDelegStall] = useState('');

  const getJob = useCallback((ticketId) => {
    return jobs[ticketId] || { assignedTechnician: null, status: 'Undistributed', recommendations: [], trackingEntries: [], ticketId };
  }, [jobs]);

  const updateJob = useCallback((ticketId, updates) => {
    setJobs(prev => ({
      ...prev,
      [ticketId]: { ...(prev[ticketId] || { assignedTechnician: null, status: 'Undistributed', recommendations: [], trackingEntries: [], ticketId }), ...updates }
    }));
  }, []);

  const eligibleTickets = tickets.filter(t => {
    const s = String(t.status || '');
    return s === 'Inspected' || s === 'WabDone' || s === 'InService' || s === 'ServiceCompleted' || s === '1' || s === '2' || s === '3' || s === '5';
  });

  const undistributedTickets = eligibleTickets.filter(t => {
    const s = String(t.status || '');
    const isAlreadyAssigned = s === 'InService' || s === 'AssignedToStall' || s === 'ServiceCompleted' || s === 'PreHandoverReady' || s === 'HandoverCompleted' || s === 'CheckedOut' || s === '2' || s === '3' || s === '5' || s === '6' || s === '7' || s === '8';
    return !isAlreadyAssigned && getJob(t.ticketId).status === 'Undistributed';
  });

  const distributedTickets = eligibleTickets.filter(t => {
    const s = String(t.status || '');
    const isAssigned = s === 'InService' || s === 'AssignedToStall' || s === '2' || s === '3' || getJob(t.ticketId).status === 'InProgress';
    return isAssigned && s !== 'ServiceCompleted' && s !== 'PreHandoverReady' && s !== 'HandoverCompleted' && s !== 'CheckedOut' && s !== '5' && s !== '6' && s !== '7' && s !== '8';
  });
  const inProgressCount = distributedTickets.length;
  const completedTickets = tickets.filter(t => t.status === 'ServiceCompleted' || t.status === 'PreHandoverReady' || t.status === 'HandoverCompleted' || t.status === 'CheckedOut');

  const handleOpenAssignModal = (ticket) => {
    setAssignTech(null);
    setAssignStall('');
    setAssignModal({ visible: true, ticket });
  };

  const handleConfirmAssign = () => {
    if (!assignTech) return alert('Pilih teknisi terlebih dahulu.');
    if (!assignStall.trim()) return alert('Isi nama stall bengkel.');
    const ticket = assignModal.ticket;
    updateJob(ticket.ticketId, { assignedTechnician: { ...assignTech, stallName: assignStall.trim() }, status: 'InProgress' });
    onUpdateTracking?.({ ticketId: ticket.ticketId, stallName: assignStall.trim(), technicianName: assignTech.name, foremanRecommendation: '', addExtraMinutes: 0 });
    setAssignModal({ visible: false, ticket: null });
    setActiveTab('distributed');
  };

  const handleOpenRecModal = (ticketId, existingRec = null) => {
    setRecDesc(existingRec?.description || '');
    setRecDateOffset(1);
    const initialDate = existingRec?.beforeDate ? existingRec.beforeDate.split('T')[0] : getDateFromOffset(1).split('T')[0];
    setRecCustomDate(initialDate);
    setRecModal({ visible: true, ticketId, existingRec });
  };

  const handlePresetDateClick = (offset) => {
    setRecDateOffset(offset);
    setRecCustomDate(getDateFromOffset(offset).split('T')[0]);
  };

  const handleSaveRec = () => {
    if (!recDesc.trim()) return alert('Isi deskripsi rekomendasi.');
    if (!recCustomDate) return alert('Pilih tanggal target rekomendasi.');
    const { ticketId, existingRec } = recModal;
    const currentRecs = getJob(ticketId).recommendations;
    let nextRecs = [];
    if (existingRec) {
      nextRecs = currentRecs.map(r => r.id === existingRec.id ? { ...r, description: recDesc.trim(), beforeDate: new Date(recCustomDate).toISOString() } : r);
    } else {
      nextRecs = [...currentRecs, { id: 'rec_' + Date.now(), description: recDesc.trim(), beforeDate: new Date(recCustomDate).toISOString(), createdAt: new Date().toISOString() }];
    }
    updateJob(ticketId, { recommendations: nextRecs });
    setRecModal({ visible: false, ticketId: null, existingRec: null });
  };

  const handleDeleteRec = (ticketId, rec) => {
    const currentRecs = getJob(ticketId).recommendations;
    const nextRecs = currentRecs.filter(r => r.id !== rec.id);
    updateJob(ticketId, { recommendations: nextRecs });
    setDelRecModal({ visible: false, ticketId: null, rec: null });
  };

  const handleOpenTrackModal = (ticketId) => {
    setTrackLabel('');
    setTrackMinutes(60);
    setTrackModal({ visible: true, ticketId });
  };

  const handleSaveTrack = () => {
    if (!trackLabel.trim()) return alert('Isi keterangan tracking.');
    const { ticketId } = trackModal;
    const currentEntries = getJob(ticketId).trackingEntries;
    const estimatedDoneTime = addMinutesToNow(trackMinutes);
    const newEntry = { id: 'trk_' + Date.now(), label: trackLabel.trim(), estimatedDoneTime, createdAt: new Date().toISOString() };
    updateJob(ticketId, { trackingEntries: [...currentEntries, newEntry] });
    onUpdateTracking?.({ ticketId, stallName: getJob(ticketId).assignedTechnician?.stallName || 'Stall', technicianName: getJob(ticketId).assignedTechnician?.name || 'Teknisi', foremanRecommendation: trackLabel.trim(), addExtraMinutes: trackMinutes });
    setTrackModal({ visible: false, ticketId: null });
  };

  const handleOpenDelegModal = (ticketId) => {
    setDelegSubTab('tech');
    setDelegTech(null);
    setDelegForeman(null);
    setDelegStall(getJob(ticketId).assignedTechnician?.stallName || '');
    setDelegModal({ visible: true, ticketId });
  };

  const handleConfirmChangeTech = () => {
    if (!delegTech) return alert('Pilih teknisi baru.');
    if (!delegStall.trim()) return alert('Isi nama stall bengkel.');
    const { ticketId } = delegModal;
    updateJob(ticketId, { assignedTechnician: { ...delegTech, stallName: delegStall.trim() } });
    onUpdateTracking?.({ ticketId, stallName: delegStall.trim(), technicianName: delegTech.name, foremanRecommendation: 'Pindah Teknisi', addExtraMinutes: 0 });
    setDelegModal({ visible: false, ticketId: null });
  };

  const handleConfirmDelegateForeman = () => {
    if (!delegForeman) return alert('Pilih Foreman tujuan.');
    const { ticketId } = delegModal;
    updateJob(ticketId, { status: 'Delegated', delegatedTo: delegForeman.name });
    setDelegModal({ visible: false, ticketId: null });
  };

  const handleConfirmFinishJob = () => {
    const ticket = finishConfirmModal.ticket;
    if (!ticket) return;
    updateJob(ticket.ticketId, { status: 'Completed' });
    onFinishJob?.(ticket.ticketId);
    setFinishConfirmModal({ visible: false, ticket: null });
  };

  return (
    <div>
      <PageHeader title="Foreman Workshop Board" />

      <div style={{ display: 'flex', gap: '0.55rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('undistributed')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.15rem',
            borderRadius: theme.radius.md,
            border: activeTab === 'undistributed' ? `1px solid ${theme.color.dark}` : `1px solid ${theme.color.borderLight}`,
            backgroundColor: theme.color.surface,
            color: activeTab === 'undistributed' ? theme.color.dark : theme.color.textMuted,
            fontWeight: activeTab === 'undistributed' ? 700 : 600,
            fontSize: theme.font.sizeSm,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Inbox size={16} color={activeTab === 'undistributed' ? theme.color.dark : theme.color.textMuted} />
          Belum Terdistribusi ({undistributedTickets.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('distributed')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.15rem',
            borderRadius: theme.radius.md,
            border: activeTab === 'distributed' ? `1px solid ${theme.color.dark}` : `1px solid ${theme.color.borderLight}`,
            backgroundColor: theme.color.surface,
            color: activeTab === 'distributed' ? theme.color.dark : theme.color.textMuted,
            fontWeight: activeTab === 'distributed' ? 700 : 600,
            fontSize: theme.font.sizeSm,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Layers size={16} color={activeTab === 'distributed' ? theme.color.dark : theme.color.textMuted} />
          Distribusi Pekerjaan ({distributedTickets.length})
        </button>
      </div>

      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: theme.color.surface, padding: '1rem 1.25rem', borderRadius: theme.radius.lg, border: `1px solid ${theme.color.borderLight}`, boxShadow: theme.shadow.card }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.color.textMuted, textTransform: 'uppercase' }}>Antri Distribusi</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.color.textPrimary, marginTop: '0.2rem' }}>{undistributedTickets.length} Kendaraan</div>
          </div>
          <div style={{ background: theme.color.surface, padding: '1rem 1.25rem', borderRadius: theme.radius.lg, border: `1px solid ${theme.color.borderLight}`, boxShadow: theme.shadow.card }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.color.textMuted, textTransform: 'uppercase' }}>Dikerjakan (In-Stall)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.color.textPrimary, marginTop: '0.2rem' }}>{inProgressCount} Kendaraan</div>
          </div>
          <div style={{ background: theme.color.surface, padding: '1rem 1.25rem', borderRadius: theme.radius.lg, border: `1px solid ${theme.color.borderLight}`, boxShadow: theme.shadow.card }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.color.textMuted, textTransform: 'uppercase' }}>Selesai Servis</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.color.textPrimary, marginTop: '0.2rem' }}>{completedTickets.length} Kendaraan</div>
          </div>
        </div>

        {activeTab === 'undistributed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {undistributedTickets.length === 0 ? (
              <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.lg, padding: '3.5rem', textAlign: 'center', color: theme.color.textMuted }}>
                <Inbox size={42} color={theme.color.border} style={{ margin: '0 auto 0.75rem auto' }} />
                <p style={{ margin: 0, fontSize: theme.font.sizeMd, fontWeight: 600, color: theme.color.textSecondary }}>Tidak ada pekerjaan baru.</p>
                <span style={{ fontSize: theme.font.sizeSm, color: theme.color.textMuted }}>Tunggu Service Advisor menyelesaikan Form WAB.</span>
              </div>
            ) : (
              undistributedTickets.map(t => {
                const job = getJob(t.ticketId);
                return (
                  <div key={t.ticketId} style={{ background: theme.color.surface, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.lg, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: theme.shadow.card }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: theme.color.dark, color: theme.color.surface, padding: '2px 8px', borderRadius: theme.radius.sm, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                        {t.queueNumber || 'Non-Q'}
                      </span>
                      <span style={{ padding: '3px 9px', borderRadius: theme.radius.sm, background: '#d97706', color: '#ffffff', fontSize: theme.font.sizeXs, fontWeight: 700 }}>
                        Belum Distribusi
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.color.textPrimary }}>{t.licensePlate}</div>
                      <div style={{ fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary }}>{t.customerName || t.wabCustomerName || '-'}</div>
                      <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, marginTop: '2px' }}>{t.vehicleModel} &bull; {t.serviceType || 'Periodic Service'}</div>
                    </div>

                    {t.delegatedFrom && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: theme.color.surfaceAlt, border: `1px solid ${theme.color.borderLight}`, padding: '0.35rem 0.6rem', borderRadius: theme.radius.md, fontSize: theme.font.sizeXs, color: theme.color.textPrimary, fontWeight: 600 }}>
                        <CornerDownRight size={13} />
                        <span>Diterima dari: {t.delegatedFrom}</span>
                      </div>
                    )}

                    {t.customerComplaints && (
                      <div style={{ background: theme.color.bg, border: `1px solid ${theme.color.borderLight}`, padding: '0.6rem 0.75rem', borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textSecondary }}>
                        <b style={{ color: theme.color.textPrimary }}>Keluhan:</b> {t.customerComplaints}
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: theme.color.dark,
                        color: theme.color.surface,
                        padding: '0.65rem',
                        fontWeight: 700,
                        fontSize: theme.font.sizeSm,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginTop: '0.25rem',
                        borderRadius: theme.radius.md,
                        border: `1.5px solid ${theme.color.dark}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={e => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.borderColor = '#1e293b'; }}
                      onMouseOut={e => { e.currentTarget.style.backgroundColor = theme.color.dark; e.currentTarget.style.borderColor = theme.color.dark; }}
                      onClick={() => handleOpenAssignModal(t)}
                    >
                      <UserPlus size={16} color="currentColor" />
                      Assign Teknisi &amp; Distribusikan
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'distributed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {distributedTickets.length === 0 ? (
              <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.lg, padding: '3.5rem', textAlign: 'center', color: theme.color.textMuted }}>
                <Layers size={42} color={theme.color.border} style={{ margin: '0 auto 0.75rem auto' }} />
                <p style={{ margin: 0, fontSize: theme.font.sizeMd, fontWeight: 600, color: theme.color.textSecondary }}>Belum ada pekerjaan terdistribusi.</p>
                <span style={{ fontSize: theme.font.sizeSm, color: theme.color.textMuted }}>Assign teknisi dari tab "Belum Terdistribusi".</span>
              </div>
            ) : (
              distributedTickets.map(t => {
                const job = getJob(t.ticketId);
                const isCompleted = job.status === 'Completed' || t.status === 'ServiceCompleted';
                return (
                  <div key={t.ticketId} style={{ background: theme.color.surface, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.lg, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: theme.shadow.card }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: theme.color.dark, color: theme.color.surface, padding: '2px 8px', borderRadius: theme.radius.sm, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                        {t.queueNumber || 'Non-Q'}
                      </span>
                      {isCompleted ? (
                        <span style={{ padding: '3px 9px', borderRadius: theme.radius.sm, background: '#16a34a', color: '#ffffff', fontSize: theme.font.sizeXs, fontWeight: 700 }}>
                          ✓ Selesai
                        </span>
                      ) : (
                        <span style={{ padding: '3px 9px', borderRadius: theme.radius.sm, background: '#0054a6', color: '#ffffff', fontSize: theme.font.sizeXs, fontWeight: 700 }}>
                          Dikerjakan
                        </span>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.color.textPrimary }}>{t.licensePlate}</div>
                      <div style={{ fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary }}>{t.customerName || t.wabCustomerName || '-'}</div>
                      <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, marginTop: '2px' }}>{t.vehicleModel} &bull; {t.serviceType || 'Periodic Service'}</div>
                    </div>

                    {job.assignedTechnician && (
                      <div style={{ background: theme.color.bg, border: `1px solid ${theme.color.borderLight}`, padding: '0.6rem 0.75rem', borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textPrimary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wrench size={15} color={theme.color.primary} />
                        <span>{job.assignedTechnician.stallName} &bull; <b>{job.assignedTechnician.name}</b> ({job.assignedTechnician.specialty})</span>
                      </div>
                    )}

                    {job.recommendations.length > 0 && (
                      <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md, padding: '0.75rem' }}>
                        <div style={{ fontSize: theme.font.sizeXs, fontWeight: 700, color: theme.color.textPrimary, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FileText size={14} color="#0054a6" />
                          <span>Rekomendasi Servis ({job.recommendations.length})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {job.recommendations.map(rec => (
                            <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: theme.font.sizeXs, padding: '0.35rem 0.5rem', background: theme.color.bg, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md }}>
                              <div>
                                <div style={{ fontWeight: 600, color: theme.color.textPrimary }}>{rec.description}</div>
                                <div style={{ color: theme.color.textMuted, fontSize: '0.725rem' }}>Sebelum: {formatDate(rec.beforeDate)}</div>
                              </div>
                              {!isCompleted && (
                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                  <button type="button" onClick={() => handleOpenRecModal(t.ticketId, rec)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0054a6', padding: '2px' }}><Edit2 size={13} /></button>
                                  <button type="button" onClick={() => setDelRecModal({ visible: true, ticketId: t.ticketId, rec })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.color.status.danger, padding: '2px' }}><Trash2 size={13} /></button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.trackingEntries.length > 0 && (
                      <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md, padding: '0.75rem' }}>
                        <div style={{ fontSize: theme.font.sizeXs, fontWeight: 700, color: theme.color.textPrimary, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Clock size={14} color="#d97706" />
                          <span>Tracking Pekerjaan ({job.trackingEntries.length})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {job.trackingEntries.map(entry => (
                            <div key={entry.id} style={{ fontSize: theme.font.sizeXs, padding: '0.35rem 0.5rem', background: theme.color.bg, border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md }}>
                              <div style={{ fontWeight: 600, color: theme.color.textPrimary }}>{entry.label}</div>
                              <div style={{ color: theme.color.textMuted, fontSize: '0.725rem' }}>Est. selesai: {formatDateTime(entry.estimatedDoneTime)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isCompleted ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              fontSize: theme.font.sizeSm,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              borderRadius: theme.radius.md,
                              border: '1.5px solid #0054a6',
                              backgroundColor: '#ffffff',
                              color: '#0054a6',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#0054a6'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#0054a6'; }}
                            onClick={() => handleOpenRecModal(t.ticketId)}
                          >
                            <FileText size={15} color="currentColor" />
                            + Rekomendasi
                          </button>

                          <button
                            type="button"
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              fontSize: theme.font.sizeSm,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              borderRadius: theme.radius.md,
                              border: '1.5px solid #d97706',
                              backgroundColor: '#ffffff',
                              color: '#d97706',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#d97706'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#d97706'; }}
                            onClick={() => handleOpenTrackModal(t.ticketId)}
                          >
                            <Clock size={15} color="currentColor" />
                            + Tracking
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              fontSize: theme.font.sizeSm,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              borderRadius: theme.radius.md,
                              border: '1.5px solid #64748b',
                              backgroundColor: '#ffffff',
                              color: '#334155',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#64748b'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#334155'; }}
                            onClick={() => handleOpenDelegModal(t.ticketId)}
                          >
                            <CornerUpRight size={15} color="currentColor" />
                            Pindahkan
                          </button>

                          <button
                            type="button"
                            style={{
                              flex: 1,
                              padding: '0.55rem',
                              fontSize: theme.font.sizeSm,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              borderRadius: theme.radius.md,
                              border: '1.5px solid #16a34a',
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#15803d'; e.currentTarget.style.borderColor = '#15803d'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#16a34a'; e.currentTarget.style.borderColor = '#16a34a'; }}
                            onClick={() => setFinishConfirmModal({ visible: true, ticket: t })}
                          >
                            <CheckCircle2 size={15} color="currentColor" />
                            Finish Job
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: theme.color.status.completed, fontWeight: 700, fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        <CheckCircle2 size={18} />
                        <span>Pekerjaan Selesai</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {assignModal.visible && (
        <ModalWrapper>
          <ModalCard width={480} style={{ borderRadius: theme.radius.lg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: `1px solid ${theme.color.borderLight}`, paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: theme.color.textPrimary }}>Assign Teknisi &amp; Stall</h3>
                <span style={{ fontSize: theme.font.sizeSm, color: theme.color.textMuted }}>{assignModal.ticket?.licensePlate} &bull; {assignModal.ticket?.vehicleModel}</span>
              </div>
              <button onClick={() => setAssignModal({ visible: false, ticket: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.color.textMuted }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.4rem' }}>Pilih Teknisi:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {MOCK_TECHNICIANS.map(tech => {
                    const isSel = assignTech?.id === tech.id;
                    return (
                      <div key={tech.id} onClick={() => setAssignTech(tech)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: theme.radius.md, border: isSel ? `1.5px solid ${theme.color.dark}` : `1px solid ${theme.color.borderLight}`, background: isSel ? theme.color.bg : theme.color.surface, cursor: 'pointer' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isSel ? theme.color.dark : theme.color.surfaceAlt, color: isSel ? theme.color.surface : theme.color.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>{tech.name.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: theme.font.sizeSm, fontWeight: isSel ? 700 : 600, color: theme.color.textPrimary }}>{tech.name}</div>
                          <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted }}>{tech.specialty}</div>
                        </div>
                        {isSel && <CheckCircle2 size={18} color={theme.color.dark} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.35rem' }}>Stall Bengkel:</label>
                <input style={{ width: '100%', padding: '0.6rem 0.75rem', border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textPrimary, boxSizing: 'border-box' }} placeholder="Misal: Stall 01" value={assignStall} onChange={e => setAssignStall(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: theme.radius.md }} onClick={() => setAssignModal({ visible: false, ticket: null })}>Batal</button>
                <button type="button" className="btn" style={{ flex: 1.5, backgroundColor: theme.color.dark, color: theme.color.surface, fontWeight: 700, borderRadius: theme.radius.md }} onClick={handleConfirmAssign}>Assign &amp; Distribusikan</button>
              </div>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}

      {recModal.visible && (
        <ModalWrapper>
          <ModalCard width={440} style={{ borderRadius: theme.radius.lg }}>
            <h4 style={{ margin: '0 0 1rem 0', color: theme.color.textPrimary, fontSize: '1rem', fontWeight: 700 }}>
              {recModal.existingRec ? 'Edit Rekomendasi' : '+ Rekomendasi'}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.35rem' }}>Deskripsi Rekomendasi:</label>
                <textarea rows={3} style={{ width: '100%', padding: '0.55rem', border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, fontFamily: 'inherit', boxSizing: 'border-box' }} placeholder="Contoh: Ganti Ban Depan, Ganti Aki, Flush Radiator..." value={recDesc} onChange={e => setRecDesc(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.4rem' }}>Dilakukan Sebelum (Target Tanggal):</label>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'center' }}>
                  <input
                    type="date"
                    value={recCustomDate}
                    onChange={e => {
                      setRecCustomDate(e.target.value);
                      setRecDateOffset(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.65rem',
                      border: `1px solid ${theme.color.borderLight}`,
                      borderRadius: theme.radius.md,
                      fontSize: theme.font.sizeSm,
                      color: theme.color.textPrimary,
                      backgroundColor: theme.color.surface,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ fontSize: theme.font.sizeXs, fontWeight: 600, color: theme.color.textMuted, marginBottom: '0.35rem' }}>Preset Cepat:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {DATE_CHIPS.map(c => {
                    const isSel = recDateOffset === c.offset;
                    return (
                      <button
                        key={c.offset}
                        type="button"
                        onClick={() => handlePresetDateClick(c.offset)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: theme.radius.md,
                          border: isSel ? `1.5px solid ${theme.color.dark}` : `1px solid ${theme.color.borderLight}`,
                          background: isSel ? theme.color.dark : theme.color.surface,
                          color: isSel ? theme.color.surface : theme.color.textSecondary,
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
                {recCustomDate && (
                  <div style={{ fontSize: theme.font.sizeXs, color: theme.color.primary, fontWeight: 600, marginTop: '0.4rem' }}>
                    &rarr; Target: {formatDate(recCustomDate)}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: theme.radius.md }} onClick={() => setRecModal({ visible: false, ticketId: null, existingRec: null })}>Batal</button>
                <button type="button" className="btn" style={{ flex: 1.5, backgroundColor: theme.color.dark, color: theme.color.surface, fontWeight: 700, borderRadius: theme.radius.md }} onClick={handleSaveRec}>{recModal.existingRec ? 'Update' : 'Simpan'}</button>
              </div>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}

      {delRecModal.visible && (
        <ModalWrapper>
          <ModalCard width={340} style={{ borderRadius: theme.radius.lg, textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.35rem 0', color: theme.color.textPrimary, fontSize: '1rem', fontWeight: 700 }}>Hapus Rekomendasi?</h4>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: theme.font.sizeSm, color: theme.color.textMuted }}>{delRecModal.rec?.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: theme.radius.md }} onClick={() => setDelRecModal({ visible: false, ticketId: null, rec: null })}>Batal</button>
              <button type="button" className="btn" style={{ flex: 1, backgroundColor: theme.color.status.danger, color: theme.color.surface, fontWeight: 700, borderRadius: theme.radius.md }} onClick={() => handleDeleteRec(delRecModal.ticketId, delRecModal.rec)}>Hapus</button>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}

      {trackModal.visible && (
        <ModalWrapper>
          <ModalCard width={440} style={{ borderRadius: theme.radius.lg }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: theme.color.textPrimary, fontSize: '1rem', fontWeight: 700 }}>+ Request Tracking Pekerjaan</h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: theme.font.sizeXs, color: theme.color.textMuted }}>Tracking tambahan akan mempengaruhi status di TV Display Customer Lounge.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.35rem' }}>Keterangan Pekerjaan:</label>
                <input style={{ width: '100%', padding: '0.6rem 0.75rem', border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, color: theme.color.textPrimary, boxSizing: 'border-box' }} placeholder="Contoh: Ganti Radiator, Kuras Minyak Rem..." value={trackLabel} onChange={e => setTrackLabel(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.4rem' }}>Estimasi Selesai:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {TIME_CHIPS.map(c => (
                    <button key={c.minutes} type="button" onClick={() => setTrackMinutes(c.minutes)} style={{ padding: '0.35rem 0.65rem', borderRadius: theme.radius.md, border: trackMinutes === c.minutes ? `1.5px solid ${theme.color.dark}` : `1px solid ${theme.color.borderLight}`, background: trackMinutes === c.minutes ? theme.color.dark : theme.color.surface, color: trackMinutes === c.minutes ? theme.color.surface : theme.color.textSecondary, fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}>
                      {c.label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted, marginTop: '0.35rem' }}>&rarr; Est. selesai: {formatDateTime(addMinutesToNow(trackMinutes))}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: theme.radius.md }} onClick={() => setTrackModal({ visible: false, ticketId: null })}>Batal</button>
                <button type="button" className="btn" style={{ flex: 1.5, backgroundColor: theme.color.dark, color: theme.color.surface, fontWeight: 700, borderRadius: theme.radius.md }} onClick={handleSaveTrack}>Tambah Tracking</button>
              </div>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}

      {delegModal.visible && (
        <ModalWrapper>
          <ModalCard width={460} style={{ borderRadius: theme.radius.lg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: `1px solid ${theme.color.borderLight}`, paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: theme.color.textPrimary }}>Pindahkan Tugas</h3>
              <button onClick={() => setDelegModal({ visible: false, ticketId: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.color.textMuted }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button type="button" onClick={() => setDelegSubTab('tech')} style={{ flex: 1, padding: '0.45rem', borderRadius: theme.radius.md, border: 'none', background: delegSubTab === 'tech' ? theme.color.dark : theme.color.surfaceAlt, color: delegSubTab === 'tech' ? theme.color.surface : theme.color.textSecondary, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <User size={14} /> Ganti Teknisi
              </button>
              <button type="button" onClick={() => setDelegSubTab('foreman')} style={{ flex: 1, padding: '0.45rem', borderRadius: theme.radius.md, border: 'none', background: delegSubTab === 'foreman' ? theme.color.dark : theme.color.surfaceAlt, color: delegSubTab === 'foreman' ? theme.color.surface : theme.color.textSecondary, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <Users size={14} /> Foreman Lain
              </button>
            </div>

            {delegSubTab === 'tech' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.4rem' }}>Pilih Teknisi Baru:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {MOCK_TECHNICIANS.map(tech => {
                      const isSel = delegTech?.id === tech.id;
                      return (
                        <div key={tech.id} onClick={() => setDelegTech(tech)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: theme.radius.md, border: isSel ? `1.5px solid ${theme.color.dark}` : `1px solid ${theme.color.borderLight}`, background: isSel ? theme.color.bg : theme.color.surface, cursor: 'pointer' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: isSel ? theme.color.dark : theme.color.surfaceAlt, color: isSel ? theme.color.surface : theme.color.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>{tech.name.charAt(0)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: theme.font.sizeSm, fontWeight: isSel ? 700 : 600, color: theme.color.textPrimary }}>{tech.name}</div>
                            <div style={{ fontSize: theme.font.sizeXs, color: theme.color.textMuted }}>{tech.specialty}</div>
                          </div>
                          {isSel && <CheckCircle2 size={16} color={theme.color.dark} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.35rem' }}>Stall Bengkel:</label>
                  <input style={{ width: '100%', padding: '0.55rem', border: `1px solid ${theme.color.borderLight}`, borderRadius: theme.radius.md, fontSize: theme.font.sizeSm, boxSizing: 'border-box' }} value={delegStall} onChange={e => setDelegStall(e.target.value)} placeholder="Stall 01" />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: theme.radius.md }} onClick={() => setDelegModal({ visible: false, ticketId: null })}>Batal</button>
                  <button type="button" className="btn" style={{ flex: 1.5, backgroundColor: theme.color.dark, color: theme.color.surface, fontWeight: 700, borderRadius: theme.radius.md }} onClick={handleConfirmChangeTech}>Ganti Teknisi</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: theme.color.bg, border: `1px solid ${theme.color.borderLight}`, padding: '0.65rem 0.75rem', borderRadius: theme.radius.md, fontSize: theme.font.sizeXs, color: theme.color.textSecondary, display: 'flex', gap: '0.5rem' }}>
                  <AlertCircle size={16} color={theme.color.textMuted} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Pekerjaan akan masuk ke antrian "Belum Terdistribusi" Foreman tujuan. Foreman penerima wajib assign ulang teknisi dari awal.</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: theme.font.sizeSm, fontWeight: 600, color: theme.color.textSecondary, marginBottom: '0.4rem' }}>Pilih Foreman Tujuan:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {MOCK_FOREMEN.filter(f => f.name !== foremanCurrentName).map(fm => {
                      const isSel = delegForeman?.id === fm.id;
                      return (
                        <div key={fm.id} onClick={() => setDelegForeman(fm)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: theme.radius.md, border: isSel ? `1.5px solid ${theme.color.dark}` : `1px solid ${theme.color.borderLight}`, background: isSel ? theme.color.bg : theme.color.surface, cursor: 'pointer' }}>
                          <User size={16} color={isSel ? theme.color.dark : theme.color.textMuted} />
                          <div style={{ flex: 1, fontSize: theme.font.sizeSm, fontWeight: isSel ? 700 : 600, color: isSel ? theme.color.dark : theme.color.textPrimary }}>{fm.name}</div>
                          {isSel && <CheckCircle2 size={16} color={theme.color.dark} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: theme.radius.md }} onClick={() => setDelegModal({ visible: false, ticketId: null })}>Batal</button>
                  <button type="button" className="btn" style={{ flex: 1.5, backgroundColor: theme.color.dark, color: theme.color.surface, fontWeight: 700, borderRadius: theme.radius.md }} onClick={handleConfirmDelegateForeman}>Pindahkan ke Foreman</button>
                </div>
              </div>
            )}
          </ModalCard>
        </ModalWrapper>
      )}

      {finishConfirmModal.visible && (
        <ModalWrapper>
          <ModalCard width={360} style={{ borderRadius: theme.radius.lg, textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.35rem 0', color: theme.color.textPrimary, fontSize: '1.05rem', fontWeight: 700 }}>Selesaikan Pekerjaan?</h4>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: theme.font.sizeSm, color: theme.color.textMuted }}>
              Tandai <b style={{ color: theme.color.textPrimary }}>{finishConfirmModal.ticket?.licensePlate}</b> sebagai Selesai Servis?
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1, borderRadius: theme.radius.md }} onClick={() => setFinishConfirmModal({ visible: false, ticket: null })}>Batal</button>
              <button type="button" className="btn" style={{ flex: 1.2, backgroundColor: '#16a34a', color: theme.color.surface, fontWeight: 700, borderRadius: theme.radius.md }} onClick={handleConfirmFinishJob}>Ya, Selesai</button>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}
    </div>
  );
}
