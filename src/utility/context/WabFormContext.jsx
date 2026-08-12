import React, { createContext, useContext, useState, useCallback } from 'react';
import { submitWabForm } from '../../pages/services/wab/api';

export const WabFormContext = createContext(null);

const INITIAL_FUNCTIONAL_INSPECTIONS = [
  { id: 'horn', name: 'Klakson / Horn', status: 'OK', notes: '' },
  { id: 'wiper', name: 'Wiper & Air Washer', status: 'OK', notes: '' },
  { id: 'ac', name: 'Sistem AC / Pendingin', status: 'OK', notes: '' },
  { id: 'tires', name: 'Kondisi Ban & Tekanan Angin', status: 'OK', notes: '' },
  { id: 'radiator', name: 'Cairan Radiator / Coolant', status: 'OK', notes: '' },
  { id: 'lights', name: 'Sistem Lampu (Headlamp/Tail/Sein)', status: 'OK', notes: '' },
  { id: 'battery', name: 'Aki / Baterai', status: 'OK', notes: '' },
  { id: 'brake', name: 'Sistem Rem / Minyak Rem', status: 'OK', notes: '' }
];

const INITIAL_EXTERIOR_TEXT_NOTES = [];

export function WabFormProvider({ children }) {
  const [wabStep, setWabStep] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [saCustomerName, setSaCustomerName] = useState('');
  const [saCustomerPhone, setSaCustomerPhone] = useState('');
  const [saCustomerEmail, setSaCustomerEmail] = useState('');
  const [saDriverName, setSaDriverName] = useState('');
  const [saIdentityNo, setSaIdentityNo] = useState('');
  const [saCustomerAddress, setSaCustomerAddress] = useState('');
  const [saPoliceRegNo, setSaPoliceRegNo] = useState('');
  const [saVehicleModel, setSaVehicleModel] = useState('');
  const [saOdometer, setSaOdometer] = useState('');
  const [saJobType, setSaJobType] = useState('Periodic Service');
  const [saStallCode, setSaStallCode] = useState('STALL-01');
  const [saServiceAdvisor, setSaServiceAdvisor] = useState('58970');
  const [customerComplaints, setCustomerComplaints] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const [saSignatureData, setSaSignatureData] = useState(null);
  const [damages, setDamages] = useState([]);
  const [exteriorTextNotes, setExteriorTextNotes] = useState(INITIAL_EXTERIOR_TEXT_NOTES);
  const [newTextCategory, setNewTextCategory] = useState('');
  const [newTextNote, setNewTextNote] = useState('');
  const [functionalInspections, setFunctionalInspections] = useState(INITIAL_FUNCTIONAL_INSPECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState(null);
  const [focusFrame, setFocusFrame] = useState(null);
  const [showExteriorModal, setShowExteriorModal] = useState(false);

  const handleFunctionalChange = useCallback((id, field, value) => {
    setFunctionalInspections(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }, []);

  const handleMarkAllFunctionalOk = useCallback(() => {
    setFunctionalInspections(prev => prev.map(item => ({ ...item, status: 'OK' })));
  }, []);

  const handleAddTextNote = useCallback(() => {
    if (!newTextNote) return;
    setExteriorTextNotes(prev => [...prev, { id: Date.now().toString(), category: newTextCategory || 'Exterior', note: newTextNote }]);
    setNewTextCategory('');
    setNewTextNote('');
  }, [newTextNote, newTextCategory]);

  const handleRemoveTextNote = useCallback((id) => {
    setExteriorTextNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const handlePartClick = useCallback((context) => {
    const ctx = typeof context === 'string' ? { part: context } : context;
    setSelectedContext(ctx);
    setIsModalOpen(true);
  }, []);

  const handleSaveDamage = useCallback((damageRecord) => {
    if (selectedContext && selectedContext.id) {
      setDamages(prev => prev.map(d => d.id === selectedContext.id ? { ...d, ...damageRecord } : d));
    } else {
      const newDamage = { ...selectedContext, ...damageRecord, id: Date.now().toString() };
      setDamages(prev => [...prev, newDamage]);
    }
    setIsModalOpen(false);
  }, [selectedContext]);

  const handleRemoveDamage = useCallback((id) => {
    setDamages(prev => prev.filter(d => d.id !== id));
  }, []);

  const handleDamageClick = useCallback((damage) => {
    if (damage.frame !== undefined) {
      setFocusFrame({ frame: damage.frame, ts: Date.now() });
    }
  }, []);

  const handleEditDamage = useCallback((damage) => {
    if (damage.frame !== undefined) {
      setFocusFrame({ frame: damage.frame, ts: Date.now() });
    }
    setSelectedContext(damage);
    setIsModalOpen(true);
  }, []);

  const handleSaveExteriorInspection = useCallback(() => {
    setShowExteriorModal(false);
  }, []);

  const resetWabForm = useCallback(() => {
    setWabStep(1);
    setSelectedTicket(null);
    setSaCustomerName('');
    setSaCustomerPhone('');
    setSaCustomerEmail('');
    setSaDriverName('');
    setSaIdentityNo('');
    setSaCustomerAddress('');
    setSaPoliceRegNo('');
    setSaVehicleModel('');
    setSaOdometer('');
    setSaJobType('Periodic Service');
    setSaStallCode('STALL-01');
    setSaServiceAdvisor('58970');
    setCustomerComplaints('');
    setSignatureData(null);
    setSaSignatureData(null);
    setDamages([]);
    setExteriorTextNotes(INITIAL_EXTERIOR_TEXT_NOTES);
    setNewTextCategory('');
    setNewTextNote('');
    setFunctionalInspections(INITIAL_FUNCTIONAL_INSPECTIONS);
  }, []);

  return (
    <WabFormContext.Provider value={{
      wabStep, setWabStep,
      selectedTicket, setSelectedTicket,
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
      signatureData, setSignatureData,
      saSignatureData, setSaSignatureData,
      damages, setDamages,
      exteriorTextNotes, setExteriorTextNotes,
      newTextCategory, setNewTextCategory,
      newTextNote, setNewTextNote,
      functionalInspections, setFunctionalInspections,
      isModalOpen, setIsModalOpen,
      selectedContext, setSelectedContext,
      focusFrame, setFocusFrame,
      showExteriorModal, setShowExteriorModal,
      handleFunctionalChange,
      handleMarkAllFunctionalOk,
      handleAddTextNote,
      handleRemoveTextNote,
      handlePartClick,
      handleSaveDamage,
      handleRemoveDamage,
      handleDamageClick,
      handleEditDamage,
      handleSaveExteriorInspection,
      resetWabForm
    }}>
      {children}
    </WabFormContext.Provider>
  );
}
