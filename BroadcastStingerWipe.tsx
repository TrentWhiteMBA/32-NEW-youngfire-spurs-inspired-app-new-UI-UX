import React, { useEffect, useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { AppTheme } from '../data/appThemes';

interface BroadcastStingerWipeProps {
  show: boolean;
  onComplete: () => void;
  onMidpoint?: () => void;
  durationMs?: number;
  activeTheme?: AppTheme;
  destinationLabel?: string;
}

export const BroadcastStingerWipe: React.FC<BroadcastStingerWipeProps> = ({
  show,
  onComplete,
  onMidpoint,
  durationMs = 2600, // Stays on screen for ~2.6 seconds as requested
  activeTheme,
  destinationLabel = 'SANCTUARY'
}) => {
  const [phase, setPhase] = useState<'enter' | 'solid' | 'exit'>('enter');

  const accentColor = activeTheme?.accentHex || '#F59E0B';
  const secondaryColor = activeTheme?.secondaryHex || '#EF4444';
  const tertiaryColor = activeTheme?.tertiaryHex || '#FF8200';

  useEffect(() => {
    if (!show) {
      setPhase('enter');
      return;
    }

    setPhase('enter');

    // 1. Move to solid phase after enter transition
    const solidTimer = setTimeout(() => {
      setPhase('solid');
    }, 350);

    // 2. Midpoint callback to switch underlying tab halfway
    const midTimer = setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, durationMs * 0.45);

    // 3. Move to exit phase
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, durationMs - 450);

    // 4. Complete wipe and hide
    const completeTimer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(solidTimer);
      clearTimeout(midTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [show, durationMs, onComplete, onMidpoint]);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[160] flex items-center justify-center select-none overflow-hidden transition-all duration-500 ease-out ${
        phase === 'enter' 
          ? 'opacity-0 scale-105' 
          : phase === 'exit' 
          ? 'opacity-0 scale-95 pointer-events-none' 
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: `radial-gradient(circle at 50% 50%, #0d0a06 0%, #000000 85%)`
      }}
    >
      {/* Dynamic Animated Radiant Theme Glows */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none animate-pulse"
        style={{ backgroundColor: `${accentColor}35` }}
      />
      <div 
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: `${secondaryColor}30` }}
      />
      <div 
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: `${tertiaryColor}30` }}
      />

      {/* Central Emblem & Brand Animation */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        
        {/* Consecrated Flame Medallion */}
        <div 
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-black/90 border-2 flex items-center justify-center shadow-2xl relative group transform animate-[bounce_2s_infinite]"
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 50px ${accentColor}60`
          }}
        >
          <div 
            className="absolute inset-0 rounded-3xl opacity-20 animate-ping"
            style={{ backgroundColor: accentColor }}
          />
          <Flame 
            className="w-14 h-14 sm:w-16 sm:h-16 fill-current filter drop-shadow-lg" 
            style={{ color: accentColor }}
          />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-2xl sm:text-3xl font-black uppercase tracking-[0.28em] text-white font-['Anton',sans-serif] drop-shadow-md">
            YOUNG<span style={{ color: accentColor }}>FIRE</span>
          </span>
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-slate-300 uppercase">
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>TRANSITIONING TO {destinationLabel}</span>
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
          </div>
        </div>

        {/* Dynamic 3-Stripe Fiesta / Theme Accent Bar */}
        <div className="w-48 sm:w-64 flex flex-col gap-1 my-2">
          <div className="w-full h-1 rounded-full shadow-sm" style={{ backgroundColor: accentColor }} />
          <div className="w-full h-1 rounded-full shadow-sm" style={{ backgroundColor: secondaryColor }} />
          <div className="w-full h-1 rounded-full shadow-sm" style={{ backgroundColor: tertiaryColor }} />
        </div>

        {/* Subtitle */}
        <p className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">
          Joshua House of Worship &bull; San Antonio, TX
        </p>

      </div>
    </div>
  );
};

export default BroadcastStingerWipe;
