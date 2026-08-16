import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BeforeAfterViewer from './BeforeAfterViewer';
import { 
  X, CheckCircle2, AlertTriangle, Clock, MapPin, User, 
  Sparkles, ShieldCheck, Phone, Upload, ThumbsUp, ThumbsDown, Activity
} from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80";

export default function ComplaintDetailModal() {
  const { 
    selectedComplaint, 
    setSelectedComplaint, 
    activeRole, 
    assignOfficer, 
    submitResolution, 
    verifyResolution 
  } = useApp();

  const [activeTab, setActiveTab] = useState('EVIDENCE'); // 'EVIDENCE' | 'RESOLUTION' | 'TIMELINE' | 'ADMIN_ACTION'
  const [officerNameInput, setOfficerNameInput] = useState('');
  const [resolutionPhotoUrl, setResolutionPhotoUrl] = useState('https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenInput, setShowReopenInput] = useState(false);

  if (!selectedComplaint) return null;

  const c = selectedComplaint;

  const steps = [
    { key: 'REPORTED', label: 'Reported' },
    { key: 'ROUTED', label: 'AI Classified' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLUTION_SUBMITTED', label: 'Resolution' },
    { key: 'RESOLVED', label: 'Verified' }
  ];

  const getStepStatus = (stepKey) => {
    const statusOrder = ['REPORTED', 'CLASSIFIED', 'ROUTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'CITIZEN_VERIFICATION', 'RESOLVED'];
    const currentIndex = statusOrder.indexOf(c.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (c.status === 'RESOLVED' && stepKey === 'RESOLVED') return 'completed';
    if (c.status === 'CITIZEN_VERIFICATION' && stepKey === 'RESOLUTION_SUBMITTED') return 'active';
    if (c.status === stepKey) return 'active';
    if (currentIndex > stepIndex) return 'completed';
    return 'pending';
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (!officerNameInput) return;
    assignOfficer(c.id, officerNameInput, "+91 98200 " + Math.floor(10005 + Math.random() * 89999));
    setOfficerNameInput('');
  };

  const handleResolutionUpload = (e) => {
    e.preventDefault();
    submitResolution(c.id, resolutionPhotoUrl, resolutionRemarks || "Official repair work completed on location according to municipal quality standard.");
  };

  const handleCitizenVerify = (isConfirmed) => {
    verifyResolution(c.id, isConfirmed, reopenReason);
    setShowReopenInput(false);
  };

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <div className="modal-content max-w-4xl border border-slate-200 bg-white p-6 relative my-8 shadow-2xl rounded-2xl w-full">
        
        {/* Top Title Bar */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                {c.id}
              </span>
              <span className="text-xs text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                {c.category}
              </span>
              {c.slaBreached && (
                <span className="badge badge-breach text-xs font-bold bg-red-100 text-red-800 border-red-300">SLA Escalated</span>
              )}
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">{c.title}</h2>
          </div>

          <button 
            onClick={() => setSelectedComplaint(null)}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lifecycle Progress Stepper */}
        <div className="py-4 border-b border-slate-200">
          <div className="lifecycle-stepper px-4">
            {steps.map((step, idx) => {
              const state = getStepStatus(step.key);
              return (
                <div key={idx} className={`lifecycle-step ${state}`}>
                  <div className="step-node font-bold">
                    {state === 'completed' ? '✓' : idx + 1}
                  </div>
                  <span className="step-label font-bold text-slate-700">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inner Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-200 flex-wrap">
          <button
            onClick={() => setActiveTab('EVIDENCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'EVIDENCE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200'
            }`}
          >
            <Sparkles size={14} />
            Citizen Evidence & AI Analysis
          </button>

          <button
            onClick={() => setActiveTab('RESOLUTION')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'RESOLUTION'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200'
            }`}
          >
            <CheckCircle2 size={14} />
            Resolution Verification
          </button>

          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'TIMELINE'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200'
            }`}
          >
            <Activity size={14} />
            Audit Log ({c.timeline?.length || 0})
          </button>

          {activeRole === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('ADMIN_ACTION')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ml-auto ${
                activeTab === 'ADMIN_ACTION'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <User size={14} />
              Officer Controls
            </button>
          )}
        </div>

        {/* Tab Content 1: Citizen Evidence & AI */}
        {activeTab === 'EVIDENCE' && (
          <div className="py-4 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Photo */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 relative shadow-sm">
                <img src={c.photoUrl} onError={(e)=>{e.target.src=DEFAULT_FALLBACK_IMAGE}} alt="Citizen Photo" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-800 border border-slate-200 shadow-sm">
                  Uploaded Photo Evidence
                </div>
              </div>

              {/* Details & AI breakdown */}
              <div className="space-y-3">
                <div className="glass-panel p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs shadow-sm">
                  <div className="flex items-center justify-between text-slate-700 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5 font-bold text-slate-900">
                      <MapPin size={14} className="text-amber-600" />
                      {c.locationName}
                    </span>
                    <span className="text-teal-700 font-mono font-bold">{c.ward}</span>
                  </div>

                  <p className="text-slate-800 leading-relaxed pt-1 font-medium">
                    "{c.description}"
                  </p>
                </div>

                {/* AI Box */}
                <div className="glass-panel p-3 bg-white border border-teal-200 rounded-xl text-xs space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-teal-800 font-bold border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-teal-600" />
                      AI Diagnostic Engine
                    </span>
                    <span className="text-[11px] bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded font-bold">
                      {c.confidence}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 font-semibold">Assigned Department:</span>
                      <p className="font-bold text-slate-900">{c.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Priority Score:</span>
                      <p className="font-bold text-amber-700">{c.priorityScore}/100 ({c.priorityLevel})</p>
                    </div>
                  </div>
                </div>

                {/* Officer assignment card */}
                <div className="glass-panel p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-slate-500 font-semibold">Assigned Officer:</span>
                    <p className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <User size={13} className="text-emerald-600" />
                      {c.assignedOfficer}
                    </p>
                  </div>
                  {c.officerPhone && (
                    <a href={`tel:${c.officerPhone}`} className="text-emerald-700 font-mono font-bold flex items-center gap-1 hover:underline">
                      <Phone size={12} />
                      {c.officerPhone}
                    </a>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab Content 2: Resolution & Before/After Verification */}
        {activeTab === 'RESOLUTION' && (
          <div className="py-4 space-y-4">
            
            {c.resolution ? (
              <div>
                <h4 className="font-heading font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Official Repair & Resolution Proof
                </h4>

                {/* Before/After Interactive Comparison Slider */}
                <BeforeAfterViewer 
                  beforeUrl={c.photoUrl} 
                  afterUrl={c.resolution.afterPhotoUrl} 
                />

                <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs shadow-sm mt-3">
                  <div className="flex items-center justify-between text-slate-600 border-b border-slate-100 pb-2">
                    <span>Uploaded By: <strong className="text-slate-900">{c.resolution.submittedBy}</strong></span>
                    <span>Completed At: <strong className="text-emerald-700 font-mono font-bold">{new Date(c.resolution.completedAt).toLocaleString()}</strong></span>
                  </div>
                  <p className="text-slate-800 italic font-medium">
                    "{c.resolution.remarks}"
                  </p>
                </div>

                {/* Citizen Verification Panel */}
                <div className="glass-panel p-4 bg-emerald-50/50 border border-emerald-300 rounded-xl mt-4 space-y-3 shadow-sm">
                  <h4 className="font-heading font-bold text-sm text-emerald-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    Citizen Sign-Off Required
                  </h4>

                  {c.resolution.verifiedByCitizen === 'CONFIRMED' ? (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2 font-bold">
                      <CheckCircle2 size={18} className="text-emerald-700" />
                      Resolution Confirmed & Signed Off by Citizen! Ticket closed.
                    </div>
                  ) : c.resolution.verifiedByCitizen === 'REJECTED' ? (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-xs text-red-900 flex items-center gap-2 font-bold">
                      <AlertTriangle size={18} className="text-red-700" />
                      Resolution Rejected by Citizen. Reopened for field rework.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 font-medium">
                        Does the official repair photo accurately reflect that the issue on site has been fully resolved?
                      </p>

                      {!showReopenInput ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCitizenVerify(true)}
                            className="btn-primary py-2 px-4 text-xs font-bold bg-emerald-600 text-white rounded-xl shadow-sm"
                          >
                            <ThumbsUp size={15} />
                            Confirm Issue Resolved
                          </button>

                          <button
                            onClick={() => setShowReopenInput(true)}
                            className="btn-danger py-2 px-4 text-xs font-bold bg-red-600 text-white rounded-xl"
                          >
                            <ThumbsDown size={15} />
                            Issue Still Exists (Reopen Ticket)
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <label className="form-label text-xs text-slate-800 font-bold">Reason for Reopening Ticket</label>
                          <textarea 
                            rows="2"
                            value={reopenReason}
                            onChange={(e) => setReopenReason(e.target.value)}
                            placeholder="Specify why the repair is incomplete or unsatisfactory..."
                            className="form-textarea text-xs bg-white border-slate-300 text-slate-900"
                          ></textarea>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCitizenVerify(false)}
                              className="btn-danger py-1.5 px-3 text-xs font-bold bg-red-600 text-white rounded-lg"
                            >
                              Submit Reopen Request
                            </button>
                            <button
                              onClick={() => setShowReopenInput(false)}
                              className="btn-secondary py-1.5 px-3 text-xs bg-slate-100 text-slate-800 border-slate-300 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-8 text-center glass-panel border border-slate-200 bg-white rounded-xl space-y-2 shadow-sm">
                <Clock size={32} className="mx-auto text-amber-600 animate-pulse" />
                <h4 className="font-heading font-bold text-slate-900">Resolution Pending</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Field officer is currently executing repairs on site. Before/After proof will be uploaded here upon completion.
                </p>
              </div>
            )}

          </div>
        )}

        {/* Tab Content 3: Timeline Audit Log */}
        {activeTab === 'TIMELINE' && (
          <div className="py-4 space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 mb-3">Chronological Lifecycle Audit Log</h4>
            <div className="space-y-3 pl-2 border-l-2 border-slate-300">
              {c.timeline?.map((item, idx) => (
                <div key={idx} className="relative pl-6 pb-2 group">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                  </div>
                  <div className="glass-panel p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{item.text}</p>
                    <div className="text-[10px] text-slate-500 font-semibold">Actor: {item.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: Admin Controls */}
        {activeTab === 'ADMIN_ACTION' && activeRole === 'ADMIN' && (
          <div className="py-4 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Assign Officer Form */}
              <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
                <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <User size={16} className="text-teal-600" />
                  Assign Municipal Officer
                </h4>
                
                <form onSubmit={handleAssign} className="space-y-3">
                  <div>
                    <label className="form-label text-xs text-slate-800 font-bold">Officer Name & Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Inspector Ramesh Shah (PWD)"
                      value={officerNameInput}
                      onChange={(e) => setOfficerNameInput(e.target.value)}
                      className="form-input text-xs bg-white border-slate-300 text-slate-900"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-amber py-2 px-3 text-xs font-bold w-full justify-center bg-amber-600 text-white rounded-xl shadow-sm">
                    Assign Field Officer
                  </button>
                </form>
              </div>

              {/* Submit Resolution Form */}
              <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-sm">
                <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Upload size={16} className="text-emerald-600" />
                  Upload Resolution Proof (After Repair Photo)
                </h4>

                <form onSubmit={handleResolutionUpload} className="space-y-3">
                  <div>
                    <label className="form-label text-xs text-slate-800 font-bold">Repair Photo URL</label>
                    <input 
                      type="text" 
                      value={resolutionPhotoUrl}
                      onChange={(e) => setResolutionPhotoUrl(e.target.value)}
                      className="form-input text-xs font-mono bg-white border-slate-300 text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs text-slate-800 font-bold">Completion Remarks</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cold mix asphalt laying finished."
                      value={resolutionRemarks}
                      onChange={(e) => setResolutionRemarks(e.target.value)}
                      className="form-input text-xs bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <button type="submit" className="btn-primary py-2 px-3 text-xs font-bold w-full justify-center bg-emerald-600 text-white rounded-xl shadow-sm">
                    Mark Work Completed & Request Verification
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
