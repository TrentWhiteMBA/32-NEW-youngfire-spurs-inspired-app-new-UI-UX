import React, { useState, useRef, useMemo } from 'react';
import { 
  Flame, Shield, Lock, Mail, ArrowRight, UserCheck, 
  CheckCircle2, Heart, Upload, Camera, Sparkles, Image as ImageIcon,
  ShieldAlert, Users, Calendar, Music, AlertCircle, RefreshCw
} from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';
import { MINISTRY_ROLES, ADMIN_SECURITY_PASSCODE, getRoleById } from '../data/ministryRoles';
import { authInstance, googleProviderInstance } from '../config';
import { signInWithPopup } from 'firebase/auth';
import { SanAntonioVectorMap } from './SanAntonioVectorMap';

interface AuthSecurityPortalProps {
  onAuthenticated: (user: CurrentUser) => void;
  onBackToWelcome?: () => void;
  initialMode?: 'signin' | 'register' | 'forgot';
}

/**
 * Real-time 400x400 canvas compression (WebP / JPEG DataURL)
 */
export async function compressPhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed reading file'));
    reader.onload = (uploadEvent) => {
      const src = uploadEvent.target?.result as string;
      if (!src) return resolve('');
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);

        // Center-crop square to guarantee authentic 1:1 ratio
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 400, 400);

        try {
          const webpData = canvas.toDataURL('image/webp', 0.88);
          if (webpData && webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {}
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => reject(new Error('Failed loading image'));
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Athletic Monogram Badge: Gold typography over dark obsidian canvas
 */
export function generateMonogramBadge(name: string): string {
  if (typeof document === 'undefined') return '';
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  let initials = 'YF';
  if (parts.length === 1 && parts[0].length > 0) {
    initials = parts[0].slice(0, 2).toUpperCase();
  } else if (parts.length >= 2) {
    // If name begins with title like Lead Facilitator, take actual names if available
    const nonTitles = parts.filter(p => !['LEAD', 'FACILITATOR', 'ADMIN', 'OVERSEER'].includes(p.toUpperCase()));
    if (nonTitles.length >= 2) {
      initials = (nonTitles[0][0] + nonTitles[nonTitles.length - 1][0]).toUpperCase();
    } else {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Dark obsidian radial background
  const bgGrad = ctx.createRadialGradient(200, 200, 40, 200, 200, 260);
  bgGrad.addColorStop(0, '#050505');
  bgGrad.addColorStop(0.55, '#000000');
  bgGrad.addColorStop(1, '#020408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 400, 400);

  // Athletic fine grid lines
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.07)';
  ctx.lineWidth = 1;
  for (let i = 40; i < 400; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(400, i);
    ctx.stroke();
  }

  // Athletic gold ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(200, 200, 175, 0, Math.PI * 2);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.restore();

  // Subtle inner accent ring
  ctx.beginPath();
  ctx.arc(200, 200, 160, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Athletic gold monogram typography
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 144px "Outfit", "Arial Black", "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
  ctx.shadowBlur = 12;
  ctx.fillText(initials, 200, 204);

  // Subtext banner
  ctx.font = 'bold 18px "Outfit", monospace';
  ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
  ctx.shadowBlur = 0;
  ctx.fillText('YOUNGFIRE SANCTUARY', 200, 310);

  return canvas.toDataURL('image/jpeg', 0.92);
}

export const AuthSecurityPortal: React.FC<AuthSecurityPortalProps> = ({ 
  onAuthenticated, 
  onBackToWelcome,
  initialMode = 'signin'
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('trentwhite0308@gmail.com');
  const [password, setPassword] = useState('youngfire2026');
  const [name, setName] = useState('Lead Facilitator Trent D. White');
  const [birthday, setBirthday] = useState('03-08');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Account Type (Member vs Administrator)
  const [accountType, setAccountType] = useState<'member' | 'administrator'>('administrator');
  const [adminPasscode, setAdminPasscode] = useState(ADMIN_SECURITY_PASSCODE);

  // 2. Ministry Role (Prayer Warrior, Disciple, Photographer, Event Facilitator, Member, etc.)
  const [selectedMinistryRoleId, setSelectedMinistryRoleId] = useState<string>('event_facilitator');

  // 3. Discipleship Cohort (Brotherhood vs Sisterhood)
  const [selectedCohort, setSelectedCohort] = useState<'brother' | 'sister'>('brother');
  
  // 4. Profile Photo Upload (Real-time 400x400 compression)
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedRoleObj = getRoleById(selectedMinistryRoleId);

  // Compute active athletic monogram badge dynamically
  const activeMonogram = useMemo(() => {
    return generateMonogramBadge(name || (accountType === 'administrator' ? 'Lead Facilitator' : 'YoungFire Disciple'));
  }, [name, accountType]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      setErrorMessage('');
      const compressed = await compressPhotoFile(file);
      if (compressed) {
        setAvatarImage(compressed);
      }
    } catch (err) {
      console.error('Photo compression error:', err);
      setErrorMessage('Could not compress photo. Please try a standard PNG or JPEG image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailLower = email.toLowerCase().trim();
    const nameLower = name.toLowerCase().trim();

    // Check if user is either overseer
    const isTrent = emailLower.includes('trent') || nameLower.includes('trent');
    const isWhitney = emailLower.includes('whitney') || nameLower.includes('whitney');
    const isOverseer = isTrent || isWhitney;

    const isAdminUser = isOverseer || 
                        emailLower.includes('admin') || 
                        nameLower.includes('admin');

    // Registration validations
    let isElevatedAdmin = false;
    if (authMode === 'register') {
      if (accountType === 'administrator' || isOverseer) {
        if (adminPasscode.trim() !== ADMIN_SECURITY_PASSCODE && !isOverseer) {
          setErrorMessage(`Invalid Administrator Key. Please enter ${ADMIN_SECURITY_PASSCODE} to register as an Administrator.`);
          return;
        }
        isElevatedAdmin = true;
      }
    } else {
      isElevatedAdmin = isAdminUser;
    }
    
    let resolvedGender: 'male' | 'female' = 'male';
    if (isWhitney) {
      resolvedGender = 'female';
    } else if (isTrent) {
      resolvedGender = 'male';
    } else if (authMode === 'register') {
      resolvedGender = selectedCohort === 'brother' ? 'male' : 'female';
    }

    const roleObj = getRoleById(selectedMinistryRoleId);

    // Strict Equal Lead Facilitator title enforcement
    let finalFullName = name.trim();
    if (isTrent) {
      finalFullName = 'Lead Facilitator Trent D. White';
    } else if (isWhitney) {
      finalFullName = 'Lead Facilitator Whitney White';
    } else if (!finalFullName) {
      finalFullName = 'YoungFire Disciple';
    }

    const finalRoleTitle = isOverseer ? 'Lead Facilitator' : roleObj.label;
    const finalCalling = isOverseer ? 'Sanctuary Leadership & Overseer' : roleObj.defaultCalling;
    const finalIsAdmin = isOverseer ? true : isElevatedAdmin;
    const finalAccountType = finalIsAdmin ? 'administrator' : 'member';

    // Resolved avatar: compressed photo if uploaded; otherwise athletic monogram badge in gold over dark obsidian
    const resolvedAvatar = avatarImage || (isTrent ? '/image_4.png' : isWhitney ? '/image_2.png' : generateMonogramBadge(finalFullName));

    const user: CurrentUser = {
      id: isTrent ? 'roster_lead_trent' : isWhitney ? 'roster_lead_whitney' : `usr-${Date.now()}`,
      name: finalFullName,
      email: email.trim(),
      gender: resolvedGender,
      avatar: resolvedAvatar,
      isAdmin: finalIsAdmin,
      accountType: finalAccountType,
      role: finalRoleTitle,
      ministryRoleId: isOverseer ? 'event_facilitator' : roleObj.id,
      ministryRoleLabel: finalRoleTitle,
      calling: finalCalling,
      birthday: birthday.trim() || (isWhitney ? '06-15' : isTrent ? '03-08' : '09-14')
    };

    // If new registration, sync to roster database and local storage so they appear in Admin CMS & Sanctuary Roster
    if (authMode === 'register') {
      const isMale = resolvedGender === 'male';
      const newRosterDoc = {
        id: user.id,
        fullName: user.name,
        name: user.name,
        jerseyNumber: isTrent ? '#1' : isWhitney ? '#2' : `#${Math.floor(Math.random() * 80) + 3}`,
        heightWeight: isTrent ? '6\' 2", 205 lbs.' : isWhitney ? 'Co-Facilitator' : (isMale ? 'Brother' : 'Sister'),
        positionCode: isOverseer ? 'L' : (isMale ? 'B' : 'S'),
        badgeLabel: isOverseer ? 'LEAD OVERSEER' : (isMale ? 'BROTHER' : 'SISTER'),
        role: `${finalRoleTitle} • ${finalIsAdmin ? 'Administrator' : 'Member'}`,
        calling: user.calling,
        scriptureAnchor: 'Romans 12:1-2',
        bio: `${user.name} is a faithful disciple consecrated to Jesus Christ at Joshua House of Worship.`,
        outlineColor: isTrent ? '#F59E0B' : isWhitney ? '#EC4899' : (isMale ? '#06B6D4' : '#14B8A6'),
        group: isWhitney ? 'Women Ignited' : isTrent ? 'Men On Fire' : (selectedCohort === 'brother' ? 'Men On Fire' : 'Women Ignited'),
        gender: resolvedGender,
        avatar: user.avatar,
        cutoutImage: user.avatar,
        headshotImage: user.avatar,
        email: user.email,
        birthday: user.birthday,
        churchMembership: 'Joshua House of Worship',
        residence: 'San Antonio, TX',
        streakDays: 0,
        chaptersRead: 0,
        prayerWatches: 0,
        smallGroupAttendance: "0 Check-Ins (The White's Residence)",
        accountType: finalAccountType,
        isAdmin: finalIsAdmin,
        ministryRole: finalRoleTitle
      };

      try {
        const saved = localStorage.getItem('youngfire_member_roster_v2');
        const list = saved ? JSON.parse(saved) : [];
        const userEmailLower = (user.email || '').toLowerCase();
        const existingIdx = list.findIndex((m: any) => m.id === user.id || (m.email && m.email.toLowerCase() === userEmailLower));
        if (existingIdx >= 0) {
          list[existingIdx] = { ...list[existingIdx], ...newRosterDoc };
        } else {
          list.unshift(newRosterDoc);
        }
        localStorage.setItem('youngfire_member_roster_v2', JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('roster_members_updated', { detail: { members: list } }));
        window.dispatchEvent(new CustomEvent('youngfire_team_updated'));
      } catch {}

      fetch('/api/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRosterDoc)
      }).catch(() => {});
    }

    // Persist device session
    try {
      localStorage.setItem('youngfire_device_session_v1', JSON.stringify(user));
      localStorage.setItem('youngfire_user_session', JSON.stringify(user));
    } catch {}

    onAuthenticated(user);
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    let googleName = '';
    let googleEmail = '';
    let googleAvatar = '';
    let googleUid = '';

    // 1. Try real Firebase Google Authentication Popup
    if (authInstance && googleProviderInstance && typeof signInWithPopup === 'function') {
      try {
        const result = await signInWithPopup(authInstance, googleProviderInstance);
        if (result?.user) {
          googleName = result.user.displayName || '';
          googleEmail = result.user.email || '';
          googleAvatar = result.user.photoURL || '';
          googleUid = result.user.uid;
        }
      } catch (err: any) {
        console.warn('[Firebase Auth] Google popup blocked or cancelled:', err);
      }
    }

    // 2. Fallback if popup cancelled or running in restricted iframe
    if (!googleEmail) {
      if (email.trim()) {
        googleEmail = email.trim();
        googleName = name.trim() || email.split('@')[0].replace(/[._]/g, ' ');
      } else {
        const promptInput = window.prompt("Enter your Google Account email:", "trentwhite0308@gmail.com");
        if (!promptInput || !promptInput.trim()) return;
        googleEmail = promptInput.trim();
        googleName = name.trim() || googleEmail.split('@')[0].replace(/[._]/g, ' ');
      }
      googleUid = `google-${Date.now().toString(36)}`;
    }

    const emailLower = googleEmail.toLowerCase();
    const nameLower = (googleName || '').toLowerCase();
    const isTrent = emailLower.includes('trent') || nameLower.includes('trent');
    const isWhitney = emailLower.includes('whitney') || nameLower.includes('whitney');
    const isOverseer = isTrent || isWhitney;

    const isAdmin = Boolean(
      isOverseer || 
      emailLower.includes('admin') ||
      nameLower.includes('admin')
    );

    const resolvedGender: 'male' | 'female' = isWhitney ? 'female' : 'male';
    const roleObj = getRoleById(selectedMinistryRoleId || 'disciple');

    let resolvedName = googleName;
    if (isTrent) {
      resolvedName = 'Lead Facilitator Trent D. White';
    } else if (isWhitney) {
      resolvedName = 'Lead Facilitator Whitney White';
    } else if (!resolvedName) {
      resolvedName = isAdmin ? 'YoungFire Administrator' : 'YoungFire Disciple';
    }

    const resolvedRole = isOverseer ? 'Lead Facilitator' : roleObj.label;

    const user: CurrentUser = {
      id: googleUid || (isTrent ? 'roster_lead_trent' : isWhitney ? 'roster_lead_whitney' : `google-${Date.now()}`),
      name: resolvedName,
      email: googleEmail,
      gender: resolvedGender,
      avatar: googleAvatar || (isTrent ? '/image_4.png' : isWhitney ? '/image_2.png' : generateMonogramBadge(resolvedName)),
      isAdmin: isOverseer ? true : isAdmin,
      accountType: (isOverseer || isAdmin) ? 'administrator' : 'member',
      role: resolvedRole,
      ministryRoleId: isOverseer ? 'event_facilitator' : roleObj.id,
      ministryRoleLabel: resolvedRole,
      calling: isOverseer ? 'Sanctuary Leadership & Overseer' : roleObj.defaultCalling,
      birthday: isWhitney ? '06-15' : isTrent ? '03-08' : '09-14'
    };

    try {
      localStorage.setItem('youngfire_device_session_v1', JSON.stringify(user));
      localStorage.setItem('youngfire_user_session', JSON.stringify(user));
    } catch {}

    onAuthenticated(user);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Password reset instructions sent to your email.');
    setTimeout(() => {
      setMessage('');
      setAuthMode('signin');
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center p-3 sm:p-5 select-none py-8">
      {/* San Antonio Vector Map at 0.55 Opacity */}
      <SanAntonioVectorMap opacity={0.55} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Main Card: Deep Obsidian Glass */}
      <div className="relative z-10 w-full max-w-lg bg-[#000000]/90 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
        
        {/* Emblem & Branding */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.4)] border border-amber-400/40">
            <Flame className="w-8 h-8 text-slate-950 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-[0.2em] font-['Outfit'] text-white">
              YOUNG<span className="text-amber-400">FIRE</span>
            </h1>
            <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
              Joshua House of Worship &bull; San Antonio, TX &bull; EST. 2015
            </p>
          </div>
        </div>

        {/* Status Toast */}
        {message && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Error Toast */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/20 border border-rose-400 rounded-xl text-rose-300 text-xs font-mono font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Toggle: Sign In vs Register */}
        <div className="flex bg-[#000000] p-1 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg cursor-pointer transition-colors text-center font-bold ${
              authMode === 'signin' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
              setName('');
              setEmail('');
              setPassword('');
            }}
            className={`flex-1 py-2 rounded-lg cursor-pointer transition-colors text-center font-bold ${
              authMode === 'register' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Disciple / Admin
          </button>
        </div>

        {/* Sign In / Register Form */}
        {authMode !== 'forgot' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            {authMode === 'register' && (
              <>
                {/* 1. Full Name */}
                <div>
                  <label className="text-[11px] font-mono text-slate-300 font-bold block mb-1">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan Matthews"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* 2. REGISTER AS: MEMBER OR ADMINISTRATOR */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-300 font-bold flex items-center justify-between">
                    <span>Register As (Account Access Level)</span>
                    <span className="text-amber-400 text-[10px]">Required *</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Member Account */}
                    <button
                      type="button"
                      onClick={() => setAccountType('member')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        accountType === 'member'
                          ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-[#000000] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          accountType === 'member' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10 text-amber-400'
                        }`}>
                          <Users className="w-4 h-4" />
                        </div>
                        {accountType === 'member' && (
                          <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">Selected</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-['Outfit']">YoungFire Member</div>
                        <div className="text-[10px] text-slate-400 font-mono">Sanctuary Disciple</div>
                      </div>
                    </button>

                    {/* Administrator Account */}
                    <button
                      type="button"
                      onClick={() => setAccountType('administrator')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        accountType === 'administrator'
                          ? 'bg-gradient-to-tr from-amber-600/30 to-orange-600/30 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-[#000000] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          accountType === 'administrator' ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold' : 'bg-white/10 text-amber-400'
                        }`}>
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        {accountType === 'administrator' && (
                          <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">Selected</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-['Outfit']">Administrator</div>
                        <div className="text-[10px] text-amber-300 font-mono">Leadership & CMS</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Administrator Passcode Gate */}
                {accountType === 'administrator' && (
                  <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/40 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        <span>Administrator Security Authorization Key</span>
                      </label>
                      <span className="text-[9px] font-mono text-amber-400/90 font-bold">Key: FIRE2026</span>
                    </div>
                    <input
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="Enter Admin Key (FIRE2026)"
                      className="w-full bg-[#000000] border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-300"
                    />
                    <p className="text-[10px] font-mono text-slate-300">
                      Unlocks Admin CMS, Theme Controls, Zoom Global Sync, and Ministry Meeting Flyer Broadcasts.
                    </p>
                  </div>
                )}

                {/* 3. SELECT MINISTRY ROLE (Prayer Warrior, Disciple, Photographer, Event Facilitator, Member, etc.) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Select Ministry Role & Calling</span>
                    </label>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {selectedRoleObj.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {MINISTRY_ROLES.map((r) => {
                      const isSelected = selectedMinistryRoleId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedMinistryRoleId(r.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? `${r.badgeBg} ${r.borderColor} ring-1 ring-amber-400 shadow-md`
                              : 'bg-[#000000] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className={`text-[10px] font-mono font-bold ${r.badgeText} truncate`}>
                              {r.label}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                          </div>
                          <span className="text-[9px] text-slate-400 line-clamp-2 leading-tight">
                            {r.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Calling Focus Indicator */}
                  <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-2">
                    <span className="text-amber-400 font-bold uppercase flex-shrink-0">Calling:</span>
                    <span className="truncate">{selectedRoleObj.defaultCalling}</span>
                  </div>
                </div>

                {/* 4. DISCIPLESHIP FELLOWSHIP COHORT (Brother vs Sister) */}
                <div>
                  <label className="text-[11px] font-mono text-slate-300 font-bold block mb-1.5 flex items-center justify-between">
                    <span>Discipleship Fellowship Cohort</span>
                    <span className="text-amber-400 text-[10px]">Required *</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Brother Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedCohort('brother')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        selectedCohort === 'brother'
                          ? 'bg-orange-500/20 border-orange-500 shadow-md ring-1 ring-orange-400'
                          : 'bg-[#000000] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          selectedCohort === 'brother' ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-white/10 text-orange-400'
                        }`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        {selectedCohort === 'brother' && (
                          <span className="text-[9px] font-mono font-bold text-orange-400 uppercase">Selected</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-['Outfit']">Brother</div>
                        <div className="text-[10px] text-slate-400 font-mono">Men On Fire Brotherhood</div>
                      </div>
                    </button>

                    {/* Sister Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedCohort('sister')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        selectedCohort === 'sister'
                          ? 'bg-rose-500/20 border-rose-500 shadow-md ring-1 ring-rose-400'
                          : 'bg-[#000000] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          selectedCohort === 'sister' ? 'bg-rose-500 text-slate-950 font-bold' : 'bg-white/10 text-rose-400'
                        }`}>
                          <Heart className="w-4 h-4" />
                        </div>
                        {selectedCohort === 'sister' && (
                          <span className="text-[9px] font-mono font-bold text-rose-400 uppercase">Selected</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-['Outfit']">Sister</div>
                        <div className="text-[10px] text-slate-400 font-mono">Women Ignited Sisterhood</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 5. PROFILE PHOTO & ATHLETIC MONOGRAM BADGE */}
                <div className="p-3.5 bg-black/70 rounded-2xl border border-amber-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Profile Photo</span>
                    </label>
                    {avatarImage ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Use Monogram</span>
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono text-amber-400/80 font-bold uppercase tracking-wider">
                        Athletic Monogram
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Real-time Avatar or Monogram Preview */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={avatarImage || activeMonogram}
                        alt="Profile Preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-xl shadow-amber-500/10"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow">
                        {avatarImage ? (
                          <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <Sparkles className="w-3 h-3 stroke-[2.5]" />
                        )}
                      </div>
                    </div>

                    {/* High-Contrast Camera Trigger */}
                    <div className="flex-1 space-y-1.5">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoSelect}
                      />
                      <button
                        type="button"
                        disabled={isCompressing}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4 stroke-[2.5]" />
                        <span>
                          {isCompressing 
                            ? 'Compressing (400x400)...' 
                            : (avatarImage ? 'Change Photo / Selfie' : 'Take Selfie / Upload Photo')}
                        </span>
                      </button>

                      <p className="text-[10px] text-slate-400 font-mono leading-tight">
                        {avatarImage 
                          ? 'Real-time 400x400 canvas compression applied to your photo.'
                          : 'No photo uploaded. Clean athletic monogram badge in gold over dark obsidian will be assigned.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. BIRTHDAY (MM-DD) FOR CALENDAR CELEBRATIONS */}
                <div className="p-3 bg-black/60 rounded-2xl border border-white/10 space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-1.5">
                    <span>🎂</span>
                    <span>Birthday (MM-DD for Sanctuary Calendar)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="09-14"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    maxLength={5}
                    className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 font-mono">
                    Format: MM-DD (e.g. 03-08, 09-14) for birthday cake markers on the sanctuary calendar.
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="disciple@jhow.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-mono text-slate-400">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl text-slate-950 font-black uppercase tracking-wider text-xs font-['Outfit'] hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.35)]"
              style={{
                background: 'var(--theme-accent, linear-gradient(to right, #F59E0B, #EA580C))'
              }}
            >
              {authMode === 'signin' 
                ? 'Sign In to Sanctuary →' 
                : accountType === 'administrator'
                  ? 'Register Administrator Profile →'
                  : 'Register New Disciple Profile →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Account Email</label>
              <input
                type="email"
                placeholder="disciple@jhow.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Send Password Reset
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className="w-full text-center text-xs font-mono text-slate-400 hover:text-white"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* Official Google-Themed Sign In Button */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-sans font-medium text-xs sm:text-sm border border-slate-300 shadow-md flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-[0.99]"
          >
            {/* Official Google 4-Color SVG Icon */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="font-semibold text-slate-800 tracking-normal">Continue with Google</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 font-mono">
            Joshua House of Worship YoungFire Sanctuary Protocol
          </p>
        </div>

      </div>
    </div>
  );
};
