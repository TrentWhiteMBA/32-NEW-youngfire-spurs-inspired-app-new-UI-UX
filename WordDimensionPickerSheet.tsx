import React, { useState } from 'react';
import { MapPin, BookOpen, Compass, ChevronUp, Sparkles, X } from 'lucide-react';
import { AppTheme } from '../data/appThemes';

interface WordDimensionPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDimension: (dimension: 'atlas' | 'bible') => void;
  activeTheme?: AppTheme;
}

export const WordDimensionPickerSheet: React.FC<WordDimensionPickerSheetProps> = ({
  isOpen,
  onClose,
  onSelectDimension,
  activeTheme
}) => {
  const [isExpandingToFull, setIsExpandingToFull] = useState<boolean>(false);
  const [selectedDim, setSelectedDim] = useState<'atlas' | 'bible' | null>(null);

  if (!isOpen) return null;

  const accentColor = activeTheme?.accentHex || '#F59E0B';
  const borderColor = activeTheme?.borderHex || `${accentColor}70`;

  const handleChoose = (dim: 'atlas' | 'bible') => {
    setSelectedDim(dim);
    // Smoothly animate sliding all the way up to full screen, then trigger callback
    setIsExpandingToFull(true);
    setTimeout(() => {
      onSelectDimension(dim);
      setIsExpandingToFull(false);
      setSelectedDim(null);
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl bg-[#070B18] border-t-2 border-x-2 rounded-t-[36px] shadow-[-20px_0_60px_rgba(0,0,0,0.95)] p-5 sm:p-7 text-white flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpandingToFull 
            ? 'h-screen max-h-screen rounded-none' 
            : 'h-[54vh] max-h-[58vh]'
        }`}
        style={{
          borderColor: borderColor,
          boxShadow: `0 -10px 40px ${accentColor}25`
        }}
      >
        {/* Top Drag Handle & Title */}
        <div>
          <div className="flex justify-center mb-3">
            <div className="w-12 h-1.5 rounded-full bg-white/20" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <h3 className="font-['Outfit'] font-black text-base sm:text-lg uppercase tracking-wider text-white">
                SELECT WORD DIMENSION
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 font-mono tracking-wide mb-5">
            Choose how you want to experience the 66-Book Scripture Canon:
          </p>

          {/* Dual Dimension Cards: Imperial Atlas vs 66-Book Bible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. IMPERIAL SCRIPTURE ATLAS */}
            <button
              onClick={() => handleChoose('atlas')}
              className={`p-4 rounded-2xl bg-black/90 border text-left transition-all cursor-pointer group hover:scale-[1.02] active:scale-98 relative overflow-hidden ${
                selectedDim === 'atlas' ? 'ring-2' : ''
              }`}
              style={{
                borderColor: selectedDim === 'atlas' ? accentColor : 'rgba(255,255,255,0.18)',
                boxShadow: `0 4px 20px ${accentColor}15`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                >
                  <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-white/20 text-slate-300 font-bold">
                  Interactive Maps
                </span>
              </div>
              <h4 className="font-['Outfit'] font-black text-sm tracking-wider uppercase text-white mb-1 group-hover:text-amber-300 transition-colors">
                IMPERIAL SCRIPTURE ATLAS
              </h4>
              <p className="text-[11px] text-slate-400 leading-tight">
                66-book interactive cartography, geographical pins &amp; historical journey timelines.
              </p>
            </button>

            {/* 2. 66-BOOK SCRIPTURE READER */}
            <button
              onClick={() => handleChoose('bible')}
              className={`p-4 rounded-2xl bg-black/90 border text-left transition-all cursor-pointer group hover:scale-[1.02] active:scale-98 relative overflow-hidden ${
                selectedDim === 'bible' ? 'ring-2' : ''
              }`}
              style={{
                borderColor: selectedDim === 'bible' ? accentColor : 'rgba(255,255,255,0.18)',
                boxShadow: `0 4px 20px ${accentColor}15`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                >
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-white/20 text-slate-300 font-bold">
                  Expository Text
                </span>
              </div>
              <h4 className="font-['Outfit'] font-black text-sm tracking-wider uppercase text-white mb-1 group-hover:text-amber-300 transition-colors">
                66-BOOK SCRIPTURE READER
              </h4>
              <p className="text-[11px] text-slate-400 leading-tight">
                Consecrated chapter reading, verse highlights, commentary &amp; study revelations.
              </p>
            </button>

          </div>
        </div>

        {/* Footer indicator showing full-screen slide */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 pt-3">
          <ChevronUp className="w-4 h-4 animate-bounce" style={{ color: accentColor }} />
          <span>Tap either dimension to expand to full screen</span>
        </div>
      </div>
    </div>
  );
};

export default WordDimensionPickerSheet;
