import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft, MapPin, Building2, User, Phone, Clock, Sparkles,
  CheckCircle2, ThumbsUp, ThumbsDown, AlertTriangle, Sliders
} from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80";

const STEPS = [
  { key: 'REPORTED', label: 'Reported' },
  { key: 'ROUTED', label: 'AI Classified' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLUTION_SUBMITTED', label: 'Resolved' },
  { key: 'RESOLVED', label: 'Verified' },
];

const STATUS_ORDER = ['REPORTED', 'CLASSIFIED', 'ROUTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'CITIZEN_VERIFICATION', 'RESOLVED'];

function BeforeAfterSlider({ beforeUrl, afterUrl }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden h-72 border border-slate-200 cursor-ew-resize select-none shadow-sm"
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onMouseMove={e => { if (!dragging) return; const r = e.currentTarget.getBoundingClientRect(); setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))); }}
    >
      <img src={beforeUrl || DEFAULT_FALLBACK_IMAGE} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={afterUrl || DEFAULT_FALLBACK_IMAGE} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="After" style={{ minWidth: '100vw', maxWidth: 'none' }} className="h-full object-cover" />
      </div>
      {/* Labels */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-red-700 border border-red-200 flex items-center gap-1 shadow-sm"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />BEFORE</div>
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-sm"><span className="w-2 h-2 rounded-full bg-emerald-500" />AFTER</div>
      {/* Handle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-xl border border-slate-200">
          <Sliders size={16} />
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-slate-800 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 shadow-sm font-semibold">
        ← Drag to compare →
      </div>
    </div>
  );
}

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const { complaints, verifyResolution } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('EVIDENCE');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopen, setShowReopen] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 mt-1 shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">{c.id}</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{c.category}</span>
            {c.slaBreached && <span className="text-xs font-bold text-red-700 flex items-center gap-1 animate-pulse"><AlertTriangle size={12} /> SLA Breached</span>}
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 font-heading">{c.title}</h1>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Complaint Lifecycle</h3>
        <div className="relative flex items-start justify-between">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />
          {STEPS.map((step, i) => {
            const state = getStepState(step.key);
            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all ${
                  state === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' :
                  state === 'active' ? 'bg-amber-500 border-amber-500 text-white shadow-sm animate-pulse' :
                  'bg-slate-100 border-slate-300 text-slate-400'
                }`}>
                  {state === 'completed' ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-bold text-center max-w-[60px] leading-tight ${
                  state === 'completed' ? 'text-emerald-700' : state === 'active' ? 'text-amber-700' : 'text-slate-400'
                }`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inner Tabs */}
      <div className="flex gap-2 bg-white border border-slate-200 p-1 rounded-xl flex-wrap shadow-sm">
        {[
          { key: 'EVIDENCE', label: 'Evidence & AI' },
          { key: 'RESOLUTION', label: 'Resolution Verify' },
          { key: 'TIMELINE', label: `Audit Log (${c.timeline?.length || 0})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === key ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Evidence */}
      {tab === 'EVIDENCE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl overflow-hidden h-64 border border-slate-200 relative bg-slate-100 shadow-sm">
            <img src={c.photoUrl} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 text-xs bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-semibold shadow-sm">Citizen Evidence Photo</div>
          </div>
          <div className="space-y-3">
            <div className="glass-panel p-4 border border-slate-200 bg-white rounded-xl space-y-3 text-sm shadow-sm">
              <div className="flex items-start gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-3">
                <MapPin size={15} className="text-amber-600 mt-0.5 shrink-0" />
                <span>{c.locationName} · <span className="text-teal-700 font-mono text-xs font-bold">{c.ward}</span></span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">"{c.description}"</p>
            </div>
            <div className="glass-panel p-4 border border-teal-200 bg-white rounded-xl space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5 font-bold text-teal-800"><Sparkles size={14} className="text-teal-600" /> AI Analysis</span>
                <span className="text-teal-700 font-mono font-bold">{c.confidence}% match</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><div className="text-slate-500 font-semibold">Category</div><div className="font-bold text-slate-900">{c.category}</div></div>
                <div><div className="text-slate-500 font-semibold">Priority</div><div className="font-bold text-amber-700">{c.priorityLevel} ({c.priorityScore}/100)</div></div>
                <div className="col-span-2"><div className="text-slate-500 font-semibold">Routed To</div><div className="font-bold text-slate-900 flex items-center gap-1.5"><Building2 size={12} className="text-emerald-600" />{c.department}</div></div>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">{c.keywords?.map((k, i) => <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-300 font-bold">#{k}</span>)}</div>
            </div>
            {c.assignedOfficer && c.assignedOfficer !== 'Pending Assignment' && (
              <div className="glass-panel p-4 border border-slate-200 bg-white rounded-xl flex items-center justify-between text-sm shadow-sm">
                <div className="flex items-center gap-2"><User size={15} className="text-emerald-600" /><div><div className="text-xs text-slate-500 font-semibold">Assigned Officer</div><div className="font-bold text-slate-900">{c.assignedOfficer}</div></div></div>
                {c.officerPhone && <a href={`tel:${c.officerPhone}`} className="text-emerald-700 text-xs font-mono font-bold flex items-center gap-1 hover:underline"><Phone size={12} />{c.officerPhone}</a>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Resolution */}
      {tab === 'RESOLUTION' && (
        <div className="space-y-5">
          {c.resolution ? (
            <>
              <BeforeAfterSlider beforeUrl={c.photoUrl} afterUrl={c.resolution.afterPhotoUrl} />
              <div className="glass-panel p-4 border border-slate-200 bg-white rounded-xl text-sm space-y-2 shadow-sm">
                <div className="flex justify-between text-xs text-slate-600 border-b border-slate-100 pb-2">
                  <span>Uploaded by: <strong className="text-slate-900">{c.resolution.submittedBy}</strong></span>
                  <span>Completed: <strong className="text-emerald-700 font-mono font-bold">{new Date(c.resolution.completedAt).toLocaleString()}</strong></span>
                </div>
                <p className="text-slate-800 italic font-medium">"{c.resolution.remarks}"</p>
              </div>

              {/* Citizen Sign-Off */}
              <div className="glass-panel p-5 border border-emerald-300 bg-emerald-50/50 rounded-2xl space-y-4 shadow-sm">
                <h3 className="font-bold text-emerald-900 font-heading flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-600" /> Citizen Verification Required</h3>

                {c.resolution.verifiedByCitizen === 'CONFIRMED' && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-700" /> ✅ You confirmed this issue is resolved. Ticket is now closed.
                  </div>
                )}
                {c.resolution.verifiedByCitizen === 'REJECTED' && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-900 text-sm font-bold flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-700" /> ❌ You rejected this resolution. Ticket has been reopened for rework.
                  </div>
                )}
                {!c.resolution.verifiedByCitizen && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium">Does the after-photo accurately reflect that the issue is fully resolved on-site?</p>
                    {!showReopen ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => verifyResolution(c.id, true)} className="btn-primary py-2.5 px-5 text-sm font-bold shadow-sm flex-1 justify-center bg-emerald-600 text-white rounded-xl">
                          <ThumbsUp size={16} /> Confirm Issue Resolved
                        </button>
                        <button onClick={() => setShowReopen(true)} className="btn-danger py-2.5 px-5 text-sm font-bold flex-1 justify-center bg-red-600 text-white rounded-xl">
                          <ThumbsDown size={16} /> Issue Still Exists
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <label className="form-label text-xs text-slate-800 font-bold">Reason for reopening</label>
                        <textarea rows="2" value={reopenReason} onChange={e => setReopenReason(e.target.value)} placeholder="Describe why the repair is incomplete..." className="form-textarea text-xs bg-white border-slate-300 text-slate-900" />
                        <div className="flex gap-2">
                          <button onClick={() => verifyResolution(c.id, false, reopenReason)} className="btn-danger py-2 px-4 text-xs font-bold bg-red-600 text-white rounded-lg">Submit Reopen</button>
                          <button onClick={() => setShowReopen(false)} className="btn-secondary py-2 px-4 text-xs bg-slate-100 text-slate-800 border-slate-300 rounded-lg">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-16 text-center glass-panel border border-slate-200 bg-white rounded-2xl space-y-3 shadow-sm">
              <Clock size={36} className="mx-auto text-amber-600 animate-pulse" />
              <h4 className="font-bold text-slate-900 font-heading">Repair In Progress</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">Field officer is executing repairs. Before/After proof will appear here upon completion.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Timeline */}
      {tab === 'TIMELINE' && (
        <div className="space-y-3">
          <div className="pl-4 border-l-2 border-slate-300 space-y-3">
            {c.timeline?.map((item, i) => (
              <div key={i} className="relative pl-5">
                <div className="absolute -left-[25px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-600 shadow-sm" />
                <div className="glass-panel p-3.5 border border-slate-200 bg-white rounded-xl text-xs space-y-1 shadow-sm">
                  <div className="flex items-center justify-between"><span className="font-bold text-slate-900">{item.title}</span><span className="text-emerald-700 font-mono text-[10px] font-bold">{item.timestamp}</span></div>
                  <p className="text-slate-700 font-medium">{item.text}</p>
                  <div className="text-[10px] text-slate-500">Actor: {item.actor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
