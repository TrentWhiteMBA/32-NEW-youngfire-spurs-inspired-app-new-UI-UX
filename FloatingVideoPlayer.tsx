import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Maximize2, Minimize2, Move, ExternalLink, Scaling } from 'lucide-react';
import { VideoItem } from './KingdomVideoVault';
import { cleanYouTubeId } from '../data/mediaVaultData';

interface FloatingVideoPlayerProps {
  video: VideoItem | null;
  onClose: () => void;
  onExpand?: () => void;
}

export const FloatingVideoPlayer: React.FC<FloatingVideoPlayerProps> = ({
  video,
  onClose,
  onExpand
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Dynamic Width state: constrained between 160px and 90vw
  const [playerWidth, setPlayerWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(360, Math.max(220, window.innerWidth * 0.85));
    }
    return 320;
  });

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(12, window.innerWidth - 380);
      const defaultY = Math.max(70, window.innerHeight - 320);
      return { x: defaultX, y: defaultY };
    }
    return { x: 20, y: 100 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; initialWidth: number } | null>(null);
  const pinchRef = useRef<{ initialDistance: number; initialWidth: number } | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  // Keep inside screen viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      setPlayerWidth(prev => {
        const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800;
        return Math.max(160, Math.min(maxWidth, prev));
      });
      setPosition(prev => {
        const maxX = Math.max(0, window.innerWidth - playerWidth - 12);
        const maxY = Math.max(0, window.innerHeight - 100);
        return {
          x: Math.min(Math.max(12, prev.x), maxX),
          y: Math.min(Math.max(12, prev.y), maxY)
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [playerWidth]);

  // Pointer Drag Handlers (Header)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag from header handle
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragRef.current) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    const currentWidth = isMinimized ? 220 : playerWidth;
    const currentHeight = isMinimized ? 48 : (playerWidth * (9 / 16) + 70);

    const maxX = Math.max(0, window.innerWidth - currentWidth - 12);
    const maxY = Math.max(0, window.innerHeight - currentHeight - 12);

    const newX = Math.max(8, Math.min(maxX, dragRef.current.initialX + deltaX));
    const newY = Math.max(8, Math.min(maxY, dragRef.current.initialY + deltaY));
    setPosition({ x: newX, y: newY });
  }, [isMinimized, playerWidth]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    dragRef.current = null;
    try {
      (e.target as HTMLElement)?.releasePointerCapture(e.pointerId);
    } catch {}

    // Fluid boundary snapping to viewport edges
    setPosition(prev => {
      const snapThreshold = 40;
      const currentWidth = isMinimized ? 220 : playerWidth;
      const currentHeight = isMinimized ? 48 : (playerWidth * (9 / 16) + 70);
      const rightEdge = window.innerWidth - currentWidth - 12;
      const bottomEdge = window.innerHeight - currentHeight - 12;

      let snappedX = prev.x;
      let snappedY = prev.y;

      if (prev.x < snapThreshold) snappedX = 12;
      else if (Math.abs(prev.x - rightEdge) < snapThreshold) snappedX = rightEdge;

      if (prev.y < snapThreshold) snappedY = 12;
      else if (Math.abs(prev.y - bottomEdge) < snapThreshold) snappedY = bottomEdge;

      return { x: snappedX, y: snappedY };
    });
  }, [isDragging, isMinimized, playerWidth]);

  // Pointer Corner Drag-Resizing (Bottom-Right Handle)
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: playerWidth
    };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleResizePointerMove = useCallback((e: PointerEvent) => {
    if (!resizeRef.current) return;
    const deltaX = e.clientX - resizeRef.current.startX;
    const minWidth = 160;
    const maxWidth = Math.min(window.innerWidth * 0.9, 850);
    const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeRef.current.initialWidth + deltaX));
    setPlayerWidth(newWidth);
  }, []);

  const handleResizePointerUp = useCallback((e: PointerEvent) => {
    if (!isResizing) return;
    setIsResizing(false);
    resizeRef.current = null;
    try {
      (e.target as HTMLElement)?.releasePointerCapture(e.pointerId);
    } catch {}
  }, [isResizing]);

  // Two-Finger Pinch-to-Zoom Gestures (Touch Devices)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const distance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchRef.current = {
        initialDistance: distance,
        initialWidth: playerWidth
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (pinchRef.current.initialDistance > 0) {
        const scale = currentDistance / pinchRef.current.initialDistance;
        const minWidth = 160;
        const maxWidth = Math.min(window.innerWidth * 0.9, 850);
        const newWidth = Math.max(minWidth, Math.min(maxWidth, pinchRef.current.initialWidth * scale));
        setPlayerWidth(newWidth);
      }
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current = null;
  };

  // Global window listeners for drag & resize
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('pointermove', handleResizePointerMove);
      window.addEventListener('pointerup', handleResizePointerUp);
      window.addEventListener('pointercancel', handleResizePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handleResizePointerMove);
      window.removeEventListener('pointerup', handleResizePointerUp);
      window.removeEventListener('pointercancel', handleResizePointerUp);
    };
  }, [isResizing, handleResizePointerMove, handleResizePointerUp]);

  if (!video) return null;

  const rawId = video.youtubeId || (video as any).id || '';
  const cleanId = cleanYouTubeId(rawId);
  const isCompact = playerWidth < 210;

  return (
    <div 
      ref={playerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed top-0 left-0 z-[9999] rounded-2xl overflow-hidden border border-amber-500/60 bg-[#0a0a0a] backdrop-blur-xl touch-none select-none transition-shadow ${
        isMinimized ? 'w-56 sm:w-64' : ''
      }`}
      style={{
        width: isMinimized ? undefined : `${playerWidth}px`,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        boxShadow: isDragging || isResizing
          ? '0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(245, 158, 11, 0.55)'
          : '0 20px 50px rgba(0,0,0,0.85), 0 0 25px rgba(245, 158, 11, 0.35)',
        cursor: isDragging ? 'grabbing' : 'auto',
        willChange: 'transform, width'
      }}
    >
      {/* Draggable Top Header Handle */}
      <div 
        onPointerDown={handlePointerDown}
        className="bg-[#000000] px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between border-b border-white/10 select-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-1.5 truncate pr-2 pointer-events-none">
          <Move className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
          <span className="text-[10px] font-mono font-bold text-amber-300 truncate">
            {video.title}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 pointer-events-auto">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            title={isMinimized ? "Show Video" : "Hide Video Frame"}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/10 cursor-pointer"
              title="Expand to Full TV Screen"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 cursor-pointer"
            title="Close Floating Video"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Video Container (16:9 ratio) */}
      {!isMinimized && cleanId && (
        <div className="relative aspect-video w-full bg-black">
          {/* Transparent overlay while dragging or resizing prevents iframe pointer eating */}
          {(isDragging || isResizing) && <div className="absolute inset-0 z-20 bg-transparent" />}
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${cleanId}?autoplay=1&enablejsapi=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Mini Info Footer with Bottom-Right Corner Drag-Resize Handle */}
      {!isMinimized && (
        <div className="relative px-3 py-1.5 bg-[#000000] flex items-center justify-between text-[10px] font-mono border-t border-white/10 select-none">
          <span className="text-slate-300 truncate font-semibold pr-6">
            {isCompact ? 'BibleProject' : (video.speaker || video.artist || 'Joshua House of Worship')}
          </span>

          {/* Corner Resize Handle */}
          <div
            onPointerDown={handleResizePointerDown}
            className="absolute right-0 bottom-0 w-6 h-6 flex items-end justify-end p-1 text-amber-400/80 hover:text-amber-300 cursor-nwse-resize active:scale-110 transition-transform"
            title="Drag to Resize Video Window (or Pinch to Zoom)"
          >
            <Scaling className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingVideoPlayer;
