import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check } from 'lucide-react';

export default function SignaturePad({ onSignChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // High DPI Canvas setup
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();

    if (onSignChange) {
      onSignChange(canvas.toDataURL());
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && onSignChange) {
      onSignChange(canvas.toDataURL());
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    if (onSignChange) {
      onSignChange(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        height: '140px',
        borderRadius: '10px',
        border: hasSigned ? '2px solid #0f172a' : '2px dashed #cbd5e1',
        background: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        touchAction: 'none'
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'crosshair',
            display: 'block'
          }}
        />

        {!hasSigned && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            color: '#94a3b8',
            fontSize: '0.825rem',
            fontWeight: 500,
            textAlign: 'center',
            userSelect: 'none'
          }}>
            ✍️ Usap atau gunakan mouse/stylus untuk tanda tangan di sini
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '460px', marginTop: '0.65rem' }}>
        <span style={{ fontSize: '0.775rem', color: hasSigned ? '#16a34a' : '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {hasSigned ? (
            <>
              <Check size={14} color="#16a34a" /> Tanda tangan telah terekam
            </>
          ) : (
            'Tanda tangan wajib diisi oleh Pelanggan / SA'
          )}
        </span>

        <button
          type="button"
          onClick={handleClear}
          disabled={!hasSigned}
          style={{
            background: 'none',
            border: 'none',
            color: hasSigned ? '#ef4444' : '#cbd5e1',
            fontSize: '0.775rem',
            fontWeight: 700,
            cursor: hasSigned ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RotateCcw size={13} /> Reset / Hapus TTD
        </button>
      </div>
    </div>
  );
}
