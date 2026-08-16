import React from 'react';
import { MapPin, Clock, Users, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Building2, Eye } from 'lucide-react';

export default function ComplaintCard({ complaint, onSelect }) {
  const getStatusBadge = (status, slaBreached) => {
    if (slaBreached) {
      return <span className="badge badge-breach flex items-center gap-1"><AlertTriangle size={12} /> SLA Breached</span>;
    }
    switch (status) {
      case 'CITIZEN_VERIFICATION':
        return <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse"><Clock size={12} /> Awaiting Verification</span>;
      case 'RESOLVED':
        return <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"><CheckCircle2 size={12} /> Resolved</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1"><Sparkles size={12} /> Work In Progress</span>;
      case 'REOPENED':
        return <span className="badge bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1"><AlertTriangle size={12} /> Reopened</span>;
      default:
        return <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/40">{status.replace('_', ' ')}</span>;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="badge badge-high">Critical</span>;
      case 'HIGH':
        return <span className="badge badge-high">High</span>;
      case 'MEDIUM':
        return <span className="badge badge-medium">Medium</span>;
      default:
        return <span className="badge badge-low">Low</span>;
    }
  };

  return (
    <div 
      onClick={() => onSelect(complaint)}
      className="glass-panel glass-panel-interactive p-5 border border-slate-800 bg-slate-900/60 flex flex-col justify-between h-full group"
    >
      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
              {complaint.id}
            </span>
            {getSeverityBadge(complaint.severity)}
          </div>
          {getStatusBadge(complaint.status, complaint.slaBreached || complaint.slaHoursRemaining < 0)}
        </div>

        {/* Image & Title */}
        <div className="relative mb-3 rounded-xl overflow-hidden h-44 bg-slate-950 border border-slate-800">
          <img 
            src={complaint.photoUrl} 
            alt={complaint.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* AI Badge Overlay */}
          <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-semibold text-teal-300 flex items-center gap-1.5 shadow-lg">
            <Sparkles size={12} className="text-teal-400" />
            {complaint.confidence}% AI Match
          </div>

          {/* Department Tag Overlay */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
            <span className="truncate font-semibold flex items-center gap-1.5 text-slate-300">
              <Building2 size={13} className="text-emerald-400 shrink-0" />
              {complaint.department}
            </span>
          </div>
        </div>

        <h3 className="font-heading font-bold text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
          {complaint.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {complaint.description}
        </p>

        {/* Location & Ward */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin size={14} className="text-amber-400 shrink-0" />
            <span className="truncate font-medium">{complaint.locationName}</span>
          </div>
          
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
              {complaint.ward}
            </span>

            {complaint.corroborations > 1 && (
              <span className="text-teal-400 flex items-center gap-1 font-semibold">
                <Users size={12} />
                +{complaint.corroborations} Citizens Corroborated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={13} className="text-slate-500" />
          <span>SLA: {complaint.slaHoursRemaining > 0 ? `${complaint.slaHoursRemaining}h remaining` : 'Breached'}</span>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(complaint);
          }}
          className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 transition-all"
        >
          Inspect
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
