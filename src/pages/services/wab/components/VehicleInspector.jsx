import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';

export default function VehicleInspector({ onPartClick, damages = [], focusFrame }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDamage, setHoveredDamage] = useState(null);
  const containerRef = useRef(null);
  const dragStartX = useRef(0);

  const TOTAL_FRAMES = 36;

  useEffect(() => {
    if (focusFrame && focusFrame.frame !== undefined) {
      const frameIdx = focusFrame.frame >= 1 && focusFrame.frame <= 36
        ? focusFrame.frame - 1
        : Math.max(0, Math.min(35, focusFrame.frame));
      setCurrentFrame(frameIdx);
    }
  }, [focusFrame]);

  const images = useMemo(() => {
    return Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
      const padIndex = String(i + 1).padStart(2, '0');
      return `/assets/360/xl7/${padIndex}.jpg`;
    });
  }, []);

  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const hasMovedRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    const posX = e.clientX || (e.touches && e.touches[0].clientX);
    const posY = e.clientY || (e.touches && e.touches[0].clientY);
    dragStartX.current = posX;
    dragStartPosRef.current = { x: posX, y: posY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (dragStartPosRef.current) {
      const dist = Math.hypot(clientX - dragStartPosRef.current.x, clientY - dragStartPosRef.current.y);
      if (dist > 5) {
        hasMovedRef.current = true;
      }
    }

    const deltaX = clientX - dragStartX.current;
    const pixelsPerFrame = 7;

    if (Math.abs(deltaX) > pixelsPerFrame) {
      const framesToMove = Math.floor(deltaX / pixelsPerFrame);
      let newFrame = (currentFrame - framesToMove) % TOTAL_FRAMES;
      if (newFrame < 0) newFrame += TOTAL_FRAMES;

      setCurrentFrame(newFrame);
      dragStartX.current = clientX;
    }
  };

  const handlePointerUp = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };

  const handleCanvasDoubleClick = (e) => {
    if (hasMovedRef.current) return;
    if (!containerRef.current) return;

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = Math.max(6, Math.min(94, ((clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(6, Math.min(94, ((clientY - rect.top) / rect.height) * 100));

    const mobileFrameNumber = currentFrame + 1;

    onPartClick && onPartClick({
      part: `Bodi (${Math.round(xPercent)}%, ${Math.round(yPercent)}%)`,
      x: Math.round(xPercent * 10) / 10,
      y: Math.round(yPercent * 10) / 10,
      frame: mobileFrameNumber
    });
  };

  const setAnglePreset = (frameIndex) => {
    setCurrentFrame(frameIndex);
  };

  const angleDegree = Math.round((currentFrame / TOTAL_FRAMES) * 360);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '580px', gap: '0.85rem', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RotateCw size={16} color="#0f172a" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Sudut Rotasi: {angleDegree}°</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(Frame {currentFrame + 1} / {TOTAL_FRAMES})</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { label: 'Depan (0°)', frame: 0 },
            { label: 'Kanan (90°)', frame: 9 },
            { label: 'Belakang (180°)', frame: 18 },
            { label: 'Kiri (270°)', frame: 27 }
          ].map(btn => (
            <button
              key={btn.frame}
              type="button"
              onClick={() => setAnglePreset(btn.frame)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: currentFrame === btn.frame ? '1px solid #0f172a' : '1px solid #cbd5e1',
                background: currentFrame === btn.frame ? '#0f172a' : '#ffffff',
                color: currentFrame === btn.frame ? '#ffffff' : '#334155',
                fontSize: '0.775rem',
                fontWeight: currentFrame === btn.frame ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onDoubleClick={handleCanvasDoubleClick}
        style={{
          width: '100%',
          height: '520px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          position: 'relative',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'crosshair',
          touchAction: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Suzuki XL7 Frame ${index}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '92%',
              objectFit: 'contain',
              opacity: currentFrame === index ? 1 : 0,
              pointerEvents: 'none'
            }}
          />
        ))}

        {damages.map((d, index) => {
          if (d.x === undefined || d.y === undefined || d.frame === undefined) return null;

          const normalizedFrame = d.frame >= 1 && d.frame <= 36 ? d.frame - 1 : d.frame;
          if (normalizedFrame !== currentFrame) return null;

          const dotColor = d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#15803d';

          return (
            <div
              key={d.id || index}
              onMouseEnter={() => setHoveredDamage(d)}
              onMouseLeave={() => setHoveredDamage(null)}
              style={{
                position: 'absolute',
                top: `${Math.max(6, Math.min(94, d.y))}%`,
                left: `${Math.max(6, Math.min(94, d.x))}%`,
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                border: '2px solid #ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
                zIndex: 99,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              title={`${d.type || 'Kerusakan'} (${d.severity || 'Low'}) - ${d.notes || 'Tanpa catatan'}`}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffffff' }} />

              {hoveredDamage?.id === d.id && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '26px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    zIndex: 100,
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={12} color={dotColor} />
                    <span>{d.type || 'Kerusakan'} ({d.severity || 'Low'})</span>
                  </div>
                  {d.notes && <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 400, marginTop: '2px' }}>{d.notes}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.25rem 0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>0° (Depan)</span>
        <input
          type="range"
          min="0"
          max={TOTAL_FRAMES - 1}
          value={currentFrame}
          onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
          style={{ flex: 1, height: '6px', accentColor: '#0f172a', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>360° (Rotasi)</span>
      </div>
    </div>
  );
}
