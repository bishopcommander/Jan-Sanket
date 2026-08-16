import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Camera, MapPin, Mic, Sparkles, Navigation, CheckCircle2,
  ArrowLeft, Layers, Tag
} from 'lucide-react';

const PRESETS = [
  { key: 'pothole', label: 'Road Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80', title: 'Hazardous Deep Pothole on Main Road', desc: 'Large asphalt crater causing severe traffic hazard and vehicle damage.', location: 'MG Road Junction, Ward 12' },
  { key: 'garbage', label: 'Garbage Overflow', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80', title: 'Overflowing Municipal Waste Container', desc: 'Garbage bin not emptied for 3 days, spreading across sidewalk.', location: 'Market Road Crossing, Ward 8' },
  { key: 'streetlight', label: 'Streetlight Failure', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80', title: 'Non-Functional Street Lighting Corridor', desc: '4 consecutive streetlights failed, dark corridor at night.', location: 'Lake View Avenue, Ward 4' },
  { key: 'water', label: 'Water Pipe Burst', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80', title: 'Burst Pipeline Wasting Drinking Water', desc: 'Underground pipe burst flooding main road.', location: 'Subhash Nagar 3rd Cross, Ward 3' },
];

export default function ReportIssuePage() {
  const { addComplaint, classifyCivicIssue } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=Evidence, 2=Details, 3=AI Preview, 4=Success
  const [preset, setPreset] = useState(PRESETS[0]);
  const [photoUrl, setPhotoUrl] = useState(PRESETS[0].url);
  const [title, setTitle] = useState(PRESETS[0].title);
  const [description, setDescription] = useState(PRESETS[0].desc);
  const [location, setLocation] = useState(PRESETS[0].location);
  const [ward, setWard] = useState('Ward 12 (Central Zone)');
  const [voiceNote, setVoiceNote] = useState(false);
  const [recording, setRecording] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handlePreset = (p) => {
    setPreset(p);
    setPhotoUrl(p.url);
    setTitle(p.title);
    setDescription(p.desc);
    setLocation(p.location);
  };

  const runAI = () => {
    setIsScanning(true);
    setStep(3);
    setTimeout(() => {
      setAiResult(classifyCivicIssue(description, preset.key));
      setIsScanning(false);
    }, 1800);
  };

  const handleSubmit = () => {
    const c = addComplaint({ title, description: voiceNote ? description + ' [Voice note attached]' : description, photoUrl, locationName: location, ward, imagePresetKey: preset.key });
    setSubmittedTicket(c);
    setStep(4);
  };

  if (step === 4 && submittedTicket) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 size={36} className="text-emerald-700" />
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-heading">Complaint Submitted!</h2>
        <p className="text-slate-600 mt-2">Your issue has been logged and routed to the relevant department.</p>
      </div>
      <div className="glass-panel border border-slate-200 bg-white p-5 rounded-2xl text-left space-y-3 text-sm shadow-sm">
        <div className="flex justify-between"><span className="text-slate-600 font-semibold">Ticket ID</span><span className="font-mono font-bold text-emerald-700">{submittedTicket.id}</span></div>
        <div className="flex justify-between"><span className="text-slate-600 font-semibold">Category</span><span className="text-slate-900 font-semibold">{submittedTicket.category}</span></div>
        <div className="flex justify-between"><span className="text-slate-600 font-semibold">Department</span><span className="text-slate-900 font-semibold">{submittedTicket.department}</span></div>
        <div className="flex justify-between"><span className="text-slate-600 font-semibold">Priority</span><span className="text-amber-700 font-bold">{submittedTicket.priorityLevel}</span></div>
        <div className="flex justify-between"><span className="text-slate-600 font-semibold">Status</span><span className="text-teal-700 font-bold">{submittedTicket.status}</span></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => navigate(`/citizen/complaints/${submittedTicket.id}`)} className="btn-primary py-2.5 px-5 font-bold bg-emerald-600 text-white rounded-xl shadow-sm">Track This Complaint</button>
        <button onClick={() => { setStep(1); setSubmittedTicket(null); }} className="btn-secondary py-2.5 px-5 bg-slate-100 text-slate-800 border-slate-300 rounded-xl font-bold">Report Another</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Report a Civic Issue</h1>
          <p className="text-slate-600 text-sm">AI-assisted classification & auto-routing</p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2 mb-8">
        {['Evidence', 'Issue Details', 'AI Analysis', 'Submit'].map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              step === i + 1 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              step > i + 1 ? 'bg-slate-100 text-emerald-700' : 'text-slate-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${step > i + 1 ? 'bg-emerald-600 text-white' : step === i + 1 ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < 3 && <div className="flex-1 h-px bg-slate-200" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Evidence */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="form-label flex items-center gap-2 mb-3 text-slate-800 font-bold"><Camera size={14} className="text-emerald-600" /> Select Issue Type (Quick Demo Presets)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESETS.map(p => (
                <button key={p.key} type="button" onClick={() => handlePreset(p)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all h-24 flex flex-col justify-between shadow-sm ${
                    preset.key === p.key ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold">{p.label}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{p.location}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label text-slate-800 font-bold">Evidence Photo</label>
            <div className="relative rounded-2xl overflow-hidden h-56 border border-slate-200 bg-slate-100 shadow-sm">
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                <div className="text-xs text-white font-semibold bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-sm">
                  📷 Photo captured — tap presets above to change
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setRecording(true);
                setTimeout(() => { setRecording(false); setVoiceNote(true); }, 1600);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                voiceNote ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                recording ? 'bg-red-100 text-red-800 border-red-300 animate-pulse' :
                'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Mic size={14} className={recording ? 'animate-bounce' : ''} />
              {recording ? 'Recording...' : voiceNote ? '✓ Voice Note Added' : '+ Add Voice Note'}
            </button>
            <button onClick={() => setStep(2)} className="btn-primary py-2.5 px-5 text-sm font-bold bg-emerald-600 text-white rounded-xl shadow-sm">
              Next: Issue Details <ArrowLeft size={16} className="rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="form-group">
            <label className="form-label text-slate-800 font-bold">Issue Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input bg-white border-slate-300 text-slate-900" required />
          </div>
          <div className="form-group">
            <label className="form-label text-slate-800 font-bold">Description / What you observed</label>
            <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} className="form-textarea bg-white border-slate-300 text-slate-900" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label flex items-center gap-1.5 text-slate-800 font-bold"><MapPin size={13} className="text-amber-600" /> Location Landmark</label>
              <div className="relative">
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="form-input bg-white border-slate-300 text-slate-900 pr-10" />
                <button type="button" onClick={() => setLocation('GPS Auto: 19.0760° N, 72.8777° E')} className="absolute right-3 top-3 text-emerald-600">
                  <Navigation size={16} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label flex items-center gap-1.5 text-slate-800 font-bold"><Layers size={13} className="text-teal-600" /> Administrative Ward</label>
              <select value={ward} onChange={e => setWard(e.target.value)} className="form-select bg-white border-slate-300 text-slate-900 font-semibold">
                <option>Ward 12 (Central Zone)</option>
                <option>Ward 8 (North Zone)</option>
                <option>Ward 4 (West Zone)</option>
                <option>Ward 3 (East Zone)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="btn-secondary py-2.5 px-5 text-sm bg-slate-100 text-slate-800 border-slate-300 rounded-xl font-bold">← Back</button>
            <button onClick={runAI} className="btn-primary py-2.5 px-5 text-sm font-bold flex-1 bg-emerald-600 text-white rounded-xl shadow-sm flex items-center justify-center gap-2">
              <Sparkles size={16} /> Run AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* Step 3: AI Result */}
      {step === 3 && (
        <div className="space-y-5">
          {isScanning ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles size={28} className="text-teal-700 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-heading">AI is Analyzing Your Evidence</h3>
                <p className="text-slate-600 text-sm mt-1">Multimodal vision + NLP classification in progress...</p>
              </div>
              <div className="flex gap-1.5 justify-center">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          ) : aiResult && (
            <>
              <div className="glass-panel border border-teal-200 bg-white p-5 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-teal-600" />
                    <h3 className="font-bold text-slate-900 font-heading">AI Classification Result</h3>
                  </div>
                  <span className="text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300 px-2.5 py-1 rounded-full">
                    {aiResult.confidence}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Category', value: aiResult.category },
                    { label: 'Severity', value: aiResult.severity },
                    { label: 'Priority Level', value: aiResult.priorityLevel, bold: true, color: 'text-amber-700' },
                    { label: 'Priority Score', value: `${aiResult.priorityScore}/100` },
                    { label: 'Routed To', value: aiResult.department, full: true },
                  ].map(({ label, value, bold, color, full }) => (
                    <div key={label} className={`bg-slate-50 p-3 rounded-xl border border-slate-200 ${full ? 'col-span-2' : ''}`}>
                      <div className="text-[11px] text-slate-500 font-semibold mb-0.5">{label}</div>
                      <div className={`font-semibold ${color || 'text-slate-900'} ${bold ? 'font-extrabold' : ''}`}>{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Tag size={13} className="text-slate-500" />
                  {aiResult.keywords?.map((k, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-300 font-semibold">#{k}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary py-2.5 px-5 text-sm bg-slate-100 text-slate-800 border-slate-300 rounded-xl font-bold">← Edit Details</button>
                <button onClick={handleSubmit} className="btn-primary py-2.5 px-5 text-sm font-bold flex-1 bg-emerald-600 text-white rounded-xl shadow-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Submit Ticket to Municipality
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
