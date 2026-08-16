import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck, LayoutDashboard, ClipboardList, Map, BarChart3,
  Bell, LogOut, ChevronLeft, ChevronRight, AlertTriangle, Menu, X, Sun, Moon
} from 'lucide-react';

export default function AdminLayout() {
  const { currentUser, logout, notifications, complaints, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const slaBreach = complaints.filter(c => c.slaBreached || c.slaHoursRemaining < 0).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/complaints', icon: ClipboardList, label: 'Complaint Management', badge: slaBreach, badgeColor: 'bg-red-500' },
    { to: '/admin/map', icon: Map, label: 'GIS Ward Map' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications', badge: unread, badgeColor: 'bg-emerald-500' },
  ];

  const SidebarContent = ({ collapsed }) => (
    <>
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-200 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md shadow-amber-500/20 shrink-0">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <ShieldCheck className="text-amber-400 w-4 h-4" />
          </div>
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-extrabold text-slate-900 font-heading">Jan Sanket</span>
            <div className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-0.5">Admin</div>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label, badge, badgeColor }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                isActive
                  ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
            {badge > 0 && (
              <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} w-5 h-5 rounded-full ${badgeColor} text-white text-[9px] font-extrabold flex items-center justify-center shadow`}>
                {badge}
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-xl">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className={`border-t border-slate-200 p-3 space-y-1 ${collapsed ? 'items-center flex flex-col' : ''}`}>
        {!collapsed && (
          <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 mb-2">
            <div className="text-[11px] text-slate-500">Logged in as</div>
            <div className="font-bold text-slate-900 text-sm truncate">{currentUser?.name}</div>
            <div className="text-[10px] text-amber-700 font-bold">Municipal Official</div>
          </div>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all w-full mb-1 ${
            theme === 'light'
              ? 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
          } ${collapsed ? 'justify-center' : ''}`}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={16} className="text-slate-700" /> : <Sun size={16} className="text-amber-400" />}
          {!collapsed && <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
          title="Sign Out"
        >
          <LogOut size={16} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col sticky top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent collapsed={sidebarCollapsed} />
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-md z-10"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full bg-white border-r border-slate-200 flex flex-col">
            <SidebarContent collapsed={false} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            <Menu size={18} />
          </button>
          <span className="font-bold text-slate-900 text-sm font-heading">Admin Portal</span>
          {slaBreach > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-600 font-bold animate-pulse">
              <AlertTriangle size={14} /> {slaBreach} SLA
            </div>
          )}
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
