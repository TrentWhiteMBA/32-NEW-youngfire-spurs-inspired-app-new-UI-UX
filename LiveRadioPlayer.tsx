import React from 'react';
import { Radio, ArrowLeft, Play, Pause, Volume2, Sparkles, Flame, Wifi, Activity } from 'lucide-react';
import { GOSPEL_STATIONS, RadioStation } from '../data/radioStations';
import { AppTheme } from '../data/appThemes';

interface LiveRadioPlayerProps {
  onBack?: () => void;
  activeStationId?: string;
  isPlaying?: boolean;
  onSelectStation?: (s: RadioStation) => void;
  onTogglePlay?: () => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
  activeTheme?: AppTheme;
  [key: string]: any;
}

export const LiveRadioPlayer: React.FC<LiveRadioPlayerProps> = ({
  onBack,
  activeStationId,
  isPlaying,
  onSelectStation,
  onTogglePlay,
  volume = 1,
  onVolumeChange,
  activeTheme
}) => {
  const accentColor = activeTheme?.accentHex || '#F59E0B';
  const currentStation = GOSPEL_STATIONS.find(s => s.id === activeStationId) || GOSPEL_STATIONS[0];

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-5 text-white select-none animate-fadeIn font-['Outfit']">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Return to Sanctuary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Outfit'] font-black text-lg sm:text-xl tracking-wider uppercase text-white flex items-center gap-2">
                <Radio className="w-5 h-5" style={{ color: accentColor }} />
                24/7 GOSPEL RADIO ECOSYSTEM
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                8 STATIONS LIVE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Continuous Worship, Prophetic Intercession & Kingdom Anthems
            </p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold uppercase">BROADCAST ACTIVE</span>
        </div>
      </div>

      {/* Featured Current Station Billboard */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#000000] to-black border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                NOW TUNED &bull; {currentStation.genre}
              </span>
            </div>
            <h3 className="font-['Outfit'] font-black text-xl sm:text-2xl text-white tracking-wide">
              {currentStation.name}
            </h3>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed font-serif">
              {currentStation.description}
            </p>
          </div>

          {/* Master Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-black shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 25px ${accentColor}40`
            }}
            title={isPlaying ? "Pause Stream" : "Play Stream"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Volume & Audio Quality Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2.5 flex-1 max-w-xs">
            <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-white/20"
            />
            <span className="font-mono text-amber-400 text-[11px] font-bold w-9 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>320kbps Sacred Audio</span>
            </span>
            <span>&bull;</span>
            <span className="text-slate-300">{currentStation.location || 'San Antonio, TX'}</span>
          </div>
        </div>
      </div>

      {/* 8 Curated Radio Stations Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            All 8 Curated Sanctuary Streams
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Tap to tune instantly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {GOSPEL_STATIONS.map((station, idx) => {
            const isCurrent = station.id === (activeStationId || currentStation.id);
            return (
              <div
                key={station.id}
                onClick={() => onSelectStation && onSelectStation(station)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : 'bg-[#000000] border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs flex-shrink-0 transition-transform ${
                      isCurrent ? 'scale-105 shadow-md' : 'bg-white/5 text-slate-400'
                    }`}
                    style={isCurrent ? { backgroundColor: accentColor, color: '#000000' } : {}}
                  >
                    0{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate font-['Outfit']">
                      {station.name}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400 block truncate">
                      {station.genre}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 block truncate">
                      {station.location}
                    </span>
                  </div>
                </div>

                {/* Status indicator / Play state */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isCurrent && isPlaying && (
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-amber-400 h-3 animate-pulse rounded-full" />
                      <span className="w-1 bg-amber-400 h-4 animate-bounce rounded-full" />
                      <span className="w-1 bg-amber-400 h-2 animate-pulse rounded-full" />
                    </div>
                  )}
                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[9px] font-black uppercase border border-amber-500/30">
                      ON AIR
                    </span>
                  ) : (
                    <Play className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default LiveRadioPlayer;
