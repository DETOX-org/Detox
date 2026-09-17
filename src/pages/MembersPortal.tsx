import React, { useState } from 'react';
import { PageContainer, SectionHeader, DossierCard } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { KeyRound, ArrowRight, BookOpen, Hammer, GitPullRequest, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';
import { Link } from '../router';
import { useCms } from '../cms/CmsContext';

export const MembersPortal: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { currentUser, currentRole, users, switchUser, projects } = useCms();

  const [memberHandle, setMemberHandle] = useState<string>('arjun.m@detox.build');
  const [accessKey, setAccessKey] = useState<string>('DTX-ALPHA-9060');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find((u) => u.email.toLowerCase() === memberHandle.toLowerCase());
    if (!foundUser) {
      setAuthError('No member account found with this electronic mail handle.');
      return;
    }
    setAuthError(null);
    switchUser(foundUser);
  };

  const activeUser = currentUser || null;

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        docId="DTX-INT-000"
        categoryTag="INTERNAL ECOSYSTEM GATEWAY"
        title="The DETOX Member Environment."
        lead="Welcome to the internal student ecosystem. This gateway connects active builders into their profiles, lab tracks, code review pipelines, and working group benches."
        statusText="CLEARANCE: MEMBER RESTRICTED"
      />

      {/* Architecture Visualizer Diagram (The requested flow: LEARN / BUILD / CONTRIBUTE -> GROW -> COMMUNITY) */}
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
      {!activeUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          <div className="lg:col-span-5 space-y-4">
            <h3 className={`text-xl sm:text-2xl font-bold font-sans ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              Member Console Authentication
            </h3>
            <p className={`font-sans text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
              Access to hardware bench schedules, internal pull requests, and working group repositories requires member verification.
            </p>
            <div
              className={`p-4 rounded-xs border font-mono text-[11px] space-y-2 transition-colors ${
                isLight ? 'bg-[#faf8f5] border-zinc-300 text-zinc-800' : 'bg-[#14161a] border-zinc-800 text-zinc-300'
              }`}
            >
              <div className="text-[#235347] font-bold">// INSTANT DEMO ACCESS:</div>
              <div className="space-y-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u)}
                    className="w-full text-left p-1.5 rounded-2xs hover:bg-zinc-500/10 flex items-center justify-between"
                  >
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-[9px] text-zinc-500">{u.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <DossierCard clipLabel="AUTH // KEYCARD PROMPT" className="p-6 sm:p-8 font-mono">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Member Handle / Electronic Mail:
                  </label>
                  <input
                    type="text"
                    value={memberHandle}
                    onChange={(e) => setMemberHandle(e.target.value)}
                    className={`w-full p-2.5 rounded-xs border text-xs font-mono transition-colors ${
                      isLight
                        ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-950 focus:border-[#235347]'
                        : 'bg-[#0e0f12] border-zinc-800 text-zinc-100 focus:border-[#235347]'
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                    Laboratory Access Key:
                  </label>
                  <input
                    type="text"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className={`w-full p-2.5 rounded-xs border text-xs font-mono transition-colors ${
                      isLight
                        ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-950 focus:border-[#235347]'
                        : 'bg-[#0e0f12] border-zinc-800 text-zinc-100 focus:border-[#235347]'
                    } focus:outline-none`}
                  />
                </div>

                {authError && (
                  <div className="text-[10px] text-[#F3C3B2] font-semibold">
                    [ERROR]: {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#163B32] hover:bg-[#235347] text-white font-mono text-xs font-bold rounded-xs tracking-wider transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <KeyRound size={13} />
                  <span>INITIALIZE WORKBENCH CONSOLE</span>
                </button>
              </form>
            </DossierCard>
          </div>
        </div>
      ) : (
        /* Authenticated Member Dashboard Environment */
        <div className="space-y-8 mb-20">
          <DossierCard
            clipLabel={`ACTIVE SESSION // ${activeUser.name.toUpperCase()} (${currentRole?.name.toUpperCase() || 'MEMBER'})`}
            className="p-6 sm:p-8 font-mono"
          >
            <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-6 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xs bg-[#235347] text-white flex items-center justify-center font-bold text-xs">
                  {activeUser.avatarInitials}
                </div>
                <div>
                  <div className="text-sm font-bold font-sans">
                    {activeUser.name}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    EMAIL: {activeUser.email} // ROLE: {currentRole?.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#235347] animate-pulse" />
                <span className="text-[10px] text-[#235347] font-bold">SESSION ACTIVE</span>

                {currentRole?.permissions.includes('*') || currentRole?.id.includes('admin') ? (
                  <Link
                    to="/admin"
                    className="ml-2 px-2.5 py-1 bg-[#163B32] text-white text-[10px] font-bold rounded-xs flex items-center gap-1"
                  >
                    <ShieldAlert size={11} />
                    <span>LAUNCH CONTROL ROOM</span>
                  </Link>
                ) : null}

                <button
                  onClick={() => switchUser(null)}
                  className="ml-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-[9px] hover:bg-zinc-700 rounded-xs"
                >
                  DISCONNECT
                </button>
              </div>
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
