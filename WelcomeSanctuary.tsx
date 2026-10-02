import React from 'react';
import { 
  Flame, ArrowRight, UserPlus, LogIn, Compass, 
  X, Sparkles, MapPin, Calendar, BookOpen, Radio,
  Globe, Youtube, Facebook, ExternalLink
} from 'lucide-react';
import { AppTheme } from '../data/appThemes';

interface WelcomeSanctuaryProps {
  onEnterSanctuary?: () => void;
  onRegister?: () => void;
  onSignIn?: () => void;
  onExploreGuest?: () => void;
  onClose?: () => void;
  isAuthenticated?: boolean;
  onOpenRoster?: () => void;
  onToggleRadio?: () => void;
  isRadioPlaying?: boolean;
  onOpenThemeModal?: () => void;
  activeTheme?: AppTheme;
  [key: string]: any;
}

export const WelcomeSanctuary: React.FC<WelcomeSanctuaryProps> = ({
  onEnterSanctuary,
  onRegister,
  onSignIn,
  onExploreGuest,
  onClose,
  isAuthenticated = false,
  activeTheme
}) => {
  const accentColor = activeTheme?.accentHex || '#F59E0B';
  const smallGroupLocation = typeof window !== 'undefined'
    ? localStorage.getItem('youngfire_small_group_location') || "The White's Residence"
    : "The White's Residence";

  const handleRegisterClick = () => {
    if (onRegister) onRegister();
    else if (onEnterSanctuary) onEnterSanctuary();
  };

  const handleSignInClick = () => {
    if (onSignIn) onSignIn();
    else if (onEnterSanctuary) onEnterSanctuary();
  };

  const handleExploreGuestClick = () => {
    if (onExploreGuest) onExploreGuest();
    else if (onEnterSanctuary) onEnterSanctuary();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#000000] text-white flex flex-col items-center select-none font-['Outfit']">
      
      {/* 1. San Antonio Street Map Backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center mix-blend-luminosity scale-105"
        style={{ backgroundImage: `url('/san_antonio_dark_map.png')` }}
      />

      {/* 2. Pure Obsidian Vertical Radial Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#000000]/40 via-[#000000]/80 to-[#000000]" />

      {/* Main Sanctuary Card Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
        
        {/* Close Button (if modal overlay) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-black/60 hover:bg-black/90 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer z-30"
            title="Close Welcome Sanctuary"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 3. Top Hero Photo adjusted lower to display all faces fully */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black group">
          <img
            src="/welcome_sanctuary_cover.jpg"
            alt="YoungFire Sanctuary Fellowship Family"
            className="w-full h-full object-cover filter brightness-100 contrast-105 transition-transform duration-700 group-hover:scale-102"
            style={{
              objectPosition: 'center 22%'
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/yf_easter_church_family.jpg';
            }}
          />

          {/* Smooth dissolving scrim designed to preserve facial clarity at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

          {/* Top Pill Insignia inside Hero */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/30 shadow-lg">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-500 animate-pulse" />
            <span className="font-['Outfit'] font-black text-[10px] tracking-[0.2em] text-white uppercase">
              YOUNGFIRE SANCTUARY &bull; EST. 2015
            </span>
          </div>

          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>All Saints Fellowship</span>
          </div>
        </div>

        {/* 4. Brand Heading & Facilitators Proclamation */}
        <div className="w-full text-center space-y-3 -mt-6 sm:-mt-8 relative z-20 px-2">
          
          {/* Flame Center Crest */}
          <div 
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.5)] border border-amber-400/50"
            style={{ 
              backgroundColor: '#000000',
              boxShadow: `0 0 30px ${accentColor}40`
            }}
          >
            <div 
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: accentColor }}
            >
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-black fill-current drop-shadow" />
            </div>
          </div>

          <div>
            <h1 className="font-['Outfit'] text-2xl sm:text-3xl tracking-[0.2em] uppercase text-white font-black drop-shadow-md">
              YOUNG<span style={{ color: accentColor }}>FIRE</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-[0.16em] uppercase text-slate-300 font-bold mt-0.5">
              JOSHUA HOUSE OF WORSHIP &bull; SAN ANTONIO, TX &bull; EST. 2015
            </p>
          </div>

          {/* ANNUAL THEME PROCLAMATION */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/35 shadow-xl max-w-lg mx-auto">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold block mb-1">
              ANNUAL THEME PROCLAMATION &bull; LEADERSHIP
            </span>
            <p className="font-['Outfit'] text-sm sm:text-base font-black text-white tracking-wide leading-snug">
              Rebuilding Better Together (Ephesians 4:16) &bull; Lead Facilitators Trent D. White &amp; Whitney White
            </p>
          </div>

          {/* Gathering Quick Notice */}
          <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Small Groups: <strong className="text-amber-200">{smallGroupLocation}</strong> (Bi-Weekly Mondays @ 7:00 PM CST)</span>
          </div>
        </div>

        {/* 5. DIRECT ACTION BUTTONS */}
        <div className="w-full max-w-md space-y-3 mt-6">
          
          {/* Button 1: Register New Disciple Profile */}
          <button
            onClick={handleRegisterClick}
            className="w-full py-3.5 px-6 rounded-2xl text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-xl shadow-amber-500/25 group"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #EA580C)`
            }}
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Register New Disciple Profile &rarr;</span>
          </button>

          {/* Button 2: Sign In to Existing Account */}
          <button
            onClick={handleSignInClick}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#090D18] hover:bg-[#101726] border border-amber-500/30 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:border-amber-400 active:scale-98 transition-all cursor-pointer shadow-lg"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>Sign In to Existing Account</span>
          </button>

          {/* Button 3: Explore as Guest */}
          <button
            onClick={handleExploreGuestClick}
            className="w-full py-3 px-6 rounded-2xl bg-black/50 hover:bg-black/90 border border-white/15 text-slate-300 hover:text-white font-mono text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Explore as Guest</span>
          </button>

        </div>

        {/* 6. JHOW OFFICIAL SOCIAL & WEB PORTAL (NEW MANDATE) */}
        <div className="w-full max-w-md mt-6 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-[11px] font-mono tracking-wider uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              Joshua House of Worship Online
            </span>
            <span className="text-[10px] font-mono text-slate-400">San Antonio, TX</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Website Link */}
            <a
              href="https://joshuahouseofworship.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/50 flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer"
              title="Official Church Website"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white group-hover:text-amber-300">Church Website</span>
              <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                jhow.org <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </a>

            {/* YouTube Link */}
            <a
              href="https://www.youtube.com/@JoshuaHouseOfWorshipSanAntonio/featured"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-400/50 flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer"
              title="Official YouTube Broadcasts"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Youtube className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white group-hover:text-red-300">YouTube</span>
              <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                Livestreams <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </a>

            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/JoshuaHouseofWorshipSanAntonio/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/50 flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer"
              title="Official Facebook Page"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white group-hover:text-amber-300">Facebook</span>
              <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                Sanctuary <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </a>
          </div>
        </div>

        {/* 7. Sanctuary Highlights Footer (Preserving Gold & Silver Disciplined Palette) */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-md mt-6 pt-5 border-t border-white/10 text-center">
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
            <BookOpen className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <span className="text-[10px] font-mono text-slate-200 block font-bold">66-BOOK CANON</span>
            <span className="text-[9px] font-mono text-slate-400">Physical Bible Tracker</span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
            <Radio className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <span className="text-[10px] font-mono text-slate-200 block font-bold">24/7 GOSPEL AUDIO</span>
            <span className="text-[9px] font-mono text-slate-400">8 Curated Streams</span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
            <Calendar className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <span className="text-[10px] font-mono text-slate-200 block font-bold">FELLOWSHIP</span>
            <span className="text-[9px] font-mono text-slate-400">In-Person &amp; Zoom</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WelcomeSanctuary;
