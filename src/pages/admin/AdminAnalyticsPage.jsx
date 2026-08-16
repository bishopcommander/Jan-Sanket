import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, CheckCircle2, AlertTriangle, Clock, Activity, Building2 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { complaints } = useApp();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
  const breached = complaints.filter(c => c.slaBreached || c.slaHoursRemaining < 0).length;
  const avgPriority = Math.round(complaints.reduce((s, c) => s + c.priorityScore, 0) / total) || 0;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const breachRate = total > 0 ? Math.round((breached / total) * 100) : 0;

  // Department breakdown
  const deptMap = complaints.reduce((acc, c) => {
    const key = c.department;
    if (!acc[key]) acc[key] = { total: 0, resolved: 0, breached: 0 };
    acc[key].total++;
    if (c.status === 'RESOLVED') acc[key].resolved++;
    if (c.slaBreached || c.slaHoursRemaining < 0) acc[key].breached++;
    return acc;
  }, {});

  // Priority breakdown
  const priorityMap = complaints.reduce((acc, c) => {
    acc[c.priorityLevel] = (acc[c.priorityLevel] || 0) + 1;
    return acc;
  }, {});

  // Status breakdown
  const statusMap = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    RESOLVED: 'bg-emerald-500',
    CITIZEN_VERIFICATION: 'bg-amber-500',
    IN_PROGRESS: 'bg-blue-500',
    ASSIGNED: 'bg-cyan-500',
    ROUTED: 'bg-teal-500',
    CLASSIFIED: 'bg-purple-500',
    REOPENED: 'bg-red-500',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
          <BarChart3 className="text-purple-600" size={22} /> Analytics & Insights
        </h1>
        <p className="text-slate-600 text-sm">Operational performance overview for the municipal jurisdiction</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: TrendingUp, color: 'text-emerald-700', sub: `${resolved} of ${total} closed` },
          { label: 'SLA Breach Rate', value: `${breachRate}%`, icon: AlertTriangle, color: 'text-red-700', sub: `${breached} overdue` },
          { label: 'Avg Priority Score', value: avgPriority, icon: Activity, color: 'text-amber-700', sub: 'Across all complaints' },
          { label: 'Active Departments', value: Object.keys(deptMap).length, icon: Building2, color: 'text-teal-700', sub: 'Involved in cases' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 font-bold">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className={`text-3xl font-extrabold font-heading ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance Table */}
        <div className="glass-panel border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm font-heading">Department Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 text-left">Department</th>
                  <th className="py-2.5 px-3 text-center">Total</th>
                  <th className="py-2.5 px-3 text-center">Resolved</th>
                  <th className="py-2.5 px-3 text-center">SLA Breach</th>
                  <th className="py-2.5 px-3 text-center">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {Object.entries(deptMap).map(([dept, data]) => {
                  const rate = Math.round((data.resolved / data.total) * 100);
                  return (
                    <tr key={dept} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-900 font-bold text-[11px] max-w-[160px] truncate">{dept}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">{data.total}</td>
                      <td className="py-3 px-3 text-center text-emerald-700 font-bold">{data.resolved}</td>
                      <td className="py-3 px-3 text-center text-red-700 font-bold">{data.breached}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-emerald-700 font-bold text-[10px] w-7 text-right">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          {/* Status Distribution */}
          <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm font-heading mb-4">Status Distribution</h3>
            <div className="space-y-3">
              {Object.entries(statusMap).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span className="font-semibold">{status.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className={`h-full rounded-full ${statusColors[status] || 'bg-slate-500'}`}
                      style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm font-heading mb-4">Priority Breakdown</h3>
            <div className="flex items-end gap-4 h-28">
              {Object.entries(priorityMap).map(([level, count]) => (
                <div key={level} className="flex-1 flex flex-col items-center gap-2">
                  <span className={`font-extrabold text-lg font-heading ${level === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`}>{count}</span>
                  <div className="w-full rounded-t-xl" style={{
                    height: `${(count / total) * 100}px`,
                    background: level === 'HIGH' ? 'linear-gradient(to top, #dc2626, #ef4444)' : 'linear-gradient(to top, #d97706, #f59e0b)',
                  }} />
                  <span className="text-xs text-slate-700 font-bold">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
