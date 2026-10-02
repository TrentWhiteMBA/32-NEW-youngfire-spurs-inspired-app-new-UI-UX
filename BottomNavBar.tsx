import React from 'react';
import { Home, Calendar, BookOpen, Users, Menu, Shield } from 'lucide-react';

export interface BottomNavBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMoreDrawer?: () => void;
  onOpenNotes?: () => void;
  onOpenWordPicker?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ 
  currentTab, 
  onSelectTab, 
  onOpenMoreDrawer,
  onOpenWordPicker
}) => {
  // 5-Pillar Navigation:
  // Tab 1: "Home" (Sanctuary Dashboard)
  // Tab 2: "Schedule" (Sanctuary Fellowship Calendar)
  // Tab 3: "Word" (66-Book Scripture Reader & Imperial Atlas)
  // Tab 4: Elevated Center Action Badge: "Team" (Sanctuary Team & Roster Hub)
  // Tab 5: "More" (Sliding Navigation Drawer)

  const handleTabClick = (tabId: string) => {
    if (tabId === 'more') {
      if (onOpenMoreDrawer) {
        onOpenMoreDrawer();
      } else {
        window.dispatchEvent(new CustomEvent('yf_open_nav_drawer'));
      }
    } else if (tabId === 'word') {
      if (onOpenWordPicker) {
        onOpenWordPicker();
      } else {
        onSelectTab('word');
      }
    } else {
      onSelectTab(tabId);
    }
  };

  return (
    <nav 
      aria-label="Sanctuary 5-Pillar Navigation" 
      className="fixed bottom-0 inset-x-0 z-40 bg-[#000000]/95 backdrop-blur-xl border-t border-white/15 px-2 sm:px-4 py-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="max-w-lg mx-auto flex items-center justify-between">
        
        {/* Tab 1: Home (Sanctuary Dashboard) */}
        <button
          onClick={() => handleTabClick('sanctuary')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'sanctuary' 
              ? 'text-white font-black' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Sanctuary Home Dashboard"
        >
          <div 
            className={`p-1.5 rounded-xl transition-all ${
              currentTab === 'sanctuary'
                ? 'bg-white/15 text-white ring-1 ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.45)]' 
                : 'bg-transparent text-slate-400'
            }`}
          >
            <Home className={`w-5 h-5 ${currentTab === 'sanctuary' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          </div>
          <span className="font-pro-display text-[10px] tracking-wider uppercase">
            Home
          </span>
        </button>

        {/* Tab 2: Schedule (Sanctuary Fellowship Calendar) */}
        <button
          onClick={() => handleTabClick('schedule')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'schedule' 
              ? 'text-white font-black' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Fellowship Calendar & Schedule"
        >
          <div 
            className={`p-1.5 rounded-xl transition-all ${
              currentTab === 'schedule' 
                ? 'bg-white/15 text-white ring-1 ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.45)]' 
                : 'bg-transparent text-slate-400'
            }`}
          >
            <Calendar className={`w-5 h-5 ${currentTab === 'schedule' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          </div>
          <span className="font-pro-display text-[10px] tracking-wider uppercase">
            Schedule
          </span>
        </button>

        {/* Tab 3: Word (66-Book Scripture Reader & Imperial Atlas) */}
        <button
          onClick={() => handleTabClick('word')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'word' 
              ? 'text-white font-black' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="66-Book Scripture & Imperial Atlas"
        >
          <div 
            className={`p-1.5 rounded-xl transition-all ${
              currentTab === 'word' 
                ? 'bg-white/15 text-white ring-1 ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.45)]' 
                : 'bg-transparent text-slate-400'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${currentTab === 'word' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          </div>
          <span className="font-pro-display text-[10px] tracking-wider uppercase">
            Word
          </span>
        </button>

        {/* Tab 4: Elevated Center Action Badge: "Team" (Sanctuary Team & Roster Hub) */}
        <div className="flex-1 flex flex-col items-center relative">
          <button
            onClick={() => handleTabClick('team')}
            className="relative -translate-y-3 flex flex-col items-center group cursor-pointer focus:outline-none transition-transform active:scale-95"
            title="Sanctuary Team & Discipleship Roster Hub"
          >
            {/* Elevated Action Badge Container with Consecrated Metallic Rim & Active Glow */}
            <div 
              className={`w-13 h-13 rounded-2xl p-0.5 transition-all duration-300 shadow-xl flex items-center justify-center ${
                currentTab === 'team'
                  ? 'bg-gradient-to-tr from-amber-400 via-white to-amber-500 shadow-[0_0_22px_rgba(245,158,11,0.65)] ring-2 ring-white/60'
                  : 'bg-gradient-to-tr from-amber-500/80 via-slate-500 to-amber-600/80 shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-105'
              }`}
            >
              <div className="w-full h-full rounded-[14px] bg-[#000000] flex items-center justify-center border border-black/40">
                <Users 
                  className={`w-6 h-6 transition-colors ${
                    currentTab === 'team' 
                      ? 'text-amber-400 fill-amber-400/20 stroke-[2.5]' 
                      : 'text-amber-300 stroke-[2]'
                  }`} 
                />
              </div>
            </div>

            {/* Label beneath elevated badge */}
            <span 
              className={`font-pro-display text-[10px] tracking-wider uppercase mt-0.5 transition-colors ${
                currentTab === 'team' ? 'text-amber-400' : 'text-slate-300 group-hover:text-white'
              }`}
            >
              Team
            </span>
          </button>
        </div>

        {/* Tab 5: More (Sliding Navigation Drawer) */}
        <button
          onClick={() => handleTabClick('more')}
          className="flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer group"
          title="Open Sliding Navigation Drawer"
        >
          <div className="p-1.5 rounded-xl bg-transparent text-slate-400 group-hover:text-white transition-all">
            <Menu className="w-5 h-5 stroke-[1.75]" />
          </div>
          <span className="font-pro-display text-[10px] tracking-wider uppercase">
            More
          </span>
        </button>

      </div>
    </nav>
  );
};
