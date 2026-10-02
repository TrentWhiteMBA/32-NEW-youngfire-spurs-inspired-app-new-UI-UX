import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { SCRIPTURE_66_BOOKS, ScriptureCircleBook, getBibleProjectUrl } from '../data/bibleProjectVideos';
import { AppTheme } from '../data/appThemes';

interface ScriptureCirclesRailProps {
  onSelectBook?: (bookName: string, chapter: number) => void;
  activeTheme?: AppTheme;
  className?: string;
}

export const ScriptureCirclesRail: React.FC<ScriptureCirclesRailProps> = ({
  onSelectBook,
  activeTheme,
  className = ''
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const accentColor = activeTheme?.accentHex || '#FFFFFF';
  const borderColor = activeTheme?.borderHex || `${accentColor}70`;

  const handleCircleClick = (book: ScriptureCircleBook, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const youtubeUrl = getBibleProjectUrl(book);

    // 1. Dispatch global event to trigger video playback in persistent PiP window
    window.dispatchEvent(new CustomEvent('yf_play_video', {
      detail: {
        video: {
          id: `bp_${book.id}`,
          title: `${book.name} Overview • The Bible Project`,
          speaker: 'The Bible Project',
          series: '66-Book Scripture Canon Overview',
          duration: '7:30',
          youtubeId: book.bibleProjectVideoId,
          dateAdded: '2026',
          description: `Official Bible Project video overview exploring the literary design, themes, and biblical theology of the book of ${book.name}.`,
          category: 'Bible Project Overview',
          thumbnailUrl: `https://img.youtube.com/vi/${book.bibleProjectVideoId}/hqdefault.jpg`,
          scriptureReferences: [`${book.name} 1:1`],
          streamUrl: youtubeUrl
        }
      }
    }));

    // 2. Parent callback (optional navigation to chapter 1 if provided, without switching to tv tab)
    if (onSelectBook) {
      onSelectBook(book.name, 1);
    }
  };

  const handleImageError = (bookId: string) => {
    setImageErrors(prev => ({ ...prev, [bookId]: true }));
  };

  return (
    <div className={`w-full select-none ${className}`}>
      {/* 
        NO title or header text above the 66-circle rail.
        The canon sits borderless and integrated directly beneath the style toggle.
      */}
      <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-3.5 px-4 py-2 scroll-smooth">
        {SCRIPTURE_66_BOOKS.map((book) => {
          const hasImageError = imageErrors[book.id];
          const thumbnailUrl = `https://img.youtube.com/vi/${book.bibleProjectVideoId}/mqdefault.jpg`;

          return (
            <div
              key={book.id}
              onClick={(e) => handleCircleClick(book, e)}
              className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
              title={`${book.name} • Tap to Watch The Bible Project Overview`}
            >
              {/* Circular Frame with Diagonal Split */}
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full relative overflow-hidden shadow-xl flex-shrink-0 group-hover:scale-105 group-active:scale-95 transition-all duration-200 border"
                style={{
                  borderColor: borderColor,
                  boxShadow: `0 4px 18px ${accentColor}25`
                }}
              >
                {/* 1. TOP-LEFT HALF (YoungFire Holy Flame on pure obsidian black) */}
                <div 
                  className="absolute inset-0 bg-[#000000] flex items-start justify-start p-2"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                  }}
                >
                  <div className="transform -translate-x-0.5 -translate-y-0.5">
                    <Flame 
                      className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-500/80 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] group-hover:scale-110 transition-transform" 
                    />
                  </div>
                </div>

                {/* 2. BOTTOM-RIGHT HALF (The Bible Project Character / Book Theme Art) */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${book.colorGradient} overflow-hidden`}
                  style={{
                    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                  }}
                >
                  {!hasImageError ? (
                    <img
                      src={thumbnailUrl}
                      alt={book.name}
                      onError={() => handleImageError(book.id)}
                      className="w-full h-full object-cover object-center filter brightness-95 contrast-110 group-hover:scale-115 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-end justify-end p-1.5 text-white/80 font-black text-[10px] uppercase font-mono tracking-tighter">
                      {book.shortCode}
                    </div>
                  )}
                </div>

                {/* 3. CRISP 1.5PX DIAGONAL WHITE LASER LINE */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="w-[145%] h-[1.5px] bg-white transform -rotate-45 shadow-[0_0_5px_rgba(255,255,255,0.9)]" />
                </div>
              </div>

              {/* Bold Condensed Monospace Sub-Label: e.g. YF @ GEN */}
              <span className="font-mono text-[9px] sm:text-[10px] text-slate-300 group-hover:text-white font-bold uppercase tracking-wider text-center mt-1.5 transition-colors">
                YF @ {book.shortCode}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScriptureCirclesRail;
