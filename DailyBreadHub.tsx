import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  Check,
  Calendar,
  PenTool,
  Shield,
  Heart
} from 'lucide-react';

export interface DailyBreadHubProps {
  onBack?: () => void;
  onNavigateToScripture?: (bookId: string, chapter: number) => void;
  currentUser?: any;
}

export const DailyBreadHub: React.FC<DailyBreadHubProps> = ({
  onBack,
  onNavigateToScripture,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'morning' | 'evening'>('both');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<'morning' | 'evening' | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const morningDevotional = {
    title: 'Morning Manna: The Incorruptible Seed',
    subheading: 'Dawn Consecration & Spiritual Sustenance',
    scriptureRef: 'Matthew 4:4',
    bookId: 'MAT',
    chapter: 4,
    scriptureText:
      'Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.',
    exposition:
      'Before opening social feeds, email inboxes, or facing the turbulence of the world, feed your inner spirit on the living, incorruptible Word of God. Physical bread nourishes temporal flesh, but divine truth imparts eternal endurance, discernment, and strength. The decisions, pressures, and battles you face today will be won or lost in the secret place of morning meditation.',
    prayer:
      'Lord Jesus, You are the true Bread of Life descended from heaven. Align my mind to Your counsel, sanctify my speech, and order my steps in Your righteousness today. Amen.',
    practicalAction: 'Take 5 minutes of stillness before speaking with anyone today. Read Matthew 4 and invite the Holy Spirit to guide your day.'
  };

  const eveningDevotional = {
    title: 'Evening Solace: Abiding in Perfect Rest',
    subheading: 'Twilight Peace & Safe Dwelling',
    scriptureRef: 'Psalm 4:8',
    bookId: 'PSA',
    chapter: 4,
    scriptureText:
      'I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.',
    exposition:
      'As twilight settles over the city, the soul often carries the residual anxieties, unfinished to-do lists, and spiritual skirmishes of the daylight hours. Evening solace in Christ is not passive escapism, but active surrender into the hands of the One who neither slumbers nor sleeps. Lay down the heavy yoke of self-striving and rest secure beneath the wings of the Almighty.',
    prayer:
      'Father, I release every unfinished task and every burden of this day into Your sovereign keeping. Wash away weariness with Your presence, cover my sleep with angel watches, and awaken me with praise on my lips. In Jesus’ holy name. Amen.',
    practicalAction: 'Surrender today’s anxieties in written prayer. Disconnect devices 30 minutes before sleep and meditate on Psalm 4.'
  };

  const handleSpeak = (type: 'morning' | 'evening') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio && currentlySpeaking === type) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentlySpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const item = type === 'morning' ? morningDevotional : eveningDevotional;
    const textToSpeak = `${item.title}. Scripture reading: ${item.scriptureRef}. ${item.scriptureText}. Reflection: ${item.exposition}. Prayer: ${item.prayer}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setCurrentlySpeaking(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentlySpeaking(null);
    };

    setCurrentlySpeaking(type);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (key: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {}
  };

  const handleOpenStudyNote = (item: typeof morningDevotional) => {
    window.dispatchEvent(
      new CustomEvent('yf_open_notes_hud', {
        detail: {
          passage: `${item.scriptureRef}`,
          title: `${item.title} Revelation`,
          book: item.scriptureRef.split(' ')[0],
          chapter: item.chapter
        }
      })
    );
  };

  return (
    <div className="space-y-6 pb-20 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/15 text-slate-200 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              title="Return to Fellowship Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                Spiritual Sustenance &bull; Twice Daily
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                Manna & Solace
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] uppercase text-white tracking-wide">
              Daily Bread Hub
            </h3>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#000000] border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'both'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Devotionals
          </button>
          <button
            onClick={() => setActiveTab('morning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'morning'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Morning Manna</span>
          </button>
          <button
            onClick={() => setActiveTab('evening')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'evening'
                ? 'bg-indigo-600 text-white font-black shadow-md'
                : 'text-indigo-400/80 hover:text-indigo-300'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Evening Solace</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Morning Manna & Evening Solace */}
      <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
        
        {/* CARD 1: MORNING MANNA */}
        {(activeTab === 'both' || activeTab === 'morning') && (
          <div className="flex flex-col justify-between p-6 sm:p-7 bg-gradient-to-br from-[#0B1A3A]/90 via-[#0a0a0a] to-[#040817] border-2 border-amber-500/40 rounded-3xl space-y-5 shadow-[0_12px_36px_rgba(245,158,11,0.15)] relative overflow-hidden group">
            {/* Top Amber Radiant Glow Accent */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Badge & Audio trigger */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                      {morningDevotional.subheading}
                    </span>
                    <h4 className="text-base font-black font-['Outfit'] uppercase text-white">
                      {morningDevotional.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSpeak('morning')}
                    className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isPlayingAudio && currentlySpeaking === 'morning'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white/5 border-white/10 text-amber-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Listen to Morning Manna Read Aloud"
                  >
                    {isPlayingAudio && currentlySpeaking === 'morning' ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span className="hidden sm:inline">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Audio</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy('morning', `${morningDevotional.title}\n\n"${morningDevotional.scriptureText}" — ${morningDevotional.scriptureRef}\n\n${morningDevotional.exposition}\n\nPrayer: ${morningDevotional.prayer}`)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Copy Devotional"
                  >
                    {copiedKey === 'morning' ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Scripture Quote Box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                  <span>KEY SCRIPTURE</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                    {morningDevotional.scriptureRef}
                  </span>
                </div>
                <blockquote className="text-base sm:text-lg font-serif italic text-white leading-relaxed">
                  "{morningDevotional.scriptureText}"
                </blockquote>
              </div>

              {/* Exposition Body */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Apostolic Reflection:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">
                  {morningDevotional.exposition}
                </p>
              </div>

              {/* Consecration Prayer */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <Heart className="w-3 h-3" />
                  Morning Consecration Prayer:
                </span>
                <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
                  "{morningDevotional.prayer}"
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
              <button
                onClick={() => onNavigateToScripture?.(morningDevotional.bookId, morningDevotional.chapter)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read in 66-Book Bible &rarr;</span>
              </button>

              <button
                onClick={() => handleOpenStudyNote(morningDevotional)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Journal notes on this passage"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Journal Notes</span>
              </button>
            </div>
          </div>
        )}

        {/* CARD 2: EVENING SOLACE */}
        {(activeTab === 'both' || activeTab === 'evening') && (
          <div className="flex flex-col justify-between p-6 sm:p-7 bg-gradient-to-br from-[#12133D]/90 via-[#0a0a0a] to-[#040817] border-2 border-indigo-500/40 rounded-3xl space-y-5 shadow-[0_12px_36px_rgba(99,102,241,0.18)] relative overflow-hidden group">
            {/* Top Indigo Radiant Glow Accent */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Badge & Audio trigger */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                      {eveningDevotional.subheading}
                    </span>
                    <h4 className="text-base font-black font-['Outfit'] uppercase text-white">
                      {eveningDevotional.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSpeak('evening')}
                    className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isPlayingAudio && currentlySpeaking === 'evening'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40'
                        : 'bg-white/5 border-white/10 text-indigo-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Listen to Evening Solace Read Aloud"
                  >
                    {isPlayingAudio && currentlySpeaking === 'evening' ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span className="hidden sm:inline">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Audio</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy('evening', `${eveningDevotional.title}\n\n"${eveningDevotional.scriptureText}" — ${eveningDevotional.scriptureRef}\n\n${eveningDevotional.exposition}\n\nPrayer: ${eveningDevotional.prayer}`)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Copy Devotional"
                  >
                    {copiedKey === 'evening' ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Scripture Quote Box */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-300">
                  <span>KEY SCRIPTURE</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40">
                    {eveningDevotional.scriptureRef}
                  </span>
                </div>
                <blockquote className="text-base sm:text-lg font-serif italic text-white leading-relaxed">
                  "{eveningDevotional.scriptureText}"
                </blockquote>
              </div>

              {/* Exposition Body */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Night Watch Meditation:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">
                  {eveningDevotional.exposition}
                </p>
              </div>

              {/* Twilight Rest Prayer */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Twilight Surrender & Safe Rest:
                </span>
                <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
                  "{eveningDevotional.prayer}"
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
              <button
                onClick={() => onNavigateToScripture?.(eveningDevotional.bookId, eveningDevotional.chapter)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs font-mono flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read in 66-Book Bible &rarr;</span>
              </button>

              <button
                onClick={() => handleOpenStudyNote(eveningDevotional)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 border border-indigo-500/30 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Journal notes on this passage"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Journal Notes</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
