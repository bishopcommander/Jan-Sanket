import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { List, ArrowRight, MapPin, Clock, Sparkles, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80";

const STATUS_STYLES = {
  CITIZEN_VERIFICATION: 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
  REOPENED: 'bg-red-100 text-red-800 border-red-300',
  CLASSIFIED: 'bg-purple-100 text-purple-800 border-purple-300',
  ROUTED: 'bg-teal-100 text-teal-800 border-teal-300',
  ASSIGNED: 'bg-cyan-100 text-cyan-800 border-cyan-300',
};

const LIFECYCLE = ['CLASSIFIED', 'ROUTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'CITIZEN_VERIFICATION', 'RESOLVED'];

export default function MyComplaintsPage() {
  const { complaints } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <List className="text-emerald-600" size={22} /> My Tracked Complaints
          </h1>
          <p className="text-slate-600 text-sm mt-1">{complaints.length} total issues · Track lifecycle & verify resolutions</p>
        </div>
        <button onClick={() => navigate('/citizen/report')} className="btn-primary py-2.5 px-4 text-xs font-bold bg-emerald-600 text-white rounded-xl flex items-center gap-1.5 shadow-sm">
          <Plus size={15} /> Report New
        </button>
      </div>

      <div className="space-y-4">
        {complaints.map(c => {
          const currentStep = LIFECYCLE.indexOf(c.status);
          const progress = currentStep === -1 ? 0 : Math.round(((currentStep + 1) / LIFECYCLE.length) * 100);

          return (
            <div
              key={c.id}
              onClick={() => navigate(`/citizen/complaints/${c.id}`)}
              className="glass-panel border border-slate-200 bg-white rounded-2xl p-5 cursor-pointer hover:border-emerald-500 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Thumbnail */}
                <div className="w-full md:w-28 h-24 md:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={c.photoUrl}
                    alt=""
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">{c.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[c.status] || 'bg-slate-100 text-slate-800 border-slate-300'}`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                    {(c.slaBreached || c.slaHoursRemaining < 0) && (
                      <span className="text-[10px] font-bold text-red-700 flex items-center gap-1 animate-pulse">
                        <AlertTriangle size={11} /> SLA Breached
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-emerald-700 transition-colors">{c.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
                    <span className="flex items-center gap-1 font-medium"><MapPin size={12} className="text-amber-600" />{c.ward}</span>
                    <span className="flex items-center gap-1 font-medium"><Sparkles size={12} className="text-teal-600" />{c.department}</span>
                    <span className="flex items-center gap-1 font-medium"><Clock size={12} />{c.slaHoursRemaining > 0 ? `${c.slaHoursRemaining}h SLA` : 'Breached'}</span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-semibold">Lifecycle Progress</span>
                      <span className="font-bold text-emerald-700">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${c.status === 'RESOLVED' ? 'bg-emerald-500' : c.status === 'CITIZEN_VERIFICATION' ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center md:items-start shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/citizen/complaints/${c.id}`); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      c.status === 'CITIZEN_VERIFICATION'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                        : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                    }`}
                  >
                    {c.status === 'CITIZEN_VERIFICATION' ? (
                      <><CheckCircle2 size={14} /> Verify Now</>
                    ) : (
                      <>Track <ArrowRight size={13} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
