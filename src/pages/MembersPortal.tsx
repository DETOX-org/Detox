import React, { useState } from 'react';
import { PageContainer, SectionHeader, DossierCard } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { KeyRound, ArrowRight, BookOpen, Hammer, GitPullRequest, TrendingUp, CheckCircle, ShieldAlert, User, UserPlus, LogOut, Edit3, Save, Check, AlertTriangle } from 'lucide-react';
import { Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { useAuth } from '../context/AuthContext';

export const MembersPortal: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { projects } = useCms();
  const { user, profile, role, isAdmin, isConfigured, signIn, signUp, signOut, updateProfile } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const handleStartEdit = () => {
    if (!profile) return;
    setEditName(profile.name || '');
    setEditBio(profile.bio || '');
    setEditSkills((profile.skills || []).join(', '));
    setIsEditingProfile(true);
    setProfileSaveSuccess(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    const skillsArr = editSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await updateProfile({
      name: editName,
      bio: editBio,
      skills: skillsArr,
    });

    setProfileSaving(false);
    if (!res.error) {
      setProfileSaveSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } else {
      alert(`Failed to save profile: ${res.error.message}`);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'signin') {
        const res = await signIn(email, password);
        if (res.error) {
          setAuthError(res.error.message);
        }
      } else {
        if (!name.trim()) {
          setAuthError('Please provide your builder name.');
          setIsSubmitting(false);
          return;
        }
        const res = await signUp(email, password, name, username);
        if (res.error) {
          setAuthError(res.error.message);
        } else {
          setAuthSuccess('Account registered successfully! If email confirmation is enabled on Supabase, check your inbox.');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        docId="DTX-INT-000"
        categoryTag="INTERNAL ECOSYSTEM GATEWAY"
        title="The DETOX Member Environment."
        lead="Welcome to the internal student ecosystem. This gateway connects active builders into their profiles, lab tracks, code review pipelines, and working group benches."
        statusText={`CLEARANCE: ${user ? (role?.toUpperCase() || 'MEMBER') : 'PUBLIC VISITOR'}`}
      />

      {/* Architecture Visualizer Diagram */}
      <div className="mb-14">
        <div className="border-b pb-4 mb-6 flex flex-wrap items-center justify-between font-mono text-xs gap-2">
          <span className="text-[#235347] font-bold">// 01. INTERNAL ECOSYSTEM TOPOLOGY</span>
          <span className="text-zinc-500 text-[10px]">RECURSIVE GROWTH TOPOLOGY</span>
        </div>

        <DossierCard clipLabel="SYSTEM MAP // DTX-FLOW-V2" className="p-6 sm:p-8 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input Tridents */}
            <div className="md:col-span-4 space-y-3">
              <div
                className={`p-3 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-900' : 'bg-[#0e0f12] border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 text-[#235347] font-bold text-xs">
                  <BookOpen size={14} />
                  <span>01. LEARN</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-sans mt-0.5">
                  Paper deconstruction, memory consistency specs, theory.
                </div>
              </div>

              <div
                className={`p-3 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-900' : 'bg-[#0e0f12] border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 text-[#235347] font-bold text-xs">
                  <Hammer size={14} />
                  <span>02. BUILD</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-sans mt-0.5">
                  KiCad copper routing, microkernel routines, FPGA synthesis.
                </div>
              </div>

              <div
                className={`p-3 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-900' : 'bg-[#0e0f12] border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 text-[#235347] font-bold text-xs">
                  <GitPullRequest size={14} />
                  <span>03. CONTRIBUTE</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-sans mt-0.5">
                  Rigorous peer code review, bug reproduction, open patches.
                </div>
              </div>
            </div>

            {/* Middle Confluence Arrow */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
                <span className="h-px w-8 bg-zinc-600 hidden md:block" />
                <span className="text-[#235347] font-bold text-[11px]">CONVERGENCE</span>
                <span className="h-px w-8 bg-zinc-600 hidden md:block" />
              </div>

              <div
                className={`w-full p-4 rounded-xs border text-center transition-colors ${
                  isLight ? 'bg-[#faf8f5] border-[#235347] shadow-sm' : 'bg-[#163B32]/30 border-[#235347] shadow-md'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-[#235347] font-bold text-sm">
                  <TrendingUp size={16} />
                  <span>GROW</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-sans mt-1">
                  System intuition & technical leadership.
                </div>
              </div>
            </div>

            {/* Final Target: Community */}
            <div className="md:col-span-4 flex flex-col justify-center">
              <div
                className={`p-4 rounded-xs border text-center transition-colors ${
                  isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-[#235347] font-bold text-sm">
                  <CheckCircle size={16} />
                  <span>COMMUNITY</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-sans mt-1">
                  Self-sustaining student sanctuary feeding back into Learn.
                </div>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-1 text-[10px] text-[#235347] font-bold hover:underline mt-2"
                >
                  <span>view public loop</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        </DossierCard>
      </div>

      {/* Authentication / Dashboard Section */}
      {!user ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          <div className="lg:col-span-5 space-y-4">
            <h3 className={`text-xl sm:text-2xl font-bold font-sans ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              Supabase Member Console
            </h3>
            <p className={`font-sans text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
              Access to hardware bench reservations, peer pull requests, and internal working group repositories is secured by genuine Supabase Authentication and database Row Level Security.
            </p>

            <div
              className={`p-4 rounded-xs border font-mono text-[11px] space-y-2 transition-colors ${
                isLight ? 'bg-[#faf8f5] border-zinc-300 text-zinc-800' : 'bg-[#14161a] border-zinc-800 text-zinc-300'
              }`}
            >
              <div className="text-[#235347] font-bold">// AUTHENTICATION DISCIPLINE:</div>
              <ul className="list-disc list-inside space-y-1 text-[10px] text-zinc-500">
                <li>Server-side RLS enforcement active</li>
                <li>New accounts default to Member role</li>
                <li>Roles managed exclusively by database policies</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <DossierCard clipLabel={`AUTH // ${authMode === 'signin' ? 'MEMBER SIGN IN' : 'NEW BUILDER REGISTRATION'}`} className="p-6 sm:p-8 font-mono">
              {/* Tab Switcher */}
              <div className="flex border-b mb-6 pb-2 gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError(null);
                  }}
                  className={`pb-2 border-b-2 transition-colors ${
                    authMode === 'signin'
                      ? 'border-[#235347] text-[#235347]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError(null);
                  }}
                  className={`pb-2 border-b-2 transition-colors ${
                    authMode === 'signup'
                      ? 'border-[#235347] text-[#235347]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  REGISTER ACCOUNT
                </button>
              </div>

              {!isConfigured && (
                <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <AlertTriangle size={15} />
                    <span>SUPABASE CREDENTIALS REQUIRED</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-normal">
                    The backend connection key (<code className="font-mono text-amber-300 font-bold">VITE_SUPABASE_ANON_KEY</code>) is not yet set in the environment.
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-[10px] space-y-1 font-mono text-zinc-400">
                    <div>1. Open <a href="https://supabase.com/dashboard/project/hesflcaaupmphtorfqij/settings/api" target="_blank" rel="noreferrer" className="text-amber-400 underline">Supabase API Settings</a></div>
                    <div>2. Copy the <strong>anon public</strong> key</div>
                    <div>3. Add to Vercel (<code className="text-zinc-200">Settings &gt; Environment Variables</code>) or <code className="text-zinc-200">.env.local</code></div>
                    <div>4. Redeploy to activate live authentication</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Full Name:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Arjun Mehta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-2.5 rounded-xs border text-xs font-mono transition-colors ${
                          isLight
                            ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-950 focus:border-[#235347]'
                            : 'bg-[#0e0f12] border-zinc-800 text-zinc-100 focus:border-[#235347]'
                        } focus:outline-none`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Builder Username (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. arjun_m"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full p-2.5 rounded-xs border text-xs font-mono transition-colors ${
                          isLight
                            ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-950 focus:border-[#235347]'
                            : 'bg-[#0e0f12] border-zinc-800 text-zinc-100 focus:border-[#235347]'
                        } focus:outline-none`}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Electronic Mail:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="builder@detox.build"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2.5 rounded-xs border text-xs font-mono transition-colors ${
                      isLight
                        ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-950 focus:border-[#235347]'
                        : 'bg-[#0e0f12] border-zinc-800 text-zinc-100 focus:border-[#235347]'
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-2.5 rounded-xs border text-xs font-mono transition-colors ${
                      isLight
                        ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-950 focus:border-[#235347]'
                        : 'bg-[#0e0f12] border-zinc-800 text-zinc-100 focus:border-[#235347]'
                    } focus:outline-none`}
                  />
                </div>

                {authError && (
                  <div className="text-[11px] text-red-500 font-semibold p-2.5 rounded-xs bg-red-500/10 border border-red-500/30">
                    [ERROR]: {authError}
                  </div>
                )}

                {authSuccess && (
                  <div className="text-[11px] text-emerald-500 font-semibold p-2.5 rounded-xs bg-emerald-500/10 border border-emerald-500/30">
                    [SUCCESS]: {authSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#163B32] hover:bg-[#235347] disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xs tracking-wider transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm"
                >
                  {authMode === 'signin' ? (
                    <>
                      <KeyRound size={13} />
                      <span>{isSubmitting ? 'AUTHENTICATING...' : 'INITIALIZE WORKBENCH CONSOLE'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} />
                      <span>{isSubmitting ? 'REGISTERING...' : 'CREATE MEMBER ACCOUNT'}</span>
                    </>
                  )}
                </button>
              </form>
            </DossierCard>
          </div>
        </div>
      ) : (
        /* Authenticated Member Dashboard Environment */
        <div className="space-y-8 mb-20">
          <DossierCard
            clipLabel={`ACTIVE SESSION // ${(profile?.name || user.email || 'MEMBER').toUpperCase()} (${role?.toUpperCase() || 'MEMBER'})`}
            className="p-6 sm:p-8 font-mono"
          >
            <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-6 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-[#235347] text-white flex items-center justify-center font-bold text-sm">
                  {profile?.name
                    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold font-sans">
                    {profile?.name || user.email}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    EMAIL: {user.email} // ROLE: {role?.toUpperCase()} // STATUS: {profile?.status || 'ACTIVE'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-[#235347] font-bold">SESSION ACTIVE</span>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="ml-2 px-2.5 py-1 bg-[#163B32] hover:bg-[#235347] text-white text-[10px] font-bold rounded-xs flex items-center gap-1 transition-colors"
                  >
                    <ShieldAlert size={11} />
                    <span>LAUNCH CONTROL ROOM</span>
                  </Link>
                )}

                <button
                  onClick={() => signOut()}
                  className="ml-2 px-2.5 py-1 bg-zinc-800 text-zinc-300 text-[10px] hover:bg-zinc-700 rounded-xs flex items-center gap-1"
                >
                  <LogOut size={11} />
                  <span>DISCONNECT</span>
                </button>
              </div>
            </div>

            {/* Profile Info & Edit Panel */}
            <div className={`p-4 rounded-xs border mb-6 ${isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'}`}>
              <div className="flex items-center justify-between border-b pb-2 mb-3">
                <span className="text-xs font-bold text-[#235347] flex items-center gap-1.5">
                  <User size={13} />
                  <span>MEMBER DOSSIER & PROFILE (PERSISTED IN SUPABASE)</span>
                </span>
                {!isEditingProfile ? (
                  <button
                    onClick={handleStartEdit}
                    className="px-2 py-1 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs text-[10px] font-bold flex items-center gap-1"
                  >
                    <Edit3 size={11} />
                    <span>EDIT PROFILE</span>
                  </button>
                ) : null}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase mb-1">Display Name:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full p-2 rounded-xs border text-xs ${isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'} focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase mb-1">Biography / Research Focus:</label>
                    <textarea
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className={`w-full p-2 rounded-xs border text-xs ${isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'} focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase mb-1">Technical Disciplines & Skills (comma separated):</label>
                    <input
                      type="text"
                      placeholder="e.g. CUDA, C11, PCB Layout, eBPF"
                      value={editSkills}
                      onChange={(e) => setEditSkills(e.target.value)}
                      className={`w-full p-2 rounded-xs border text-xs ${isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'} focus:outline-none`}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white font-bold rounded-xs flex items-center gap-1"
                    >
                      <Save size={12} />
                      <span>{profileSaving ? 'SAVING TO SUPABASE...' : 'SAVE CHANGES'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 bg-zinc-700 text-zinc-200 font-bold rounded-xs"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">USERNAME:</span>
                      <span className="font-semibold">{profile?.username || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">JOINED DATE:</span>
                      <span className="font-semibold">{profile?.created_at ? profile.created_at.split('T')[0] : '2026-01-01'}</span>
                    </div>
                  </div>

                  {profile?.bio && (
                    <div className="pt-2">
                      <span className="text-[10px] text-zinc-500 block">BIOGRAPHY:</span>
                      <p className="font-sans text-xs text-zinc-400 mt-0.5">{profile.bio}</p>
                    </div>
                  )}

                  {profile?.skills && profile.skills.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-zinc-500 block mb-1">SPECIALIZATIONS:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-2xs bg-[#235347]/15 text-[#235347] dark:text-[#99CDD8] text-[10px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profileSaveSuccess && (
                    <div className="text-emerald-500 text-[10px] flex items-center gap-1 font-bold pt-2">
                      <Check size={12} />
                      <span>Profile updated in Supabase successfully.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dashboard Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Module 1: Learn */}
              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
                  <span>TRACK 01</span>
                  <BookOpen size={13} className="text-[#235347]" />
                </div>
                <div className="text-xs font-bold font-sans mb-1">
                  LEARN: CURRENT PAPER
                </div>
                <div className="text-[11px] text-zinc-400 font-sans mb-3">
                  Dao et al. FlashAttention-2 Block Tiling.
                </div>
                <div className="text-[9px] text-[#235347] font-semibold">
                  STATUS: REVIEW NOTES PUBLISHED
                </div>
              </div>

              {/* Module 2: Build */}
              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
                  <span>TRACK 02</span>
                  <Hammer size={13} className="text-[#235347]" />
                </div>
                <div className="text-xs font-bold font-sans mb-1">
                  BUILD: ACTIVE COMMITS
                </div>
                <div className="text-[11px] text-zinc-400 font-sans mb-3">
                  {projects[0]?.title || 'detox-os kernel IPC'}
                </div>
                <div className="text-[9px] text-[#235347] font-semibold">
                  BENCH: 31.8ns IPC PASSING
                </div>
              </div>

              {/* Module 3: Contribute */}
              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
                  <span>TRACK 03</span>
                  <GitPullRequest size={13} className="text-[#235347]" />
                </div>
                <div className="text-xs font-bold font-sans mb-1">
                  CONTRIBUTE: REVIEWS
                </div>
                <div className="text-[11px] text-zinc-400 font-sans mb-3">
                  PR #18: wire-sniff eBPF packet hook
                </div>
                <div className="text-[9px] text-[#F3C3B2] font-semibold">
                  ACTION: 2 COMMENTS PENDING
                </div>
              </div>

              {/* Module 4: Grow */}
              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
                  <span>TRACK 04</span>
                  <TrendingUp size={13} className="text-[#235347]" />
                </div>
                <div className="text-xs font-bold font-sans mb-1">
                  GROW: MENTORSHIP
                </div>
                <div className="text-[11px] text-zinc-400 font-sans mb-3">
                  Pairing with junior builders on SMT bring-up.
                </div>
                <div className="text-[9px] text-[#235347] font-semibold">
                  BENCH: LAB 2, BENCH 4 ALLOCATED
                </div>
              </div>
            </div>

            {/* Upcoming Hardware Bench Schedule */}
            <div className="border-t pt-4 border-zinc-700/40 text-xs">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
                <span>LAB BENCH RESERVATIONS (HARDWARE LAB 2):</span>
                <span>CONFIRMED SLOTS: 4</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className={`flex justify-between items-center p-2 rounded-xs border ${isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'}`}>
                  <span>Bench A2: Rigol DS1054Z Oscilloscope + Solder Station</span>
                  <span className="text-[#235347] font-bold">THU 18:00 - 22:00</span>
                </div>
                <div className={`flex justify-between items-center p-2 rounded-xs border ${isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#0e0f12] border-zinc-800'}`}>
                  <span>Bench B1: Logic Analyzer & STM32 JTAG Debug Rig</span>
                  <span className="text-[#235347] font-bold">SAT 14:00 - 20:00</span>
                </div>
              </div>
            </div>
          </DossierCard>
        </div>
      )}
    </PageContainer>
  );
};

