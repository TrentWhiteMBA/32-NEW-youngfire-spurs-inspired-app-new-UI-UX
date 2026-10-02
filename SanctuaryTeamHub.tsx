import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Shield, Flame, Search, ChevronLeft, ChevronRight, 
  Sparkles, CheckCircle2, Award, Calendar, BookOpen, Heart, 
  MapPin, Clock, ArrowUpRight, Share2, Filter, X
} from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';
import { AppTheme } from '../data/appThemes';
import { SanAntonioVectorMap } from './SanAntonioVectorMap';

interface SanctuaryTeamHubProps {
  currentUser?: CurrentUser | null;
  activeTheme?: AppTheme;
  onNavigateToScripture?: (bookId: string, chapter: number, verse?: number) => void;
  onNavigate?: (tab: string) => void;
  onOpenRosterModal?: () => void;
  [key: string]: any;
}

export interface TeamMember {
  id: string;
  name: string;
  displayName: string;
  jerseyNumber: string;
  heightWeight: string;
  role: string;
  positionCode: 'L' | 'F' | 'M' | 'I' | 'B' | 'S'; // L = Lead Overseer, F = Facilitator, M = Media, I = Intercessor, B = Brother, S = Sister
  badgeLabel: string;
  calling: string;
  scriptureAnchor: string;
  cutoutImage: string;
  headshotImage: string;
  outlineColor: string; // Vibrant single-person body contour outline stroke
  streakDays: number;
  chaptersRead: number;
  prayerWatches: number;
  smallGroupAttendance: string;
  residence: string;
  bio: string;
  isRegistered?: boolean;
}

// ONLY TRENT AND WHITNEY WHITE EXIST INITIALLY (ALL MOCK NAMES PERMANENTLY REMOVED)
export const CANONICAL_LEADERSHIP: TeamMember[] = [
  {
    id: 'trent_white',
    name: 'Trent D. White',
    displayName: 'TRENT D. WHITE',
    jerseyNumber: '#1',
    heightWeight: '6\' 2", 205 lbs.',
    role: 'Lead Facilitator & Sanctuary Overseer',
    positionCode: 'L',
    badgeLabel: 'LEAD OVERSEER',
    calling: 'Sanctuary Leadership, Vision & Discipleship Exegesis',
    scriptureAnchor: 'Romans 12:1-2',
    cutoutImage: '/image_4.png',
    headshotImage: '/image_4.png',
    outlineColor: '#F59E0B', // Flame Gold body contour outline
    streakDays: 0,
    chaptersRead: 0,
    prayerWatches: 0,
    smallGroupAttendance: "0 Check-Ins (The White's Residence)",
    residence: 'San Antonio, TX (EST. 2015)',
    bio: 'Lead Facilitator stewarding the YoungFire movement at Joshua House of Worship since 2015. Guiding disciples through holiness, biblical literacy, and bold faith.'
  },
  {
    id: 'whitney_white',
    name: 'Whitney White',
    displayName: 'WHITNEY WHITE',
    jerseyNumber: '#2',
    heightWeight: 'Co-Facilitator',
    role: 'Lead Facilitator & Sisterhood Overseer',
    positionCode: 'L',
    badgeLabel: 'LEAD OVERSEER',
    calling: 'Sisterhood Guidance, Intercession & Sanctuary Administration',
    scriptureAnchor: 'Proverbs 31:25-26',
    cutoutImage: '/image_2.png',
    headshotImage: '/image_2.png',
    outlineColor: '#EC4899', // Electric Rose / Pink body contour outline
    streakDays: 0,
    chaptersRead: 0,
    prayerWatches: 0,
    smallGroupAttendance: "0 Check-Ins (The White's Residence)",
    residence: 'San Antonio, TX (EST. 2015)',
    bio: 'Cultivating authentic sisterhood and spiritual depth across YoungFire young women. Co-hosting bi-weekly small groups with spiritual discernment and fervent prayer.'
  }
];

export const SanctuaryTeamHub: React.FC<SanctuaryTeamHubProps> = ({
  currentUser,
  activeTheme,
  onNavigateToScripture,
  onNavigate,
  onOpenRosterModal
}) => {
  const accentColor = activeTheme?.accentHex || '#F59E0B';
  const secondaryColor = activeTheme?.secondaryHex || '#EA580C';

  // 3-Way Segmented Control: [ ROSTER ] | [ FAITHFULNESS ] | [ STATS ]
  const [activeSegment, setActiveSegment] = useState<'roster' | 'faithfulness' | 'stats'>('roster');

  // Dynamic Roster: Canonical Trent & Whitney + Newly Registered Members from LocalStorage
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('youngfire_member_roster_v2');
      const list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) return CANONICAL_LEADERSHIP;

      // Filter out Trent / Whitney duplicates
      const newMembers = list.filter((m: any) => {
        const id = (m.id || '').toLowerCase();
        const email = (m.email || '').toLowerCase();
        const name = (m.fullName || m.name || '').toLowerCase();
        return !id.includes('trent') && !id.includes('whitney') &&
               !email.includes('trent') && !email.includes('whitney') &&
               !name.includes('trent') && !name.includes('whitney');
      }).map((m: any, idx: number): TeamMember => {
        const isMale = m.gender === 'male';
        return {
          id: m.id || `registered-${idx}`,
          name: m.fullName || m.name || 'Consecrated Disciple',
          displayName: (m.fullName || m.name || 'DISCIPLE').toUpperCase(),
          jerseyNumber: m.jerseyNumber || `#${idx + 3}`,
          heightWeight: m.heightWeight || (isMale ? "Brother" : "Sister"),
          role: m.role || 'YoungFire Consecrated Disciple',
          positionCode: m.positionCode || (isMale ? 'B' : 'S'),
          badgeLabel: m.badgeLabel || (isMale ? 'BROTHER' : 'SISTER'),
          calling: m.calling || 'Word Discipleship & Sanctuary Assembly',
          scriptureAnchor: m.scriptureAnchor || 'Romans 12:1-2',
          cutoutImage: m.avatar || '/welcome_sanctuary_cover.jpg',
          headshotImage: m.avatar || '/welcome_sanctuary_cover.jpg',
          outlineColor: m.outlineColor || (isMale ? '#06B6D4' : '#14B8A6'),
          streakDays: m.streakDays || 0,
          chaptersRead: m.chaptersRead || 0,
          prayerWatches: m.prayerWatches || 0,
          smallGroupAttendance: m.smallGroupAttendance || "0 Check-Ins (The White's Residence)",
          residence: m.residence || 'San Antonio, TX',
          bio: m.bio || 'Faithful consecrated disciple growing in the word and assembly at Joshua House of Worship.',
          isRegistered: true
        };
      });

      return [...CANONICAL_LEADERSHIP, ...newMembers];
    } catch {
      return CANONICAL_LEADERSHIP;
    }
  });

  // Listen for registered members updates
  useEffect(() => {
    const handleRosterUpdate = () => {
      try {
        const saved = localStorage.getItem('youngfire_member_roster_v2');
        const list = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(list)) return;

        const newMembers = list.filter((m: any) => {
          const id = (m.id || '').toLowerCase();
          const email = (m.email || '').toLowerCase();
          const name = (m.fullName || m.name || '').toLowerCase();
          return !id.includes('trent') && !id.includes('whitney') &&
                 !email.includes('trent') && !email.includes('whitney') &&
                 !name.includes('trent') && !name.includes('whitney');
        }).map((m: any, idx: number): TeamMember => {
          const isMale = m.gender === 'male';
          return {
            id: m.id || `registered-${idx}`,
            name: m.fullName || m.name || 'Consecrated Disciple',
            displayName: (m.fullName || m.name || 'DISCIPLE').toUpperCase(),
            jerseyNumber: m.jerseyNumber || `#${idx + 3}`,
            heightWeight: m.heightWeight || (isMale ? "Brother" : "Sister"),
            role: m.role || 'YoungFire Consecrated Disciple',
            positionCode: m.positionCode || (isMale ? 'B' : 'S'),
            badgeLabel: m.badgeLabel || (isMale ? 'BROTHER' : 'SISTER'),
            calling: m.calling || 'Word Discipleship & Sanctuary Assembly',
            scriptureAnchor: m.scriptureAnchor || 'Romans 12:1-2',
            cutoutImage: m.avatar || '/welcome_sanctuary_cover.jpg',
            headshotImage: m.avatar || '/welcome_sanctuary_cover.jpg',
            outlineColor: m.outlineColor || (isMale ? '#06B6D4' : '#14B8A6'),
            streakDays: m.streakDays || 0,
            chaptersRead: m.chaptersRead || 0,
            prayerWatches: m.prayerWatches || 0,
            smallGroupAttendance: m.smallGroupAttendance || "0 Check-Ins (The White's Residence)",
            residence: m.residence || 'San Antonio, TX',
            bio: m.bio || 'Faithful consecrated disciple growing in the word and assembly at Joshua House of Worship.',
            isRegistered: true
          };
        });

        setTeamMembers([...CANONICAL_LEADERSHIP, ...newMembers]);
      } catch {}
    };

    window.addEventListener('roster_members_updated', handleRosterUpdate);
    window.addEventListener('youngfire_team_updated', handleRosterUpdate);
    window.addEventListener('storage', handleRosterUpdate);
    return () => {
      window.removeEventListener('roster_members_updated', handleRosterUpdate);
      window.removeEventListener('youngfire_team_updated', handleRosterUpdate);
      window.removeEventListener('storage', handleRosterUpdate);
    };
  }, []);

  // Selected Member for Highlight & Modal
  const [selectedMember, setSelectedMember] = useState<TeamMember>(CANONICAL_LEADERSHIP[0]);
  const [selectedMemberModal, setSelectedMemberModal] = useState<TeamMember | null>(null);

  // Roster Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'L' | 'B' | 'S'>('ALL');

  // Touch Grab & Swipe State for Photo Banner
  const scrollPathwayRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollPathwayRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - scrollPathwayRef.current.offsetLeft);
    setScrollLeftState(scrollPathwayRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollPathwayRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollPathwayRef.current.offsetLeft;
    const walk = (x - startX) * 1.6; // Swipe speed
    scrollPathwayRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Filtered Roster
  const filteredRoster = teamMembers.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.calling.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === 'ALL' || m.positionCode === positionFilter;
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="relative min-h-screen text-slate-100 pb-28 font-['Outfit'] select-none">
      
      {/* STATIONARY BACKGROUND MAP: Stays pinned and fixed to screen viewport when scrolling */}
      <SanAntonioVectorMap opacity={0.55} className="fixed inset-0 z-0 pointer-events-none" />

      {/* 1. Header Title: "Team" clean & centered at top, matching Spurs app */}
      <div className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-['Barlow_Condensed'] font-black tracking-wider uppercase text-white drop-shadow-md">
          Team
        </h1>
      </div>

      {/* 2. Top Team Hub Collage: EXTENDS AS WIDE AS SCREEN WITH NO BORDER */}
      {/* Touch Grab & Swiped scrolling pathway where all members stand close together */}
      <div className="relative w-full overflow-hidden bg-[#000000] select-none border-none shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-10">
        
        {/* Top Spurs-Style Repeating Text Ticker Bar */}
        <div className="absolute top-0 inset-x-0 h-7 bg-black/80 border-b border-white/10 z-10 flex items-center overflow-hidden pointer-events-none">
          <div className="whitespace-nowrap font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase flex items-center gap-6 px-4 animate-none opacity-80">
            <span>YOUNGFIRE SANCTUARY</span>
            <span>&bull;</span>
            <span className="text-amber-400 font-bold">EST. 2015</span>
            <span>&bull;</span>
            <span>JOSHUA HOUSE OF WORSHIP</span>
            <span>&bull;</span>
            <span className="text-amber-400 font-bold">ACTS 2:42</span>
            <span>&bull;</span>
            <span>LEAD FACILITATORS TRENT &amp; WHITNEY WHITE</span>
            <span>&bull;</span>
            <span>SAN ANTONIO, TX</span>
            <span>&bull;</span>
            <span className="text-amber-400 font-bold">EST. 2015</span>
          </div>
        </div>

        {/* Background Layer: Rich Collage of Photo Fragments & Newspaper Graphic Stamps */}
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-4 sm:grid-cols-6 h-full filter grayscale contrast-175 brightness-40 opacity-40">
            <div className="relative h-full overflow-hidden border-r border-white/5">
              <img src="/yf_living_room_huddle.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative h-full overflow-hidden border-r border-white/5">
              <img src="/yf_easter_church_family.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative h-full overflow-hidden border-r border-white/5">
              <img src="/yf_yard_fellowship.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative h-full overflow-hidden border-r border-white/5">
              <img src="/welcome_sanctuary_cover.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative h-full overflow-hidden border-r border-white/5">
              <img src="/yf_living_room_warmth.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative h-full overflow-hidden">
              <img src="/yf_hallway_huddle.jpg" alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Graphic Text Headlines & Typography Watermarks */}
          <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none opacity-20 select-none">
            <span className="font-['Barlow_Condensed'] font-black text-6xl sm:text-8xl tracking-tighter uppercase text-white">
              CHAMPS
            </span>
            <span className="font-['Barlow_Condensed'] font-black text-6xl sm:text-8xl tracking-tighter uppercase text-white">
              FAITHFUL
            </span>
          </div>

          {/* Obsidian Gradient Scrims: Seamless blend to black at top & bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#000000] pointer-events-none" />
        </div>

        {/* Foreground Layer: TOUCH GRAB & SWIPED SCROLLING PATHWAY */}
        {/* Outlines JUST ONE PERSON in each photo, exactly how the Spurs had it */}
        <div 
          ref={scrollPathwayRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="relative z-20 overflow-x-auto scrollbar-none flex items-end pt-12 pb-5 px-6 sm:px-16 gap-6 sm:gap-12 min-w-max cursor-grab active:cursor-grabbing touch-pan-x justify-center"
        >
          {teamMembers.map((member) => {
            const isSelected = selectedMember.id === member.id;
            
            return (
              <div
                key={member.id}
                onClick={() => {
                  setSelectedMember(member);
                  setSelectedMemberModal(member);
                }}
                className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'z-30 scale-105' : 'z-20 hover:scale-102'
                }`}
              >
                {/* Individual Member Cutout: OUTLINE JUST THE BODY OF THE INDIVIDUAL IN THE PICTURE */}
                <div className="relative w-52 sm:w-64 md:w-72 h-72 sm:h-84 md:h-96 flex items-end justify-center">
                  <img
                    src={member.cutoutImage}
                    alt={member.name}
                    className="w-full h-full object-contain object-bottom pointer-events-none transition-all duration-300"
                    style={{
                      // Precise multi-directional drop-shadow outlining just one person in each photo
                      filter: `drop-shadow(2.5px 0 0 ${member.outlineColor}) drop-shadow(-2.5px 0 0 ${member.outlineColor}) drop-shadow(0 2.5px 0 ${member.outlineColor}) drop-shadow(0 -2.5px 0 ${member.outlineColor}) drop-shadow(0 0 18px ${member.outlineColor}95)`
                    }}
                  />

                  {/* Active Selection Glow Ring at bottom */}
                  {isSelected && (
                    <div 
                      className="absolute -bottom-1 w-28 sm:w-36 h-3 rounded-full blur-sm animate-pulse"
                      style={{ backgroundColor: member.outlineColor }}
                    />
                  )}
                </div>

                {/* Hand-Drawn / Curved Arrow pointing up to the body & Bold Athletic Name */}
                <div className="flex flex-col items-center mt-2 -space-y-0.5 z-30">
                  {/* Curved arrow matching Spurs app */}
                  <svg 
                    className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ color: isSelected ? member.outlineColor : '#FFFFFF' }}
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <path 
                      d="M7 17C10 15 15 12 18 6M18 6H11M18 6V13" 
                      stroke="currentColor" 
                      strokeWidth="2.75" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>

                  {/* All-Caps Condensed Athletic Name */}
                  <span className={`font-['Barlow_Condensed'] font-black text-xl sm:text-2xl tracking-wider uppercase whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-100 group-hover:text-white'
                  }`}>
                    {member.displayName}
                  </span>

                  {/* Position Badge & Jersey Subtitle */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span 
                      className="text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${member.outlineColor}25`, 
                        color: member.outlineColor,
                        border: `1px solid ${member.outlineColor}50`
                      }}
                    >
                      {member.badgeLabel}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      {member.jerseyNumber}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Below Collage: Responsive Controls & Roster List */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-5 space-y-5">
        
        {/* 3-Way Segmented Control: [ ROSTER ] | [ FAITHFULNESS ] | [ STATS ] (Spurs Stadium Pill Buttons) */}
        <div className="p-1.5 rounded-full bg-black/85 border border-white/15 max-w-md mx-auto grid grid-cols-3 gap-1 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setActiveSegment('roster')}
            className={`py-2 px-3 rounded-full font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSegment === 'roster'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ROSTER</span>
          </button>

          <button
            onClick={() => setActiveSegment('faithfulness')}
            className={`py-2 px-3 rounded-full font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSegment === 'faithfulness'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FAITHFULNESS</span>
          </button>

          <button
            onClick={() => setActiveSegment('stats')}
            className={`py-2 px-3 rounded-full font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSegment === 'stats'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>STATS</span>
          </button>
        </div>

        {/* Spurs App Callout: "TAP A MEMBER TO VIEW THEIR STATS" with Triple-Color Accent Bar */}
        <div className="text-center pt-1 pb-1 space-y-2">
          <p className="font-['Outfit'] italic font-bold tracking-widest text-sm sm:text-base text-cyan-400 drop-shadow">
            TAP A MEMBER TO VIEW THEIR STATS
          </p>
          
          {/* Triple-Color Accent Divider Bar matching Spurs Fiesta/City Edition */}
          <div className="w-48 sm:w-64 h-1 mx-auto rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-teal-400 shadow-sm" />
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase pt-1">
            <span>&lt; &lt; &lt; &lt; &lt;</span>
            <span className="text-amber-400 font-bold">TOUCH GRAB &amp; SWIPE BANNER</span>
            <span>&gt; &gt; &gt; &gt; &gt;</span>
          </div>
        </div>

        {/* TAB 1: ROSTER VIEW */}
        {activeSegment === 'roster' && (
          <div className="space-y-4">
            
            {/* Search & Role Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#000000]/90 border border-white/10 backdrop-blur-md">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leadership & members..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0a0a0a] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Position Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {(['ALL', 'L', 'B', 'S'] as const).map((pos) => {
                  const labels: Record<string, string> = {
                    ALL: 'All',
                    L: 'Overseer',
                    B: 'Brother',
                    S: 'Sister'
                  };
                  return (
                    <button
                      key={pos}
                      onClick={() => setPositionFilter(pos)}
                      className={`px-3 py-1 rounded-lg font-['Barlow_Condensed'] font-black text-xs tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                        positionFilter === pos
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {labels[pos]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roster Cards List */}
            {/* Trent & Whitney + Real Registered Disciples with individual pictures and position letters */}
            <div className="space-y-3">
              {filteredRoster.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMemberModal(member)}
                  className="group relative rounded-2xl bg-[#000000]/90 border border-white/10 hover:border-amber-400/40 transition-all duration-200 p-3.5 sm:p-4 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl"
                >
                  {/* Spurs-Style Top Accent Stripe */}
                  <div 
                    className="absolute top-0 inset-x-0 h-1"
                    style={{
                      background: `linear-gradient(90deg, ${member.outlineColor}, ${member.outlineColor}30)`
                    }}
                  />

                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Square Authentic Headshot */}
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black/80 border border-white/15 shrink-0 shadow-inner group-hover:scale-102 transition-transform">
                        <img
                          src={member.headshotImage}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/image_4.png';
                          }}
                        />
                        <div 
                          className="absolute inset-x-0 bottom-0 h-1"
                          style={{ backgroundColor: member.outlineColor }}
                        />
                      </div>

                      {/* Middle: Name & Athletic Info */}
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-['Barlow_Condensed'] font-black text-xl sm:text-2xl tracking-wide uppercase text-white truncate group-hover:text-amber-300 transition-colors">
                            {member.name}
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm font-mono text-slate-300 truncate">
                          <span className="text-amber-400 font-bold">{member.jerseyNumber}</span> {member.heightWeight ? `• ${member.heightWeight}` : ''} • {member.role}
                        </p>

                        <p className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{member.residence}</span>
                          <span>&bull;</span>
                          <span className="text-slate-300 font-bold">{member.scriptureAnchor}</span>
                        </p>
                      </div>
                    </div>

                    {/* Far Right: Heavy Athletic Position Letter (L, B, S) */}
                    <div className="flex flex-col items-center justify-center shrink-0 pl-3 border-l border-white/10">
                      <span className="font-['Barlow_Condensed'] font-black text-3xl sm:text-4xl text-white tracking-tighter leading-none group-hover:text-amber-400 transition-colors">
                        {member.positionCode}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        POS
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: FAITHFULNESS VIEW */}
        {activeSegment === 'faithfulness' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#000000]/90 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h2 className="font-['Barlow_Condensed'] font-black text-xl uppercase tracking-wider text-white">
                  Consecrated Disciple Walk &bull; Zero-Start Ledger
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                As leaders and disciples at Joshua House of Worship, our devotion is grounded in daily physical sword reading, corporate prayer watches, and faithful small group assembly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="p-4 rounded-2xl bg-[#000000]/90 border border-white/10 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.headshotImage} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover border border-white/15" 
                    />
                    <div>
                      <h4 className="font-['Barlow_Condensed'] font-black text-lg text-white uppercase">
                        {member.name}
                      </h4>
                      <span className="text-[10px] font-mono text-amber-400 font-bold block">
                        {member.badgeLabel} &bull; {member.jerseyNumber}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                    <div className="p-2 rounded-xl bg-black/60 border border-white/5">
                      <span className="font-mono font-black text-lg text-white block">
                        {member.chaptersRead}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        Chapters Read
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/60 border border-white/5">
                      <span className="font-mono font-black text-lg text-white block">
                        {member.streakDays}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        Consecrated Days
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/60 border border-white/5">
                      <span className="font-mono font-black text-lg text-white block">
                        {member.prayerWatches}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        Prayer Watches
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STATS VIEW */}
        {activeSegment === 'stats' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#000000]/90 border border-white/10 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="font-['Barlow_Condensed'] font-black text-xl uppercase tracking-wider text-white">
                  Corporate Sanctuary Metrics (Starting At Zero)
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-center">
                  <span className="font-['Barlow_Condensed'] font-black text-3xl text-amber-400 block">
                    0
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-bold">
                    Chapters Completed
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-center">
                  <span className="font-['Barlow_Condensed'] font-black text-3xl text-amber-400 block">
                    0
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-bold">
                    Streak Days
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-center">
                  <span className="font-['Barlow_Condensed'] font-black text-3xl text-amber-400 block">
                    0
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-bold">
                    Prayers Interceded
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-center">
                  <span className="font-['Barlow_Condensed'] font-black text-3xl text-amber-400 block">
                    0
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-bold">
                    Huddles Attended
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                <p className="text-xs font-mono text-slate-400">
                  All accounts start at zero. Disciples build their consecrated sword ledger daily through personal Bible tracking and corporate Monday/Thursday gatherings.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Member Detail Modal */}
      {selectedMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#000000] border border-amber-500/30 p-6 space-y-5 shadow-2xl overflow-hidden">
            
            {/* Top Accent Stripe */}
            <div 
              className="absolute top-0 inset-x-0 h-1.5"
              style={{ backgroundColor: selectedMemberModal.outlineColor }}
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedMemberModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Overview */}
            <div className="flex items-center gap-4 pt-2">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-black border border-white/20 shrink-0">
                <img
                  src={selectedMemberModal.headshotImage}
                  alt={selectedMemberModal.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${selectedMemberModal.outlineColor}30`, 
                      color: selectedMemberModal.outlineColor 
                    }}
                  >
                    {selectedMemberModal.badgeLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {selectedMemberModal.jerseyNumber}
                  </span>
                </div>
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl sm:text-3xl uppercase tracking-wider text-white">
                  {selectedMemberModal.name}
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  {selectedMemberModal.role}
                </p>
              </div>
            </div>

            {/* Scripture Anchor & Calling */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-black/60 border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">Scripture Anchor:</span>
                <span className="text-amber-400 font-bold">{selectedMemberModal.scriptureAnchor}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">Sanctuary Calling:</span>
                <span className="text-white font-medium text-right max-w-[65%] truncate">{selectedMemberModal.calling}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">Location:</span>
                <span className="text-slate-300">{selectedMemberModal.residence}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              {selectedMemberModal.bio}
            </p>

            {/* Consecrated Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <span className="font-mono font-black text-xl text-white block">
                  {selectedMemberModal.chaptersRead}
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  Chapters Read
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <span className="font-mono font-black text-xl text-white block">
                  {selectedMemberModal.streakDays}
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  Streak Days
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <span className="font-mono font-black text-xl text-white block">
                  {selectedMemberModal.prayerWatches}
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  Prayer Watches
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedMemberModal(null)}
              className="w-full py-3 rounded-xl font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg cursor-pointer hover:brightness-110 transition-all"
            >
              CLOSE DISCIPLE CARD
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SanctuaryTeamHub;
