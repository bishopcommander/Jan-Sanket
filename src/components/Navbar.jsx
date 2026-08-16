import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Plus, Bell, User, Building, MapPin, List, CheckCircle, RefreshCw, X, AlertTriangle } from 'lucide-react';

export default function Navbar() {
  const { 
    activeRole, 
    setActiveRole, 
    activeTab, 
    setActiveTab, 
    setIsReportModalOpen,
    notifications,
    markNotificationRead,
    setSelectedComplaint,
    complaints,
    resetToDefaultData
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('DASHBOARD')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="text-emerald-400 w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-heading text-white tracking-tight">Jan Sanket</h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                AI Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Civic Issue Intelligence & Governance</p>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'DASHBOARD'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <List size={16} />
            Citizen Feed
          </button>

          <button
            onClick={() => setActiveTab('SMART_CITY')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'SMART_CITY'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin size={16} className="text-teal-400" />
            SmartCity Map
          </button>

          <button
            onClick={() => setActiveTab('MY_COMPLAINTS')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'MY_COMPLAINTS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle size={16} />
            My Tracked Issues
          </button>

          <button
            onClick={() => {
              setActiveRole('ADMIN');
              setActiveTab('ADMIN_TABLE');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeRole === 'ADMIN' && (activeTab === 'ADMIN_TABLE' || activeTab === 'ADMIN_MAP')
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building size={16} />
            Admin Portal
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* Role Switcher Pill */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setActiveRole('CITIZEN')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'CITIZEN'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={13} />
              Citizen
            </button>
            <button
              onClick={() => {
                setActiveRole('ADMIN');
                if (activeTab !== 'ADMIN_MAP') setActiveTab('ADMIN_TABLE');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building size={13} />
              Official
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel border border-slate-700/80 p-4 shadow-2xl z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Bell size={16} className="text-emerald-400" />
                    Live Activity Notifications
                  </h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3 mt-3 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        const target = complaints.find(c => c.id === n.complaintId);
                        if (target) setSelectedComplaint(target);
                        setShowNotifications(false);
                      }}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        n.read
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                          : 'bg-emerald-950/30 border-emerald-500/30 text-slate-200 hover:border-emerald-500/60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1 text-emerald-400">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                      </div>
                      <p className="text-slate-300 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetToDefaultData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            title="Reset to default prototype demo dataset"
          >
            <RefreshCw size={15} />
          </button>

          {/* Report Issue CTA */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn-primary py-2 px-3.5 text-xs sm:text-sm font-bold shadow-lg"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Report Civic Issue</span>
            <span className="sm:hidden">Report</span>
          </button>

        </div>
      </div>
    </nav>
  );
}
