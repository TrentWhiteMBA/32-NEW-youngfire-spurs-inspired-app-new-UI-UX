import React, { useState } from 'react';
import { 
  X, User, Volume2, Shield, Moon, Trash2, 
  CheckCircle2, AlertTriangle, Sparkles, Sliders, LogOut, Flame, Heart
} from 'lucide-react';
import { AppTheme } from '../data/appThemes';

export interface CurrentUser {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  role?: string;
  ministryRole?: string;
  calling?: string;
  group?: string;
  gender?: 'male' | 'female' | string;
  avatar?: string;
  churchMembership?: string;
  residence?: string;
  phone?: string;
  notes?: string;
  prayerRequests?: string;
  accountType?: string;
  birthday?: string;
  ministryRoleId?: string;
  ministryRoleLabel?: string;
  joinedAt?: string;
  isAdmin?: boolean;
}

interface SettingsHUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser | null;
  onUpdateUser?: (updated: CurrentUser) => void;
  onSignOut?: () => void;
  onDeleteProfile?: () => void;
  masterVolume?: number;
  onVolumeChange?: (vol: number) => void;
  activeTheme?: AppTheme;
  onOpenThemeModal?: () => void;
  [key: string]: any;
}

export const SettingsHUDModal: React.FC<SettingsHUDModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSignOut,
  onDeleteProfile,
  masterVolume = 1,
  onVolumeChange,
  activeTheme,
  onOpenThemeModal
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [editedEmail, setEditedEmail] = useState(currentUser?.email || '');
  const [editedCalling, setEditedCalling] = useState(currentUser?.calling || 'Young Adult Disciple');
  
  const [autoplayAudio, setAutoplayAudio] = useState<boolean>(() => {
    return localStorage.getItem('youngfire_autoplay_audio') !== 'false';
  });

  const [soundEffects, setSoundEffects] = useState<boolean>(() => {
    return localStorage.getItem('youngfire_sound_effects') !== 'false';
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const accentColor = activeTheme?.accentHex || '#F59E0B';

  const handleSaveProfile = () => {
    if (!currentUser) return;
    const updated: CurrentUser = {
      ...currentUser,
      name: editedName.trim() || currentUser.name,
      fullName: editedName.trim() || currentUser.fullName,
      email: editedEmail.trim() || currentUser.email,
      calling: editedCalling.trim() || currentUser.calling
    };
    try {
      localStorage.setItem('youngfire_device_session_v1', JSON.stringify(updated));
    } catch {}
    if (onUpdateUser) onUpdateUser(updated);
    setIsEditingProfile(false);
  };

  const handleToggleAutoplay = () => {
    const next = !autoplayAudio;
    setAutoplayAudio(next);
    localStorage.setItem('youngfire_autoplay_audio', String(next));
  };

  const handleToggleSoundEffects = () => {
    const next = !soundEffects;
    setSoundEffects(next);
    localStorage.setItem('youngfire_sound_effects', String(next));
  };

  const executeProfileDeletion = () => {
    // 1. Remove local session & tracker data
    try {
      localStorage.removeItem('youngfire_device_session_v1');
      localStorage.removeItem('youngfire_user_session');
      localStorage.removeItem('youngfire_sword_streak_v1');
      localStorage.removeItem('youngfire_completed_bible_books');

      // Remove from roster
      const rosterSaved = localStorage.getItem('youngfire_member_roster_v2');
      if (rosterSaved && currentUser?.id) {
        const roster = JSON.parse(rosterSaved);
        if (Array.isArray(roster)) {
          const filtered = roster.filter((m: any) => m.id !== currentUser.id && m.email !== currentUser.email);
          localStorage.setItem('youngfire_member_roster_v2', JSON.stringify(filtered));
        }
      }
      if (currentUser?.id) {
        fetch(`/api/roster/${currentUser.id}`, { method: 'DELETE' }).catch(() => {});
        window.dispatchEvent(new CustomEvent('yf_delete_member', { detail: { id: currentUser.id } }));
      }
    } catch (err) {
      console.error('Error removing profile storage:', err);
    }

    setShowDeleteConfirm(false);
    onClose();

    // 3. Invoke parent deletion pipeline
    if (onDeleteProfile) {
      onDeleteProfile();
    } else if (onSignOut) {
      onSignOut();
    }
    window.dispatchEvent(new CustomEvent('yf_account_deleted'));
  };

  const handleDeleteProfile = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn select-none font-['Outfit']">
      <div className="w-full max-w-lg bg-[#000000] border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black flex-shrink-0 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <Shield className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-black text-base sm:text-lg tracking-wider uppercase text-white leading-tight">
                Sanctuary Settings &amp; Profile
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                YoungFire Ministry &bull; Joshua House of Worship
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Disciple Profile Card & Editor */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-black text-lg flex-shrink-0 shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'YF'}
              </div>
              <div className="min-w-0">
                <div className="font-['Outfit'] font-black text-sm sm:text-base text-white truncate">
                  {currentUser?.fullName || currentUser?.name || 'Sanctuary Disciple'}
                </div>
                <div className="text-xs font-mono text-slate-400 truncate">
                  {currentUser?.email || 'youngfire@jhow.org'}
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider mt-0.5 truncate">
                  {currentUser?.calling || currentUser?.role || 'Young Adult Disciple'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(prev => !prev)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-mono font-bold uppercase cursor-pointer transition-colors"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Inline Profile Editor */}
          {isEditingProfile && (
            <div className="pt-3 border-t border-white/10 space-y-2.5 animate-fadeIn">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/20 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/20 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Ministry Calling / Role</label>
                <input
                  type="text"
                  value={editedCalling}
                  onChange={(e) => setEditedCalling(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/20 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-2 rounded-xl text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                Save Profile Changes &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Master Audio Volume */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-bold font-['Outfit'] uppercase">
              <Volume2 className="w-4 h-4 text-amber-400" /> 
              Master Sanctuary Audio
            </span>
            <span className="font-mono text-amber-400 font-bold">{Math.round(masterVolume * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={masterVolume} 
            onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-white/20"
          />
        </div>

        {/* Audio Preferences & Autoplay Toggles */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Sanctuary Playback &amp; Audio Preferences
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">Launch Worship Autoplay</span>
              <span className="text-[10px] text-slate-400 font-mono">Stream contemporary worship on app launch</span>
            </div>
            <button
              onClick={handleToggleAutoplay}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoplayAudio ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${
                  autoplayAudio ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs font-bold text-white block">Sound Effects &amp; Audio Ducking</span>
              <span className="text-[10px] text-slate-400 font-mono">Auto-duck radio during video and live sermons</span>
            </div>
            <button
              onClick={handleToggleSoundEffects}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEffects ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${
                  soundEffects ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* App Theme Selector */}
        {onOpenThemeModal && (
          <button
            onClick={() => { onClose(); onOpenThemeModal(); }}
            className="w-full py-3 px-4 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/15 text-xs font-black uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-400" /> 
              Switch Sanctuary Style
            </span>
            <span className="text-amber-400 font-mono font-bold">[{activeTheme?.name || 'Spurs Noir'}]</span>
          </button>
        )}

        {/* Sign Out / Logout Button */}
        <button
          onClick={() => {
            try {
              localStorage.removeItem('youngfire_device_session_v1');
              localStorage.removeItem('youngfire_user_session');
              window.dispatchEvent(new CustomEvent('yf_logout'));
            } catch {}
            if (onSignOut) onSignOut();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-amber-300 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
        >
          <LogOut className="w-4 h-4 text-amber-400" />
          <span>Log Out of Sanctuary Session</span>
        </button>

        {/* PROMINENT ATHLETIC DANGER BUTTON: DELETE MY PROFILE */}
        <div className="pt-2">
          <button
            onClick={handleDeleteProfile}
            className="w-full py-3 px-4 rounded-2xl border border-red-500/50 hover:border-red-500 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs sm:text-sm font-black font-['Outfit'] uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg group active:scale-98"
            title="Permanently Delete Consecrated Disciple Profile & Records"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5] text-red-500 group-hover:scale-110 transition-transform" />
            <span>DELETE MY PROFILE</span>
          </button>
          <p className="text-[10px] font-mono text-slate-500 text-center mt-1.5">
            Permanently removes your account session, streak progress, and roster data.
          </p>
        </div>

        {/* IN-APP DANGER CONFIRMATION MODAL */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-[#0D0406] border-2 border-red-500/60 p-5 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase text-white font-['Outfit']">Delete Profile?</h3>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Are you sure you want to delete your profile? All consecrated streaks and device data will be permanently wiped.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeProfileDeletion}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsHUDModal;
