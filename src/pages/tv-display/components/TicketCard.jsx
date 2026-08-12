import React from 'react';

function maskLicensePlate(plate) {
  if (!plate) return '';
  return plate.trim().toUpperCase();
}

function maskCustomerName(name) {
  if (!name || name === 'Diisi oleh SA di WAB') return 'Pelanggan Walk-In';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

function resolveStatus(status) {
  const s = String(status).toLowerCase();
  if (s === 'checkedin' || s === '0') return { label: 'Check-In', color: '#0284c7' };
  if (['inspected', 'assignedtostall', 'inservice', 'pendingadditionalapproval', '1', '2', '3', '4'].includes(s))
    return { label: 'Dikerjakan', color: '#0054a6' };
  if (['servicecompleted', 'prehandoverready', 'handovercompleted', '5', '6', '7'].includes(s))
    return { label: 'Selesai', color: '#16a34a' };
  if (s === 'checkedout' || s === '8') return { label: 'Check-Out', color: '#475569' };
  return { label: 'Dikerjakan', color: '#0054a6' };
}

function getVehicleImage(vehicleModel) {
  if (!vehicleModel) return '/assets/vehicles/mobil_szk.png';
  const model = vehicleModel.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (model.includes('xl7')) return '/assets/vehicles/xl7.png';
  if (model.includes('ertiga')) return '/assets/vehicles/ertiga.png';
  if (model.includes('baleno')) return '/assets/vehicles/baleno.png';
  if (model.includes('jimny')) return '/assets/vehicles/jimny.png';
  if (model.includes('ignis')) return '/assets/vehicles/ignis.png';
  if (model.includes('grandvitara') || (model.includes('vitara') && !model.includes('evitara'))) return '/assets/vehicles/grandvitara.png';
  if (model.includes('evitara')) return '/assets/vehicles/evitara.png';
  if (model.includes('fronx')) return '/assets/vehicles/fronx.png';
  if (model.includes('scross') || model.includes('sx4')) return '/assets/vehicles/scross.png';
  if (model.includes('spresso') || model.includes('presso')) return '/assets/vehicles/s-presso.png';
  if (model.includes('apv')) return '/assets/vehicles/apv.png';
  if (model.includes('carry')) return '/assets/vehicles/carry.png';
  return '/assets/vehicles/mobil_szk.png';
}

const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function getHourSlot(checkInTime) {
  if (!checkInTime) return '08:00';
  const hour = new Date(checkInTime).getHours();
  const formatted = `${hour.toString().padStart(2, '0')}:00`;
  return TIME_SLOTS.includes(formatted) ? formatted : '08:00';
}

function formatFinishTime(ticket) {
  if (ticket.saTargetFinishTime) {
    try {
      const date = new Date(ticket.saTargetFinishTime);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      }
    } catch (e) {}
  }
  if (ticket.finishJobTime || ticket.finishTime) {
    try {
      const date = new Date(ticket.finishJobTime || ticket.finishTime);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      }
    } catch (e) {}
  }
  if (ticket.checkInTime) {
    try {
      const checkInDate = new Date(ticket.checkInTime);
      if (!isNaN(checkInDate.getTime())) {
        const estFinish = new Date(checkInDate.getTime() + (60 + Number(ticket.foremanExtraMinutes || 0)) * 60000);
        return estFinish.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      }
    } catch (e) {}
  }
  return '11:30 WIB';
}

export default function TicketCard({ ticket, rowIndex, isStretch = true }) {
  const { label: statusLabel, color: statusColor } = resolveStatus(ticket.status);
  const extraMins = Number(ticket.foremanExtraMinutes || 0);
  const hasExtraTime = extraMins > 0;

  const startSlot = getHourSlot(ticket.checkInTime);
  const activeSlot = startSlot;
  const startIdx = TIME_SLOTS.indexOf(startSlot);
  const activeIdx = TIME_SLOTS.indexOf(activeSlot);
  const colCount = TIME_SLOTS.length;

  const extraSlots = Math.max(1, Math.ceil(extraMins / 60));
  const endIdx = activeIdx >= 0 ? Math.min(colCount - 1, activeIdx + extraSlots) : -1;

  const rowBg = rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
  const accentColor = hasExtraTime ? '#d97706' : '#0f172a';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `280px repeat(${colCount}, minmax(90px, 1fr))`,
      borderBottom: '1px solid #e2e8f0',
      background: rowBg,
      alignItems: 'center',
      flex: isStretch ? 1 : 'none',
      height: isStretch ? 'auto' : '92px',
      minHeight: isStretch ? 0 : '92px',
      position: 'relative',
    }}>
      <div style={{
        padding: '0.65rem 1rem',
        borderRight: '1px solid #e2e8f0',
        borderLeft: `4px solid ${accentColor}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.25rem',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
          {ticket.queueNumber && (
            <span style={{
              background: '#eff6ff',
              color: '#0054a6',
              border: '1px solid #bfdbfe',
              padding: '2px 7px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.775rem',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.3px',
              flexShrink: 0,
              boxShadow: '0 1px 2px rgba(0, 84, 166, 0.06)'
            }}>
              {ticket.queueNumber}
            </span>
          )}
          <span style={{ fontWeight: 800, fontSize: '0.975rem', color: '#0f172a', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
            {(ticket.licensePlate || ticket.policeRegNo || '').toUpperCase()}
          </span>
        </div>

        <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ticket.serviceType || ticket.jobType || 'Periodic Service'}
        </div>

        <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 500 }}>Janji Selesai:</span>
          <span style={{ fontWeight: 700, color: hasExtraTime ? '#d97706' : '#0f172a' }}>
            {formatFinishTime(ticket)}
          </span>
          {hasExtraTime && (
            <span style={{ fontSize: '0.65rem', background: '#d97706', color: '#ffffff', padding: '1px 5px', borderRadius: '3px', fontWeight: 700, marginLeft: '2px' }}>
              +{extraMins}m
            </span>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        left: '280px', right: 0, top: '66px',
        height: '3px',
        background: '#e2e8f0',
        zIndex: 0,
      }} />

      {startIdx >= 0 && activeIdx >= 0 && (
        <div style={{
          position: 'absolute',
          left: `calc(280px + (100% - 280px) * ${startIdx / colCount})`,
          width: `calc((100% - 280px) * ${(activeIdx - startIdx + 1) / colCount})`,
          top: '66px',
          height: '3px',
          background: statusColor,
          zIndex: 1,
        }} />
      )}

      {hasExtraTime && activeIdx >= 0 && (
        <div style={{
          position: 'absolute',
          left: `calc(280px + (100% - 280px) * ${(activeIdx + 1) / colCount})`,
          width: `calc((100% - 280px) * ${(extraMins / 60) / colCount})`,
          top: '65px',
          height: '5px',
          backgroundColor: '#d97706',
          borderRadius: '2px',
          zIndex: 2,
          boxShadow: '0 0 6px rgba(217, 119, 6, 0.4)',
        }} />
      )}

      {TIME_SLOTS.map((slot, idx) => {
        const isPassed = idx >= startIdx && idx < activeIdx;
        const isActive = idx === activeIdx;
        const isExtendedSlot = hasExtraTime && idx > activeIdx && idx <= endIdx;

        return (
          <div
            key={slot}
            style={{
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute',
                top: '6px',
                height: '48px',
                width: '76px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}>
                <img
                  src={getVehicleImage(ticket.vehicleModel)}
                  alt={ticket.vehicleModel || "Suzuki Vehicle"}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
                  onError={e => { e.target.src = '/assets/vehicles/mobil_szk.png'; }}
                />
              </div>
            )}

            <div style={{
              position: 'absolute',
              top: '66px',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}>
              {isActive ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: statusColor,
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
                  {statusLabel}
                </div>
              ) : isExtendedSlot ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#d97706',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 5px rgba(217, 119, 6, 0.4)',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
                  +{extraMins}m Est
                </div>
              ) : isPassed ? (
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: statusColor,
                  border: '2px solid #ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                }} />
              ) : (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#cbd5e1',
                  border: '2px solid #ffffff',
                }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { TIME_SLOTS };
