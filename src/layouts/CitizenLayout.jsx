import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck, Home, Plus, List, Bell, User, LogOut,
  ChevronDown, Menu, X, Sun, Moon
} from 'lucide-react';

export default function CitizenLayout() {
  const { currentUser, logout, notifications, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/citizen/dashboard', icon: Home, label: 'Home Feed' },
    { to: '/citizen/report', icon: Plus, label: 'Report Issue' },
    { to: '/citizen/my-complaints', icon: List, label: 'My Complaints' },
    { to: '/citizen/notifications', icon: Bell, label: 'Notifications', badge: unread },
    { to: '/citizen/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <NavLink to="/citizen/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="text-emerald-400 w-4 h-4" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-extrabold text-slate-900 font-heading tracking-tight">Jan Sanket</span>
              <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Citizen</span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl">
            {navLinks.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`
                }
              >
                <Icon size={15} />
                {label}
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center shadow">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Profile & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                theme === 'light'
                  ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {theme === 'light' ? <Moon size={16} className="text-slate-700" /> : <Sun size={16} className="text-amber-400" />}
              <span className="hidden sm:inline text-xs font-bold">{theme === 'light' ? '🌙 Dark' : '☀️ Light'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:border-slate-700 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  {currentUser?.name?.[0]?.toUpperCase() || 'C'}
                </div>
                <span className="hidden sm:block max-w-[100px] truncate">{currentUser?.name}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-panel border border-slate-700 bg-slate-950 p-2 rounded-xl shadow-2xl z-50">
                  <NavLink to="/citizen/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 transition-colors">
                    <User size={15} className="text-slate-400" /> Profile
                  </NavLink>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-slate-800 transition-colors">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
            {navLinks.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon size={16} />
                {label}
                {badge > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">{badge}</span>}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-slate-900 transition-all">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-600">
        Jan Sanket — AI-Assisted Civic Resolution & Governance Platform © 2026
      </footer>
    </div>
  );
}
