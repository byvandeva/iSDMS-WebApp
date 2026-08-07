import { useState } from 'react';

const DEFAULT_FUNCTIONAL_INSPECTIONS = [
  { id: 'horn',     name: 'Klakson / Horn',                  status: 'OK', notes: '' },
  { id: 'wiper',    name: 'Wiper & Air Washer',               status: 'OK', notes: '' },
  { id: 'ac',       name: 'Sistem AC / Pendingin',            status: 'OK', notes: '' },
  { id: 'tires',    name: 'Kondisi Ban & Tekanan Angin',      status: 'OK', notes: '' },
  { id: 'radiator', name: 'Cairan Radiator / Coolant',       status: 'OK', notes: '' },
  { id: 'lights',   name: 'Sistem Lampu (Headlamp/Tail/Sein)', status: 'OK', notes: '' },
  { id: 'battery',  name: 'Aki / Baterai',                   status: 'OK', notes: '' },
  { id: 'brake',    name: 'Sistem Rem / Minyak Rem',         status: 'OK', notes: '' },
];

const DEFAULT_EXTERIOR_TEXT_NOTES = [
  { id: '1', category: 'Spion',     note: '' },
  { id: '2', category: 'Ban Serep', note: '' },
];

/**
 * Hook that owns WAB 5-step form state.
 * Separating this from useTickets keeps each hook focused on a single concern.
 */
export function useWabForm() {
  const [wabStep, setWabStep]               = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Step 1: Customer Info
  const [customerName, setCustomerName]       = useState('');
  const [customerPhone, setCustomerPhone]     = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerComplaints, setCustomerComplaints] = useState('');

  // Step 2: Signature
  const [signatureData, setSignatureData] = useState(null);

  // Step 3: Damages & exterior notes
  const [damages, setDamages]                   = useState([]);
  const [exteriorTextNotes, setExteriorTextNotes] = useState(DEFAULT_EXTERIOR_TEXT_NOTES);

  // Step 4: Functional inspections
  const [functionalInspections, setFunctionalInspections] = useState(DEFAULT_FUNCTIONAL_INSPECTIONS);

  const updateFunctionalInspection = (id, field, value) => {
    setFunctionalInspections(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const resetForm = () => {
    setWabStep(1);
    setSelectedTicket(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setCustomerComplaints('');
    setSignatureData(null);
    setDamages([]);
    setExteriorTextNotes(DEFAULT_EXTERIOR_TEXT_NOTES);
    setFunctionalInspections(DEFAULT_FUNCTIONAL_INSPECTIONS);
  };

  return {
    wabStep, setWabStep,
    selectedTicket, setSelectedTicket,
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    customerAddress, setCustomerAddress,
    customerComplaints, setCustomerComplaints,
    signatureData, setSignatureData,
    damages, setDamages,
    exteriorTextNotes, setExteriorTextNotes,
    functionalInspections, updateFunctionalInspection,
    resetForm,
  };
}
