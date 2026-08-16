import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, ClipboardList, AlertTriangle, CheckCircle2, Clock,
  Activity, ArrowRight, MapPin, Building2, User, Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { complaints } = useApp();
  const navigate = useNavigate();

  const stats = {
    total: complaints.length,
    breaches: complaints.filter(c => c.slaBreached || c.slaHoursRemaining < 0).length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    verification: complaints.filter(c => c.status === 'CITIZEN_VERIFICATION').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    unassigned: complaints.filter(c => c.assignedOfficer === 'Pending Assignment' || !c.assignedOfficer).length,
  };

  const recentComplaints = [...complaints].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const deptBreakdown = complaints.reduce((acc, c) => {
    const key = c.department ? c.department.split(' ').slice(0, 3).join(' ') : 'Civic Dept';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Municipal Operations Dashboard</h1>
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">Admin</span>
        </div>
        <p className="text-slate-600 text-sm">Real-time civic complaint monitoring & SLA enforcement</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Tickets', value: stats.total, icon: ClipboardList, color: 'text-teal-600', border: 'border-slate-200 bg-white' },
          { label: 'SLA Breached', value: stats.breaches, icon: AlertTriangle, color: 'text-red-600', border: 'border-red-200 bg-red-50/50' },
          { label: 'In Progress', value: stats.inProgress, icon: Activity, color: 'text-blue-600', border: 'border-blue-200 bg-blue-50/30' },
          { label: 'Verify Pending', value: stats.verification, icon: Clock, color: 'text-amber-600', border: 'border-amber-200 bg-amber-50/40' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', border: 'border-emerald-200 bg-emerald-50/40' },
          { label: 'Unassigned', value: stats.unassigned, icon: User, color: 'text-purple-600', border: 'border-purple-200 bg-purple-50/30' },
        ].map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`glass-panel border ${border} p-4 rounded-2xl shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-600 font-bold">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className={`text-3xl font-extrabold font-heading ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Complaints Table */}
        <div className="lg:col-span-2 glass-panel border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm font-heading">Recent Incidents</h3>
            <button onClick={() => navigate('/admin/complaints')} className="text-xs text-teal-700 font-bold flex items-center gap-1 hover:text-teal-900">
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentComplaints.map(c => (
              <div
                key={c.id}
                onClick={() => navigate(`/admin/complaints/${c.id}`)}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <img src={c.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] text-emerald-700 font-bold">{c.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      c.priorityLevel === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>{c.priorityLevel}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{c.title}</div>
                  <div className="text-[11px] text-slate-500">{c.ward}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    c.status === 'CITIZEN_VERIFICATION' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-blue-100 text-blue-800 border-blue-300'
                  }`}>{c.status.replace(/_/g, ' ')}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-1">{c.slaHoursRemaining > 0 ? `${c.slaHoursRemaining}h SLA` : '⚠ Breached'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Department Breakdown */}
          <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm font-heading mb-4 flex items-center gap-2"><Building2 size={16} className="text-teal-600" /> By Department</h3>
            <div className="space-y-3">
              {Object.entries(deptBreakdown).map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="truncate font-semibold">{dept}</span>
                    <span className="font-bold text-emerald-700 ml-2">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl space-y-2 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm font-heading mb-3">Quick Actions</h3>
            {[
              { label: 'Manage All Complaints', to: '/admin/complaints', color: 'text-teal-600' },
              { label: 'GIS Ward Map View', to: '/admin/map', color: 'text-amber-600' },
              { label: 'View Analytics', to: '/admin/analytics', color: 'text-purple-600' },
              { label: 'Notifications', to: '/admin/notifications', color: 'text-emerald-600' },
            ].map(({ label, to, color }) => (
              <button key={to} onClick={() => navigate(to)} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition-all shadow-sm">
                <span>{label}</span>
                <ArrowRight size={14} className={color} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
