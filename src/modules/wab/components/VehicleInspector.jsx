import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, RotateCw } from 'lucide-react';

export default function VehicleInspector({ onPartClick, damages = [], focusFrame }) {
  const [currentFrame, setCurrentFrame] = useState(0); // 0 to 35
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const dragStartX = useRef(0);

  // Real Suzuki XL7 sequence has 36 frames
  const TOTAL_FRAMES = 36;

  // React to focusFrame changes from the sidebar
  useEffect(() => {
    if (focusFrame && focusFrame.frame !== undefined) {
      setCurrentFrame(focusFrame.frame);
    }
  }, [focusFrame]);

  // The downloaded exact Suzuki Caribbean XL7 images
  const images = useMemo(() => {
    return Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
      const padIndex = String(i + 1).padStart(2, '0');
      return `/xl7/${padIndex}.jpg`;
    });
  }, []);

  // Preload all 36 images for perfectly smooth scrolling
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Turntable Drag Logic
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - dragStartX.current;
    const pixelsPerFrame = 8; // Extra smooth 8px per frame sensitivity

    if (Math.abs(deltaX) > pixelsPerFrame) {
      const framesToMove = Math.floor(deltaX / pixelsPerFrame);
      let newFrame = (currentFrame - framesToMove) % TOTAL_FRAMES;
      if (newFrame < 0) newFrame += TOTAL_FRAMES;

      setCurrentFrame(newFrame);
      dragStartX.current = clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e) => {
    if (isDragging) return;
    if (!containerRef.current) return;

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    const yPercent = ((clientY - rect.top) / rect.height) * 100;

    onPartClick && onPartClick({
      part: `Bodi (${Math.round(xPercent)}%, ${Math.round(yPercent)}%)`,
      x: xPercent,
      y: yPercent,
      frame: currentFrame
    });
  };

  // Quick Angle Presets
  const setAnglePreset = (frameIndex) => {
    setCurrentFrame(frameIndex);
  };

  const angleDegree = Math.round((currentFrame / TOTAL_FRAMES) * 360);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '620px', gap: '1rem', userSelect: 'none' }}>
      {/* QUICK ANGLE PRESET CONTROL BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RotateCw size={16} color="#0f172a" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Sudut Rotasi: {angleDegree}°</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(Frame {currentFrame + 1} / {TOTAL_FRAMES})</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { label: 'Depan (0°)', frame: 0 },
            { label: 'Samping Kanan (90°)', frame: 9 },
            { label: 'Belakang (180°)', frame: 18 },
            { label: 'Samping Kiri (270°)', frame: 27 }
          ].map(btn => (
            <button
              key={btn.frame}
              type="button"
              onClick={() => setAnglePreset(btn.frame)}
              style={{
                padding: '4px 10px',
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

      {/* 360 HIGH-RES CANVAS VIEW CONTAINER (LARGE 620PX HEIGHT) */}
      <div
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        style={{
          width: '100%',
          height: '560px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          position: 'relative',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
      >
        {/* Render all 36 photos seamlessly */}
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
              height: '100%',
              objectFit: 'contain',
              opacity: currentFrame === index ? 1 : 0,
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Dynamic User-Logged Damages */}
        {damages.map((d, index) => {
          if (!d.x || !d.y || d.frame === undefined) return null;

          const frameDiff = Math.abs(currentFrame - d.frame);
          const wrappedDiff = Math.min(frameDiff, TOTAL_FRAMES - frameDiff);

          // Only show markers if the car is on the frame where it was logged
          if (wrappedDiff === 0) {
            const pinBg = d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#16a34a';

            return (
              <div
                key={d.id || index}
                style={{
                  position: 'absolute',
                  top: `${d.y}%`,
                  left: `${d.x}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '0.725rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
                  border: `2px solid ${pinBg}`
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pinBg }} />
                <span>{d.type}</span>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* ROTATION RANGE SLIDER CONTROL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.25rem 0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>0°</span>
        <input
          type="range"
          min="0"
          max={TOTAL_FRAMES - 1}
          value={currentFrame}
          onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
          style={{ flex: 1, height: '6px', accentColor: '#0f172a', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>360°</span>
      </div>
    </div>
  );
}
