import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;

  const getIcon = (title) => {
    if (title.toLowerCase().includes('sla') || title.toLowerCase().includes('breach')) return <AlertTriangle size={18} className="text-red-400" />;
    if (title.toLowerCase().includes('resolv') || title.toLowerCase().includes('verif')) return <CheckCircle2 size={18} className="text-emerald-400" />;
    return <Bell size={18} className="text-amber-400" />;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2">
            <Bell className="text-amber-400" size={22} /> Admin Notifications
          </h1>
          <p className="text-slate-400 text-sm">{unread} unread · SLA alerts, escalations & updates</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
            <CheckCheck size={14} /> Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => {
              markNotificationRead(n.id);
              if (n.complaintId) navigate(`/admin/complaints/${n.complaintId}`);
            }}
            className={`glass-panel border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] ${
              n.read
                ? 'border-slate-800 bg-slate-900/40 opacity-70'
                : 'border-amber-500/30 bg-amber-950/20 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-800' : 'bg-slate-900 border border-amber-500/30'}`}>
                {getIcon(n.title)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className={`font-bold text-sm truncate ${n.read ? 'text-slate-300' : 'text-white'}`}>{n.title}</h4>
                  <span className="text-[11px] text-slate-500 shrink-0">{n.time}</span>
                </div>
                <p className={`text-xs leading-relaxed ${n.read ? 'text-slate-500' : 'text-slate-300'}`}>{n.message}</p>
                {!n.read && n.complaintId && (
                  <div className="flex items-center gap-1 mt-2 text-amber-400 text-xs font-bold">
                    Manage Complaint <ArrowRight size={12} />
                  </div>
                )}
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-pulse" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
