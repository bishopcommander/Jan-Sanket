import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft, User, Upload, MapPin, Sparkles,
  AlertTriangle, CheckCircle2, Activity, Sliders
} from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80";

const STATUS_ORDER = ['REPORTED', 'CLASSIFIED', 'ROUTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'CITIZEN_VERIFICATION', 'RESOLVED'];
const STEPS = [
  { key: 'REPORTED', label: 'Reported' },
  { key: 'ROUTED', label: 'Classified' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLUTION_SUBMITTED', label: 'Resolution' },
  { key: 'RESOLVED', label: 'Verified' },
];

function BeforeAfterSlider({ beforeUrl, afterUrl }) {
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  return (
    <div className="relative rounded-2xl overflow-hidden h-64 border border-slate-200 cursor-ew-resize select-none shadow-sm"
      onMouseDown={() => setDrag(true)} onMouseUp={() => setDrag(false)} onMouseLeave={() => setDrag(false)}
      onMouseMove={e => { if (!drag) return; const r = e.currentTarget.getBoundingClientRect(); setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))); }}>
      <img src={beforeUrl || DEFAULT_FALLBACK_IMAGE} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={afterUrl || DEFAULT_FALLBACK_IMAGE} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="After" style={{ minWidth: '100vw' }} className="h-full object-cover" />
      </div>
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-red-700 border border-red-200 shadow-sm">BEFORE</div>
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-200 shadow-sm">AFTER</div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-xl border border-slate-200">
          <Sliders size={14} />
        </div>
      </div>
    </div>
  );
}

export default function AdminComplaintDetailPage() {
  const { id } = useParams();
  const { complaints, assignOfficer, updateStatus, submitResolution } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('OVERVIEW');
  const [officerName, setOfficerName] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [resolutionUrl, setResolutionUrl] = useState('https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80');
  const [remarks, setRemarks] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const c = complaints.find(x => x.id === id);
  if (!c) return (
    <div className="text-center py-20 text-slate-500 font-semibold">
      Complaint not found. <button onClick={() => navigate(-1)} className="text-emerald-700 hover:underline ml-1 font-bold">Go back</button>
    </div>
  );

  const currentIdx = STATUS_ORDER.indexOf(c.status);
  const getStepState = (key) => {
    const idx = STATUS_ORDER.indexOf(key);
    if (c.status === 'RESOLVED' && key === 'RESOLVED') return 'completed';
    if (c.status === key) return 'active';
    if (currentIdx > idx) return 'completed';
    return 'pending';
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (officerName.trim()) {
      assignOfficer(c.id, officerName.trim(), officerPhone || '+91 98200 00000');
      setOfficerName(''); setOfficerPhone('');
    }
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    updateStatus(c.id, 'IN_PROGRESS', statusNote || 'Field team dispatched to site.');
    setStatusNote('');
  };

  const handleResolution = (e) => {
    e.preventDefault();
    submitResolution(c.id, resolutionUrl, remarks || 'Work completed successfully on site.');
    setRemarks('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate('/admin/complaints')} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 mt-1 shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">{c.id}</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{c.category}</span>
            {(c.slaBreached || c.slaHoursRemaining < 0) && (
              <span className="text-xs font-bold text-red-700 flex items-center gap-1 animate-pulse"><AlertTriangle size={12} /> SLA BREACHED — Escalated</span>
            )}
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 font-heading">{c.title}</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1.5"><MapPin size={12} className="text-amber-600" />{c.locationName} · {c.ward}</p>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Lifecycle Progress</h3>
        <div className="relative flex items-start justify-between">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />
          {STEPS.map((step, i) => {
            const state = getStepState(step.key);
            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all ${
                  state === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' :
                  state === 'active' ? 'bg-amber-500 border-amber-500 text-white shadow-sm animate-pulse' :
                  'bg-slate-100 border-slate-300 text-slate-400'
                }`}>{state === 'completed' ? '✓' : i + 1}</div>
                <span className={`text-[10px] font-bold text-center leading-tight max-w-[56px] ${state === 'completed' ? 'text-emerald-700' : state === 'active' ? 'text-amber-700' : 'text-slate-400'}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-slate-200 p-1 rounded-xl flex-wrap shadow-sm">
        {[
          { key: 'OVERVIEW', label: 'Overview & Evidence' },
          { key: 'ASSIGN', label: 'Assign Officer' },
          { key: 'RESOLVE', label: 'Upload Resolution' },
          { key: 'TIMELINE', label: `Timeline (${c.timeline?.length || 0})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === key ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden h-60 border border-slate-200 relative bg-slate-100 shadow-sm">
              <img src={c.photoUrl} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 text-xs bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-semibold shadow-sm">Citizen Evidence Photo</div>
            </div>
            <div className="glass-panel p-4 border border-slate-200 bg-white rounded-xl text-sm space-y-2 shadow-sm">
              <p className="text-slate-800 italic text-xs font-medium">"{c.description}"</p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">{c.keywords?.map((k, i) => <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-300 font-bold">#{k}</span>)}</div>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div className="glass-panel p-4 border border-teal-200 bg-white rounded-xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5 font-bold text-teal-800"><Sparkles size={14} className="text-teal-600" /> AI Classification</span>
                <span className="text-teal-700 font-mono font-bold">{c.confidence}% Conf.</span>
              </div>
              {[['Category', c.category], ['Subcategory', c.subcategory], ['Severity', c.severity], ['Priority', `${c.priorityLevel} (${c.priorityScore}/100)`], ['Department', c.department]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2"><span className="text-slate-500 font-semibold">{k}:</span><span className="font-bold text-slate-900 text-right">{v}</span></div>
              ))}
            </div>
            <div className="glass-panel p-4 border border-slate-200 bg-white rounded-xl space-y-2 shadow-sm">
              {[['Assigned To', c.assignedOfficer], ['Officer Phone', c.officerPhone || 'Not assigned'], ['SLA Remaining', c.slaHoursRemaining > 0 ? `${c.slaHoursRemaining}h` : '⚠ Breached'], ['Corroborations', `${c.corroborations} citizens`]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2"><span className="text-slate-500 font-semibold">{k}:</span><span className={`font-bold ${k === 'SLA Remaining' && c.slaHoursRemaining < 0 ? 'text-red-700 animate-pulse' : 'text-slate-900'} text-right`}>{v}</span></div>
              ))}
            </div>
            {c.resolution && (
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">Resolution Evidence Comparison</h4>
                <BeforeAfterSlider beforeUrl={c.photoUrl} afterUrl={c.resolution.afterPhotoUrl} />
                <p className="mt-2 text-xs text-slate-600 italic">Citizen verification: <span className={c.resolution.verifiedByCitizen === 'CONFIRMED' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>{c.resolution.verifiedByCitizen || 'Pending'}</span></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Assign Officer */}
      {tab === 'ASSIGN' && (
        <div className="max-w-lg space-y-5">
          <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2 mb-4"><User size={16} className="text-amber-600" /> Assign Field Officer</h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="form-group">
                <label className="form-label text-slate-800 font-bold">Officer Name & Designation</label>
                <input type="text" value={officerName} onChange={e => setOfficerName(e.target.value)} placeholder="e.g. Inspector Ramesh Shah (PWD)" className="form-input bg-white border-slate-300 text-slate-900" required />
              </div>
              <div className="form-group">
                <label className="form-label text-slate-800 font-bold">Contact Number</label>
                <input type="text" value={officerPhone} onChange={e => setOfficerPhone(e.target.value)} placeholder="+91 98200 00000" className="form-input bg-white border-slate-300 text-slate-900" />
              </div>
              <button type="submit" className="btn-amber py-2.5 px-5 w-full justify-center font-bold bg-amber-600 text-white rounded-xl shadow-sm">Assign Officer & Update Status</button>
            </form>
          </div>
          <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2 mb-4"><Activity size={16} className="text-blue-600" /> Update Field Status</h3>
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div className="form-group">
                <label className="form-label text-slate-800 font-bold">Field Update Remark</label>
                <input type="text" value={statusNote} onChange={e => setStatusNote(e.target.value)} placeholder="e.g. Crew arrived on site, repair commenced" className="form-input bg-white border-slate-300 text-slate-900" />
              </div>
              <button type="submit" className="btn-primary py-2.5 px-5 w-full justify-center font-bold bg-emerald-600 text-white rounded-xl shadow-sm">Mark as In Progress</button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Upload Resolution */}
      {tab === 'RESOLVE' && (
        <div className="max-w-lg space-y-5">
          <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2 mb-4"><Upload size={16} className="text-emerald-600" /> Upload Resolution Proof</h3>
            <form onSubmit={handleResolution} className="space-y-4">
              <div>
                <label className="form-label text-slate-800 font-bold">After-Repair Photo URL</label>
                <input type="text" value={resolutionUrl} onChange={e => setResolutionUrl(e.target.value)} className="form-input font-mono text-xs bg-white border-slate-300 text-slate-900" required />
                <div className="mt-2 rounded-xl overflow-hidden h-32 border border-slate-200 bg-slate-100">
                  <img src={resolutionUrl} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <label className="form-label text-slate-800 font-bold">Completion Remarks</label>
                <textarea rows="3" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Describe what was done, materials used, quality notes..." className="form-textarea bg-white border-slate-300 text-slate-900" />
              </div>
              <button type="submit" className="btn-primary py-2.5 px-5 w-full justify-center font-bold bg-emerald-600 text-white rounded-xl shadow-sm">
                <CheckCircle2 size={16} /> Mark Completed & Request Citizen Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Timeline */}
      {tab === 'TIMELINE' && (
        <div className="pl-4 border-l-2 border-slate-300 space-y-3">
          {c.timeline?.map((item, i) => (
            <div key={i} className="relative pl-5">
              <div className="absolute -left-[25px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-600 shadow-sm" />
              <div className="glass-panel p-3.5 border border-slate-200 bg-white rounded-xl text-xs space-y-1 shadow-sm">
                <div className="flex items-center justify-between"><span className="font-bold text-slate-900">{item.title}</span><span className="text-amber-700 font-mono text-[10px] font-bold">{item.timestamp}</span></div>
                <p className="text-slate-700 font-medium">{item.text}</p>
                <div className="text-[10px] text-slate-500">Actor: {item.actor}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
