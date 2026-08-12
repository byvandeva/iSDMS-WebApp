export const getPurposeString = (purpose) => {
  if (!purpose) return 'Service';
  const raw = typeof purpose === 'object' ? (purpose.id || purpose.label || purpose.name || '') : purpose;
  const str = String(raw).trim();
  if (str === '0' || str.toLowerCase() === 'service') return 'Service';
  if (str === '1' || str.toLowerCase() === 'sales') return 'Sales';
  if (str === '2' || str.toLowerCase() === 'bodyrepair' || str.toLowerCase() === 'body repair') return 'BodyRepair';
  if (str === '3' || str.toLowerCase() === 'sparepart' || str.toLowerCase() === 'spare part') return 'SparePart';
  return str || 'Service';
};

export const getStatusString = (status) => {
  if (!status) return 'Check-In';
  const s = String(status).toLowerCase().trim();
  if (s === '0' || s === 'checkedin') return 'Check-In';
  if (s === '1' || s === 'inspected') return 'Form WAB Selesai';
  if (s === '2' || s === 'assignedtostall' || s === '3' || s === 'inservice') return 'Dikerjakan';
  if (s === '4' || s === 'pendingadditionalapproval') return 'Menunggu Approval';
  if (s === '5' || s === 'servicecompleted') return 'Selesai';
  if (s === '6' || s === 'prehandoverready') return 'Siap Penyerahan';
  if (s === '7' || s === 'handovercompleted') return 'Selesai Handover';
  if (s === '8' || s === 'checkedout') return 'Check-Out';
  return String(status);
};
