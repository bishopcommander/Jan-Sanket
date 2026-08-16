import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AIClassifierPreview from './AIClassifierPreview';
import { X, Camera, MapPin, Mic, Sparkles, Upload, CheckCircle2, AlertTriangle, Layers, Navigation } from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    key: 'pothole',
    label: 'Deep Road Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    title: 'Severe Pothole on Station Approach Road',
    desc: 'Large 4-foot wide asphalt crater near railway station gate causing severe traffic hazard and vehicle rim damage.',
    location: 'Station Approach Road, Ward 12'
  },
  {
    key: 'garbage',
    label: 'Overflowing Trash Bin',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    title: 'Uncollected Municipal Waste Container',
    desc: 'Garbage dumping site spilling over pedestrian walkway for 3 days. High public health hazard.',
    location: 'Market Road Junction, Ward 8'
  },
  {
    key: 'streetlight',
    label: 'Dark Streetlight Pole',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    title: 'Non-Functional Street Lighting Corridor',
    desc: 'Sequence of 4 streetlights failed. Entire lane in darkness at night.',
    location: 'Nehru Colony Lane 4, Ward 4'
  },
  {
    key: 'water',
    label: 'Water Main Leak',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    title: 'Pipe Leak Gushing Clean Drinking Water',
    desc: 'Burst underground pipe wasting gallons of drinking water onto main road.',
    location: 'Subhash Nagar 2nd Avenue, Ward 3'
  }
];

export default function ReportModal() {
  const { isReportModalOpen, setIsReportModalOpen, addComplaint, classifyCivicIssue, setSelectedComplaint } = useApp();

  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_PRESETS[0]);
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PRESETS[0].url);
  const [title, setTitle] = useState(SAMPLE_PRESETS[0].title);
  const [description, setDescription] = useState(SAMPLE_PRESETS[0].desc);
  const [locationName, setLocationName] = useState(SAMPLE_PRESETS[0].location);
  const [ward, setWard] = useState('Ward 12 (Central Zone)');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteAdded, setVoiceNoteAdded] = useState(false);

  const [aiResult, setAiResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Update AI classification whenever preset/description changes
  useEffect(() => {
    if (!isReportModalOpen) return;
    setIsScanning(true);
    const timer = setTimeout(() => {
      const result = classifyCivicIssue(description || title, selectedPreset.key);
      setAiResult(result);
      setIsScanning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [description, title, selectedPreset, isReportModalOpen]);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setPhotoUrl(preset.url);
    setTitle(preset.title);
    setDescription(preset.desc);
    setLocationName(preset.location);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = addComplaint({
      title,
      description: voiceNoteAdded ? `${description} [Voice Note Transcript Attached: "Urgent fix required due to school traffic"]` : description,
      photoUrl,
      locationName,
      ward,
      imagePresetKey: selectedPreset.key,
      lat: 19.0760 + (Math.random() - 0.5) * 0.05,
      lng: 72.8777 + (Math.random() - 0.5) * 0.05
    });

    setIsReportModalOpen(false);
    setSelectedComplaint(created);
  };

  if (!isReportModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-3xl border border-slate-700 bg-slate-950 p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white">Report Civic Issue</h3>
              <p className="text-xs text-slate-400">AI-Assisted Photo, Voice & Location Submission</p>
            </div>
          </div>

          <button 
            onClick={() => setIsReportModalOpen(false)}
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Sample Issue Selector */}
        <div className="my-4">
          <label className="form-label flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            Quick Demo Presets (Select to Test AI Engine)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.key}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex flex-col justify-between h-20 ${
                  selectedPreset.key === preset.key
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="font-bold">{preset.label}</span>
                <span className="text-[10px] text-slate-500 truncate">{preset.location}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Photo & URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="form-label">Evidence Image</label>
              <div className="relative h-44 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 group">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-xs text-white">
                  <span>Photo Captured & Embedded</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="form-label">Issue Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label flex items-center justify-between">
                  <span>Description / Remarks</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecording(true);
                      setTimeout(() => {
                        setIsRecording(false);
                        setVoiceNoteAdded(true);
                      }, 1500);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 ${
                      voiceNoteAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Mic size={13} className={isRecording ? 'animate-bounce text-red-400' : ''} />
                    {isRecording ? 'Recording Voice...' : voiceNoteAdded ? 'Voice Attached ✓' : '+ Add Voice Note'}
                  </button>
                </label>
                <textarea 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Geolocation Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-400" />
                Location Landmark
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)}
                  className="form-input pr-9"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setLocationName("Auto GPS: 19.0760° N, 72.8777° E (MG Road Crossing)")}
                  className="absolute right-2 top-2.5 text-emerald-400 hover:text-emerald-300"
                  title="Detect GPS Location"
                >
                  <Navigation size={18} />
                </button>
              </div>
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5">
                <Layers size={14} className="text-teal-400" />
                Administrative Ward
              </label>
              <select 
                value={ward} 
                onChange={(e) => setWard(e.target.value)}
                className="form-select"
              >
                <option value="Ward 12 (Central Zone)">Ward 12 (Central Zone)</option>
                <option value="Ward 8 (North Zone)">Ward 8 (North Zone)</option>
                <option value="Ward 4 (West Zone)">Ward 4 (West Zone)</option>
                <option value="Ward 3 (East Zone)">Ward 3 (East Zone)</option>
              </select>
            </div>
          </div>

          {/* AI Live Classifier Box */}
          <AIClassifierPreview aiResult={aiResult} isScanning={isScanning} photoUrl={photoUrl} />

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="btn-secondary py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary py-2.5 text-sm font-bold shadow-xl shadow-emerald-500/20"
            >
              <Sparkles size={18} />
              Submit Ticket to Administration
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
