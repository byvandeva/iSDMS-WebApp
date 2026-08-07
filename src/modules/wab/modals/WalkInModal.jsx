import React, { useState, useRef } from 'react';
import { Wrench, ShoppingBag, Layers, Package, Camera, CheckCircle } from 'lucide-react';

const OCR_SPACE_API_KEY = 'K89836873688957';

export default function WalkInModal({ isOpen, onClose, onSubmit }) {
  const [checkInForm, setCheckInForm] = useState({
    licensePlate: '',
    vehicleModel: '',
    arrivalPurpose: 'Service'
  });
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrPhotoUrl, setOcrPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const extractLicensePlate = (rawText) => {
    if (!rawText) return '';
    const cleanText = rawText.toUpperCase().replace(/\r?\n|\r/g, ' ').replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    const strictMatch = cleanText.match(/\b([A-Z]{1,2})\s*([0-9]{1,4})\s*([A-Z]{1,3})\b/);
    if (strictMatch) return `${strictMatch[1]} ${strictMatch[2]} ${strictMatch[3]}`;

    const unspacedMatch = cleanText.match(/([A-Z]{1,2})([0-9]{1,4})([A-Z]{1,3})/);
    if (unspacedMatch) return `${unspacedMatch[1]} ${unspacedMatch[2]} ${unspacedMatch[3]}`;

    const partialMatch = cleanText.match(/([A-Z]{1,2}\s*[0-9]{1,4}|[0-9]{1,4}\s*[A-Z]{1,3})/);
    if (partialMatch) return partialMatch[0];

    const alphaNumOnly = cleanText.replace(/[^A-Z0-9 ]/g, '').trim();
    if (alphaNumOnly.length >= 3) return alphaNumOnly;

    return '';
  };

  const handleOcrFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setOcrPhotoUrl(fileUrl);
    setIsOcrScanning(true);

    try {
      let rawText = '';
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('apikey', OCR_SPACE_API_KEY);
        formData.append('OCREngine', '2');
        formData.append('scale', 'true');
        formData.append('detectOrientation', 'true');
        formData.append('isTable', 'false');
        formData.append('language', 'eng');

        let response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          body: formData,
        });

        if (response.status === 429) {
          await new Promise(r => setTimeout(r, 1000));
          response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
          });
        }

        if (response.ok) {
          const json = await response.json();
          rawText = json?.ParsedResults?.[0]?.ParsedText || '';
        }
      } catch (apiErr) {
        console.warn('Web API OCR fallback:', apiErr);
      }

      const parsedPlate = extractLicensePlate(rawText);

      if (parsedPlate) {
        setCheckInForm(prev => ({ ...prev, licensePlate: parsedPlate }));
        alert(`Scan Berhasil!\n\nNomor polisi terdeteksi: ${parsedPlate}\n\nSilakan periksa atau sesuaikan jika ada karakter yang perlu dikoreksi.`);
      } else {
        alert(`Foto Terlampir\n\nTeks terbaca: "${rawText.trim() || '(tidak ada)'}"\n\nSilakan masukkan nomor polisi secara manual.`);
      }
    } catch (err) {
      console.error('OCR error:', err);
      alert('Koneksi Gagal: Tidak dapat menghubungi server OCR. Periksa koneksi internet Anda, atau masukkan nomor polisi manual.');
    } finally {
      setIsOcrScanning(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(checkInForm);
    setCheckInForm({ licensePlate: '', vehicleModel: '', arrivalPurpose: 'Service' });
    setOcrPhotoUrl(null);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '1.75rem 2rem', borderRadius: '14px', width: 450, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: 700 }}>Walk-In</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#0f172a', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '4px', lineHeight: 1 }}
            title="Tutup Modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleOcrFileChange}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nomor Polisi</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isOcrScanning}
                style={{
                  background: '#ffffffff',
                  border: '1px solid #0f172a',
                  color: '#0f172a',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Camera size={13} />
                <span>{isOcrScanning ? 'Memproses OCR...' : 'Foto / Scan'}</span>
              </button>
            </div>

            {ocrPhotoUrl && (
              <div style={{ position: 'relative', marginBottom: '0.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                <img src={ocrPhotoUrl} alt="OCR Plat Preview" style={{ width: '100%', height: '133px', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(15, 23, 42, 0.85)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={12} color="#22c55e" />
                  <span>{isOcrScanning ? 'Membaca Plat...' : `Result: ${checkInForm.licensePlate || '-'}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOcrPhotoUrl(null)}
                  style={{ position: 'absolute', top: '6px', right: '8px', background: 'rgba(225, 29, 72, 0.85)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕ Hapus
                </button>
              </div>
            )}

            <input style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }} value={checkInForm.licensePlate} onChange={e => setCheckInForm({ ...checkInForm, licensePlate: e.target.value })} placeholder="B 1234 ABC" required />
          </div>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.85rem' }}>Model / Tipe Kendaraan</label>
            <input
              type="text"
              style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', fontSize: '0.85rem', color: '#0f172a', boxSizing: 'border-box' }}
              value={checkInForm.vehicleModel}
              onChange={e => {
                setCheckInForm({ ...checkInForm, vehicleModel: e.target.value });
                setIsModelDropdownOpen(true);
              }}
              onFocus={() => setIsModelDropdownOpen(true)}
              placeholder="Ketik untuk mencari model... (contoh: XL7, Ertiga)"
              required
            />

            {isModelDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '180px',
                  overflowY: 'auto',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  zIndex: 1050,
                  marginTop: '4px'
                }}
              >
                {[
                  'Suzuki Fronx',
                  'Suzuki New XL7 Hybrid',
                  'Suzuki Grand Vitara',
                  'Suzuki All New Ertiga Hybrid',
                  'Suzuki Jimny 5-Door',
                  'Suzuki Jimny 3-Door',
                  'Suzuki Baleno',
                  'Suzuki S-Presso',
                  'Suzuki New Carry Pick Up',
                  'Suzuki APV Arena',
                  'Suzuki Ignis',
                  'Suzuki XL7 Alpha',
                  'Suzuki XL7 Beta',
                  'Suzuki All New Ertiga Cruise',
                  'Suzuki Ertiga',
                  'Suzuki XL7',
                  'Suzuki Swift',
                  'Suzuki Celerio',
                  'Suzuki Karimun Wagon R',
                  'Suzuki Splash',
                  'Suzuki Ciaz',
                  'Suzuki SX4 S-Cross',
                  'Suzuki Vitara Brezza',
                  'Suzuki Karimun Estilo',
                  'Suzuki APV'
                ]
                  .filter(m => !checkInForm.vehicleModel || m.toLowerCase().includes(checkInForm.vehicleModel.toLowerCase()))
                  .map((modelName) => (
                    <div
                      key={modelName}
                      onClick={() => {
                        setCheckInForm({ ...checkInForm, vehicleModel: modelName });
                        setIsModelDropdownOpen(false);
                      }}
                      style={{
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        color: '#0f172a',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: checkInForm.vehicleModel === modelName ? '700' : '500',
                        background: checkInForm.vehicleModel === modelName ? '#f1f5f9' : '#ffffff'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={e => e.currentTarget.style.background = checkInForm.vehicleModel === modelName ? '#f1f5f9' : '#ffffff'}
                    >
                      <span>🚗 {modelName}</span>
                      {checkInForm.vehicleModel === modelName && <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Tujuan Kedatangan</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[
                { id: 'Service', label: 'Service', icon: Wrench },
                { id: 'Sales', label: 'Sales', icon: ShoppingBag },
                { id: 'BodyRepair', label: 'Body Repair', icon: Layers },
                { id: 'SparePart', label: 'Spare Part', icon: Package }
              ].map(p => {
                const IconComp = p.icon;
                const isActive = (checkInForm.arrivalPurpose || 'Service') === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setCheckInForm({ ...checkInForm, arrivalPurpose: p.id })}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: '6px',
                      border: isActive ? '2px solid #0f172a' : '1px solid #cbd5e1',
                      background: isActive ? '#0f172a' : '#ffffff',
                      color: isActive ? '#ffffff' : '#334155',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComp size={15} color={isActive ? '#ffffff' : '#0f172a'} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn" style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
