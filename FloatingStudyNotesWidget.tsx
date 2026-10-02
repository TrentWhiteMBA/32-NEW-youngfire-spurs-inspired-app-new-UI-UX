import React, { useState, useEffect, useRef } from 'react';
import { PenTool } from 'lucide-react';
import { AppTheme } from '../data/appThemes';

interface FloatingStudyNotesWidgetProps {
  onOpen: () => void;
  activeTheme?: AppTheme;
}

export const FloatingStudyNotesWidget: React.FC<FloatingStudyNotesWidgetProps> = ({
  onOpen,
  activeTheme
}) => {
  // Saved or initial position (bottom right)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('youngfire_notes_widget_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {}
    // Default position: lower right quadrant
    const defaultX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 68) : 320;
    const defaultY = typeof window !== 'undefined' ? Math.max(80, window.innerHeight - 170) : 560;
    return { x: defaultX, y: defaultY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    moved: false
  });

  const accentColor = activeTheme?.accentHex || '#F59E0B';
  const borderColor = activeTheme?.borderHex || `${accentColor}80`;

  // Keep widget on screen on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(Math.max(12, prev.x), window.innerWidth - 64),
        y: Math.min(Math.max(70, prev.y), window.innerHeight - 120)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y,
      moved: false
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }
    const nextX = Math.min(Math.max(12, dragStartRef.current.initialX + dx), window.innerWidth - 64);
    const nextY = Math.min(Math.max(70, dragStartRef.current.initialY + dy), window.innerHeight - 120);
    setPosition({ x: nextX, y: nextY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!dragStartRef.current.moved) {
      onOpen();
    } else {
      try {
        localStorage.setItem('youngfire_notes_widget_pos', JSON.stringify(position));
      } catch {}
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      moved: false
    };
    setIsDragging(true);

    const handleMouseMove = (moveEv: MouseEvent) => {
      const dx = moveEv.clientX - dragStartRef.current.startX;
      const dy = moveEv.clientY - dragStartRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragStartRef.current.moved = true;
      }
      const nextX = Math.min(Math.max(12, dragStartRef.current.initialX + dx), window.innerWidth - 64);
      const nextY = Math.min(Math.max(70, dragStartRef.current.initialY + dy), window.innerHeight - 120);
      setPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (!dragStartRef.current.moved) {
        onOpen();
      } else {
        try {
          localStorage.setItem('youngfire_notes_widget_pos', JSON.stringify(position));
        } catch {}
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      className={`fixed z-40 select-none cursor-grab active:cursor-grabbing transition-transform ${
        isDragging ? 'scale-110 shadow-2xl' : 'scale-100 hover:scale-105'
      }`}
      title="Study Notes (Drag anywhere or Tap to Open)"
      aria-label="Floating Movable Study Notes HUD"
    >
      <div 
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-black/90 backdrop-blur-xl border-2 flex items-center justify-center shadow-2xl relative group"
        style={{
          borderColor: borderColor,
          boxShadow: `0 8px 25px ${accentColor}40`
        }}
      >
        <div 
          className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <PenTool 
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12"
          style={{ color: accentColor }}
        />
        <span 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-black"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
};

export default FloatingStudyNotesWidget;
