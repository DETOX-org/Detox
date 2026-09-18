import React, { useState } from 'react';
import { PageContainer } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { 
  KeyRound, 
  ArrowRight, 
  CheckCircle, 
  ShieldAlert, 
  User, 
  UserPlus, 
  LogOut, 
  Edit3, 
  Save, 
  Check, 
  AlertTriangle, 
  Lock,
  Layers,
  Calendar,
  Users
} from 'lucide-react';
import { Link } from '../router';
import { useAuth } from '../context/AuthContext';

export const MembersPortal: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { user, profile, role, isAdmin, isSuperAdmin, isConfigured, signIn, signUp, signOut, updateProfile } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
    setEditName(profile?.name || user?.email?.split('@')[0] || '');
    setEditBio(profile?.bio || '');
    setEditSkills((profile?.skills || []).join(', '));
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
        const res = await signUp(email, password, name);
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

  const userInitials = (profile?.name || user?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const roleLabel = role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Member';

  return (
    <PageContainer maxWidth="5xl">
      {!user ? (
        /* ================= UNAUTHENTICATED: CLEAN SIGN IN / SIGN UP ================= */
        <div className="py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-4xl mx-auto">
            {/* Left Column: Friendly Welcome Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8]">
                <Lock size={13} />
                <span>DETOX PORTAL</span>
              </div>
              
              <div className="space-y-3">
                <h1 className={`text-3xl sm:text-4xl font-bold font-sans tracking-tight ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                  Welcome to DETOX
                </h1>
                <p className={`font-sans text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  Sign in or create an account to access project collaboration, community showcases, and developer workspaces.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border text-xs space-y-3 ${isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-700' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'}`}>
                <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={15} />
                  <span>Member Privileges</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#235347]" />
                    <span>Manage your personal profile and showcase bio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#235347]" />
                    <span>Collaborate on student projects and research</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#235347]" />
                    <span>Access private working groups and events</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Clean Auth Card */}
            <div className="lg:col-span-7">
              <div className={`p-6 sm:p-8 rounded-2xl border shadow-xl transition-colors ${isLight ? 'bg-white border-zinc-200 shadow-zinc-200/50' : 'bg-[#121316] border-zinc-800 shadow-black/40'}`}>
                {/* Segmented Switcher */}
                <div className="flex p-1 mb-6 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-bold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-bold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {!isConfigured && (
                  <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <AlertTriangle size={15} />
                      <span>Supabase Connection Needed</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Set <code className="font-mono text-amber-300 font-bold">VITE_SUPABASE_ANON_KEY</code> in environment variables.
                    </p>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ekansh Gharde"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
                          isLight
                            ? 'bg-zinc-50 border-zinc-300 text-zinc-950 focus:bg-white focus:border-[#235347]'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-100 focus:bg-zinc-950 focus:border-[#235347]'
                        } focus:outline-none focus:ring-1 focus:ring-[#235347]`}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
                        isLight
                          ? 'bg-zinc-50 border-zinc-300 text-zinc-950 focus:bg-white focus:border-[#235347]'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-100 focus:bg-zinc-950 focus:border-[#235347]'
                      } focus:outline-none focus:ring-1 focus:ring-[#235347]`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
                        isLight
                          ? 'bg-zinc-50 border-zinc-300 text-zinc-950 focus:bg-white focus:border-[#235347]'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-100 focus:bg-zinc-950 focus:border-[#235347]'
                        } focus:outline-none focus:ring-1 focus:ring-[#235347]`}
                    />
                    {authMode === 'signup' && (
                      <p className="text-[11px] text-zinc-500 mt-1">Minimum 6 characters</p>
                    )}
                  </div>

                  {authError && (
                    <div className="text-xs text-red-500 font-medium p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      {authError}
                    </div>
                  )}

                  {authSuccess && (
                    <div className="text-xs text-emerald-500 font-medium p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      {authSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#163B32] hover:bg-[#235347] disabled:opacity-50 text-white text-sm font-semibold rounded-xl tracking-wide transition-all flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
                  >
                    {authMode === 'signin' ? (
                      <>
                        <KeyRound size={15} />
                        <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} />
                        <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Bottom Quick Switch Link */}
                <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-center text-xs text-zinc-500">
                  {authMode === 'signin' ? (
                    <span>
                      New to DETOX?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthError(null);
                        }}
                        className="text-[#235347] dark:text-[#99CDD8] font-bold hover:underline ml-1 cursor-pointer"
                      >
                        Create an account
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin');
                          setAuthError(null);
                        }}
                        className="text-[#235347] dark:text-[#99CDD8] font-bold hover:underline ml-1 cursor-pointer"
                      >
                        Sign in
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= AUTHENTICATED: CLEAN, MODERN PROFILE DASHBOARD ================= */
        <div className="py-8 md:py-12 space-y-8 max-w-4xl mx-auto">
          {/* Main User Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-colors ${
            isLight ? 'bg-white border-zinc-200 shadow-zinc-200/50' : 'bg-[#121316] border-zinc-800 shadow-black/40'
          }`}>
            {/* Top Bar: User Info + Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#163B32] text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {userInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold font-sans">
                      {profile?.name || user.email?.split('@')[0] || 'Member'}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      isSuperAdmin
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                        : isAdmin
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30'
                    }`}>
                      {roleLabel}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3.5 py-2 bg-[#163B32] hover:bg-[#235347] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShieldAlert size={14} />
                    <span>Control Room</span>
                  </Link>
                )}

                {!isEditingProfile && (
                  <button
                    onClick={handleStartEdit}
                    className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>Edit Profile</span>
                  </button>
                )}

                <button
                  onClick={() => signOut()}
                  className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 text-zinc-600 dark:text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="pt-6">
              {isEditingProfile ? (
                /* Edit Form */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="text-sm font-bold text-[#235347] dark:text-[#99CDD8] flex items-center gap-2 mb-2">
                    <User size={15} />
                    <span>Edit Profile Details</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                        isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-950' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      } focus:outline-none focus:ring-1 focus:ring-[#235347]`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                      About / Bio
                    </label>
                    <textarea
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell the community about your work, interests, or background..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                        isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-950' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      } focus:outline-none focus:ring-1 focus:ring-[#235347]`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Skills & Specializations (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editSkills}
                      onChange={(e) => setEditSkills(e.target.value)}
                      placeholder="e.g. React, Rust, Hardware, Machine Learning"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                        isLight ? 'bg-zinc-50 border-zinc-300 text-zinc-950' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      } focus:outline-none focus:ring-1 focus:ring-[#235347]`}
                    />
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-4 py-2 bg-[#163B32] hover:bg-[#235347] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save size={13} />
                      <span>{profileSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Display View */
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                      About
                    </span>
                    <p className={`text-sm leading-relaxed ${profile?.bio ? (isLight ? 'text-zinc-800' : 'text-zinc-200') : 'text-zinc-400 italic'}`}>
                      {profile?.bio || 'No bio added yet. Click "Edit Profile" to share your research, projects, or background.'}
                    </p>
                  </div>

                  {/* Skills */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
                        Skills & Disciplines
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8] border border-[#235347]/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profileSaveSuccess && (
                    <div className="text-emerald-500 text-xs flex items-center gap-1.5 font-semibold">
                      <Check size={14} />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Workspace Directory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/projects"
              className={`p-5 rounded-2xl border transition-all hover:border-[#235347] group ${
                isLight ? 'bg-white border-zinc-200 hover:shadow-md' : 'bg-[#121316] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8] flex items-center justify-center mb-3">
                <Layers size={18} />
              </div>
              <div className="text-sm font-bold flex items-center justify-between">
                <span>Explore Projects</span>
                <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                View student research, code repositories, and hardware builds.
              </p>
            </Link>

            <Link
              to="/events"
              className={`p-5 rounded-2xl border transition-all hover:border-[#235347] group ${
                isLight ? 'bg-white border-zinc-200 hover:shadow-md' : 'bg-[#121316] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8] flex items-center justify-center mb-3">
                <Calendar size={18} />
              </div>
              <div className="text-sm font-bold flex items-center justify-between">
                <span>Events & Salons</span>
                <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Join upcoming workshops, paper salons, and hackathons.
              </p>
            </Link>

            <Link
              to="/people"
              className={`p-5 rounded-2xl border transition-all hover:border-[#235347] group ${
                isLight ? 'bg-white border-zinc-200 hover:shadow-md' : 'bg-[#121316] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8] flex items-center justify-center mb-3">
                <Users size={18} />
              </div>
              <div className="text-sm font-bold flex items-center justify-between">
                <span>Minds Behind DETOX</span>
                <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Explore the builder collage and connect with team members.
              </p>
            </Link>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

