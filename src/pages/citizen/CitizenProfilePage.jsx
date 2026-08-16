import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck, LogOut, RotateCcw, List, CheckCircle2, AlertTriangle, Clock, Activity } from 'lucide-react';

export default function CitizenProfilePage() {
  const { currentUser, logout, complaints, resetData } = useApp();
  const navigate = useNavigate();

  const myStats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    verify: complaints.filter(c => c.status === 'CITIZEN_VERIFICATION').length,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Profile Card */}
      <div className="glass-panel border border-slate-800 bg-slate-900/60 p-6 rounded-2xl flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-3xl font-extrabold text-emerald-400 shrink-0">
          {currentUser?.name?.[0]?.toUpperCase() || 'C'}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white font-heading">{currentUser?.name}</h2>
          <p className="text-slate-400 text-sm">Registered Citizen · Jan Sanket Platform</p>
          <span className="inline-flex items-center gap-1.5 mt-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
            <ShieldCheck size={13} /> Verified Citizen Account
          </span>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: myStats.total, icon: Activity, color: 'text-teal-400' },
          { label: 'Resolved', value: myStats.resolved, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'In Progress', value: myStats.inProgress, icon: Clock, color: 'text-blue-400' },
          { label: 'Verify Pending', value: myStats.verify, icon: AlertTriangle, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel border border-slate-800 bg-slate-900/60 p-4 rounded-2xl text-center">
            <Icon size={20} className={`${color} mx-auto mb-1`} />
            <div className={`text-2xl font-extrabold font-heading ${color}`}>{value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-panel border border-slate-800 bg-slate-900/60 p-5 rounded-2xl space-y-2">
        <h3 className="text-sm font-bold text-slate-300 mb-3">Quick Actions</h3>
        <button onClick={() => navigate('/citizen/my-complaints')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 hover:border-emerald-500/40 hover:text-white transition-all">
          <List size={16} className="text-emerald-400" /> View All My Complaints
        </button>
        <button onClick={() => navigate('/citizen/report')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 hover:border-emerald-500/40 hover:text-white transition-all">
          <CheckCircle2 size={16} className="text-teal-400" /> Report a New Issue
        </button>
        <button onClick={() => { resetData(); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-amber-400 hover:bg-amber-950/20 hover:border-amber-500/30 transition-all">
          <RotateCcw size={16} /> Reset Demo Data
        </button>
      </div>

      {/* Sign Out */}
      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/30 bg-red-950/20 text-red-400 font-bold text-sm hover:bg-red-950/40 transition-all"
      >
        <LogOut size={16} /> Sign Out of Jan Sanket
      </button>
    </div>
  );
}
