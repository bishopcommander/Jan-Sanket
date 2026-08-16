import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, ArrowRight, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;

  const getIcon = (title) => {
    if (title.toLowerCase().includes('resolv') || title.toLowerCase().includes('verif')) return <CheckCircle2 size={18} className="text-emerald-700" />;
    if (title.toLowerCase().includes('sla') || title.toLowerCase().includes('breach') || title.toLowerCase().includes('reopen')) return <AlertTriangle size={18} className="text-red-700" />;
    return <Bell size={18} className="text-teal-700" />;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <Bell className="text-teal-600" size={22} /> Notifications
          </h1>
          <p className="text-slate-600 text-sm font-medium">{unread} unread · Stay updated on your complaints</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 bg-slate-100 text-slate-800 border-slate-300 rounded-xl font-bold">
            <CheckCheck size={14} /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-20 text-center">
          <Bell size={36} className="mx-auto text-slate-400 mb-3" />
          <p className="text-slate-600 font-semibold">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.complaintId) navigate(`/citizen/complaints/${n.complaintId}`);
              }}
              className={`glass-panel border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md ${
                n.read
                  ? 'border-slate-200 bg-slate-50 opacity-75'
                  : 'border-teal-300 bg-white shadow-sm hover:border-teal-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-200' : 'bg-teal-50 border border-teal-200'}`}>
                  {getIcon(n.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h4 className={`font-bold text-sm truncate ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h4>
                    <span className="text-[11px] text-slate-500 font-semibold shrink-0">{n.time}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${n.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>{n.message}</p>
                  {!n.read && n.complaintId && (
                    <div className="flex items-center gap-1 mt-2 text-teal-700 text-xs font-bold">
                      View Complaint <ArrowRight size={12} />
                    </div>
                  )}
                </div>
                {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
