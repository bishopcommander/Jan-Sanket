import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Flame, Plus, CheckCircle2, Clock, AlertTriangle, Activity,
  Sparkles, ArrowRight, MapPin, Users, Shield, Filter
} from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80";

export default function CitizenDashboard() {
  const { complaints, currentUser } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const filtered = complaints.filter(c => {
    if (filter === 'VERIFY') return c.status === 'CITIZEN_VERIFICATION';
    if (filter === 'CRITICAL') return c.priorityLevel === 'HIGH';
    if (filter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  const stats = {
    total: complaints.length,
    needVerify: complaints.filter(c => c.status === 'CITIZEN_VERIFICATION').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    critical: complaints.filter(c => c.priorityLevel === 'HIGH').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

      {/* Welcome Banner */}
      <div className="glass-panel border border-slate-200 bg-white p-6 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-slate-500 text-sm font-medium">Welcome back,</p>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">{currentUser?.name} 👋</h2>
            <p className="text-slate-600 text-sm mt-1">Here's what's happening in your city today.</p>
          </div>
          <button
            onClick={() => navigate('/citizen/report')}
            className="btn-primary py-3 px-5 text-sm font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 flex items-center gap-2 rounded-xl"
          >
            <Plus size={18} />
            Report New Issue
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: Activity, color: 'text-teal-600', sub: 'City-wide', border: 'border-slate-200 bg-white' },
          { label: 'Awaiting Verification', value: stats.needVerify, icon: Clock, color: 'text-amber-600', sub: 'Need your approval', border: 'border-amber-200 bg-amber-50/40' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', sub: 'Fully closed', border: 'border-emerald-200 bg-emerald-50/40' },
          { label: 'Critical Issues', value: stats.critical, icon: AlertTriangle, color: 'text-red-600', sub: 'High priority', border: 'border-red-200 bg-red-50/40' },
        ].map(({ label, value, icon: Icon, color, sub, border }) => (
          <div key={label} className={`glass-panel border ${border} p-5 rounded-2xl shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 font-bold">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className={`text-3xl font-extrabold font-heading ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Feed Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Flame className="text-amber-600" size={20} /> Civic Incident Feed
            </h3>
            <p className="text-xs text-slate-600">AI-classified issues across your city</p>
          </div>
          <div className="flex flex-wrap gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {[
              { key: 'ALL', label: `All (${stats.total})` },
              { key: 'VERIFY', label: `Verify (${stats.needVerify})` },
              { key: 'CRITICAL', label: 'Critical' },
              { key: 'RESOLVED', label: 'Resolved' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === key ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => navigate(`/citizen/complaints/${c.id}`)}
              className="glass-panel glass-panel-interactive border border-slate-200 bg-white rounded-2xl overflow-hidden group cursor-pointer hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={c.photoUrl}
                    alt=""
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="font-mono text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300 shadow-sm">{c.id}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="text-[11px] bg-white/90 text-teal-800 px-2 py-0.5 rounded font-bold border border-slate-200 flex items-center gap-1 shadow-sm">
                      <Sparkles size={11} className="text-teal-600" /> {c.confidence}%
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      c.status === 'CITIZEN_VERIFICATION' ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' :
                      'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.priorityLevel === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                      {c.priorityLevel}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-emerald-700 transition-colors">{c.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{c.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 truncate font-medium">
                      <MapPin size={12} className="text-amber-600 shrink-0" />
                      <span className="truncate">{c.ward}</span>
                    </span>
                    {c.corroborations > 1 && (
                      <span className="flex items-center gap-1 text-teal-700 font-bold shrink-0">
                        <Users size={12} /> +{c.corroborations}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">SLA: {c.slaHoursRemaining > 0 ? `${c.slaHoursRemaining}h left` : 'Breached'}</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    View Details <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 py-16 text-center">
              <Shield size={36} className="mx-auto text-slate-400 mb-3" />
              <p className="text-slate-600 font-semibold">No incidents match this filter.</p>
              <button onClick={() => navigate('/citizen/report')} className="btn-primary mt-4 py-2 px-4 text-xs font-bold bg-emerald-600 text-white rounded-xl">
                <Plus size={14} /> Report First Issue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
