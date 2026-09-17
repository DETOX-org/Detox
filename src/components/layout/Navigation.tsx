import React, { useState } from 'react';
import { Menu, X, Sun, Moon, KeyRound, ShieldAlert, UserCheck, ChevronDown } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useRouter, Link, type RoutePath } from '../../router';
import { useCms } from '../../cms/CmsContext';

interface NavItem {
  name: string;
  path: RoutePath;
}

const navItems: NavItem[] = [
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Community', path: '/community' },
  { name: 'Events', path: '/events' },
  { name: 'Minds Behind DETOX', path: '/minds' },
  { name: 'Collaborate', path: '/collaborate' },
];

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionMenuOpen, setSessionMenuOpen] = useState(false);
  const { mode, toggleMode } = useTheme();
  const isLight = mode === 'light';
  const { path } = useRouter();
  const { currentUser, currentRole, users, switchUser } = useCms();

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between py-2.5 px-4 sm:px-6 rounded-full border pointer-events-auto transition-all duration-500 shadow-lg ${
          isLight
            ? 'border-zinc-200/80 bg-[#faf8f5]/90 backdrop-blur-xl text-zinc-900 shadow-zinc-200/50'
            : 'border-zinc-800/80 bg-[#111215]/90 backdrop-blur-xl text-zinc-100 shadow-black/40'
        }`}
      >
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span
            className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
            style={{ backgroundColor: '#235347' }}
          />
          <span className="font-display text-base sm:text-lg font-bold tracking-tight">
            DETOX
          </span>
          <span
            className={`hidden md:inline-block text-xs font-medium tracking-normal pl-2.5 border-l transition-colors duration-500 ${
              isLight ? 'text-zinc-500 border-zinc-300' : 'text-zinc-400 border-zinc-800'
            }`}
          >
            Student Engineering Collective
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-sans text-xs font-medium">
          {navItems.map((item) => {
            const isActive = path === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? 'bg-[#235347] text-white font-semibold shadow-xs'
                      : 'bg-[#235347] text-white font-semibold shadow-xs'
                    : isLight
                      ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools: Session Switcher + Members Portal + Admin Gateway + Theme */}
        <div className="flex items-center gap-2">
          {/* Interactive Role / Session Switcher */}
          <div className="relative">
            <button
              onClick={() => setSessionMenuOpen(!sessionMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                currentUser
                  ? 'bg-[#235347]/15 text-[#235347] border-[#235347]/40'
                  : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
              }`}
              title="Switch active user role for testing"
            >
              <UserCheck size={12} className={currentUser ? 'text-[#235347]' : 'text-zinc-500'} />
              <span className="hidden sm:inline">
                {currentUser ? `${currentUser.name.split(' ')[0]} (${currentRole?.name || 'Member'})` : 'Visitor'}
              </span>
              <ChevronDown size={11} />
            </button>

            {/* Session Switcher Dropdown */}
            {sessionMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 p-2 rounded-2xl border shadow-2xl z-50 text-xs ${
                  isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#181a20] border-zinc-800 text-zinc-100'
                }`}
              >
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1 border-b border-inherit mb-1">
                  Switch Role / Session:
                </div>
                <button
                  onClick={() => {
                    switchUser(null);
                    setSessionMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    !currentUser ? 'bg-[#235347] text-white font-semibold' : 'hover:bg-zinc-500/10'
                  }`}
                >
                  <span>Public Visitor</span>
                  <span className="text-[10px] opacity-70">View only</span>
                </button>
                {users.map((u) => {
                  const isSelected = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u);
                        setSessionMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-[#235347] text-white font-semibold' : 'hover:bg-zinc-500/10'
                      }`}
                    >
                      <span>{u.name}</span>
                      <span className="text-[10px] opacity-70">
                        {u.roleId === 'super_admin'
                          ? 'Super Admin'
                          : u.roleId === 'events_admin'
                          ? 'Events Admin'
                          : u.roleId === 'projects_admin'
                          ? 'Projects Admin'
                          : 'Member'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Members Ecosystem Button */}
          <Link
            to="/members"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              path === '/members'
                ? 'bg-[#235347] text-white border-[#235347]'
                : isLight
                ? 'bg-[#CFD6C4]/40 text-[#0B2B26] border-[#235347]/30 hover:bg-[#235347] hover:text-white'
                : 'bg-[#163B32]/40 text-[#99CDD8] border-[#235347]/60 hover:bg-[#235347] hover:text-white'
            }`}
            title="Enter Members Ecosystem"
          >
            <KeyRound size={12} />
            <span>Members</span>
          </Link>

          {/* Admin Command Center Link */}
          <Link
            to="/admin"
            className={`hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              path === '/admin'
                ? 'bg-[#235347] text-white border-[#235347]'
                : isLight
                ? 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-900 hover:text-white'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-white hover:text-zinc-950'
            }`}
            title="Admin & CMS Control Room"
          >
            <ShieldAlert size={12} />
            <span>Admin</span>
          </Link>

          {/* Mode Switcher Button */}
          <button
            onClick={toggleMode}
            className={`p-1.5 rounded-full transition-all duration-300 border ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? (
              <Moon size={14} className="text-[#235347]" />
            ) : (
              <Sun size={14} className="text-[#99CDD8]" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-1.5 rounded-full border transition-colors ${
              isLight
                ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                : 'bg-zinc-800 border-zinc-700 text-zinc-200'
            }`}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden mt-2 p-4 rounded-3xl border shadow-2xl text-sm pointer-events-auto transition-all duration-300 ${
            isLight
              ? 'bg-[#faf8f5]/95 backdrop-blur-xl border-zinc-200 text-zinc-900'
              : 'bg-[#14161a]/95 backdrop-blur-xl border-zinc-800 text-zinc-100'
          }`}
        >
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2 rounded-xl font-medium ${
                path === '/' ? 'bg-[#235347] text-white font-bold' : 'hover:bg-zinc-500/10'
              }`}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-xl font-medium ${
                  path === item.path ? 'bg-[#235347] text-white font-bold' : 'hover:bg-zinc-500/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-inherit flex gap-2">
              <Link
                to="/members"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#163B32] text-white font-semibold rounded-xl text-xs"
              >
                <KeyRound size={13} />
                <span>Members Portal</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-800 text-zinc-100 font-semibold rounded-xl text-xs"
              >
                <ShieldAlert size={13} />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
