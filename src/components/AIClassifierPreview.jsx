import React from 'react';
import { Sparkles, ShieldCheck, AlertCircle, Building2, MapPin, Tag } from 'lucide-react';

export default function AIClassifierPreview({ aiResult, isScanning, photoUrl }) {
  if (!aiResult) return null;

  return (
    <div className="glass-panel p-4 border border-teal-500/30 bg-slate-950/80 rounded-xl relative overflow-hidden my-3">
      
      {/* Top AI Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Sparkles size={16} className={isScanning ? 'animate-spin' : ''} />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              Jan Sanket AI Issue Analysis
            </h4>
            <span className="text-[11px] text-slate-400">Multimodal Computer Vision + NLP Scoring</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
          <ShieldCheck size={14} />
          {aiResult.confidence}% AI Match Confidence
        </div>
      </div>

      {/* Main Analysis Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        
        {/* Left Column: Image preview with scan overlay */}
        <div className="relative rounded-lg overflow-hidden border border-slate-800 h-36 bg-slate-900 ai-scan-box">
          <img 
            src={photoUrl} 
            alt="AI Input Evidence" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col justify-end p-2 text-xs font-mono text-emerald-300">
            <span>DETECTED: {aiResult.subcategory.toUpperCase()}</span>
            <span className="text-[10px] text-slate-300">SEVERITY: {aiResult.severity}</span>
          </div>
        </div>

        {/* Right Column: Inferred Attributes */}
        <div className="space-y-2 text-xs">
          
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Mapped Category:</span>
            <span className="font-bold text-emerald-400">{aiResult.category}</span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Building2 size={13} className="text-teal-400" />
              Routed Department:
            </span>
            <span className="font-bold text-slate-200">{aiResult.department}</span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Computed Priority:</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-400">{aiResult.priorityLevel}</span>
              <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mono border border-amber-500/30">
                Score: {aiResult.priorityScore}/100
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-wrap pt-1">
            <Tag size={12} className="text-slate-400" />
            {aiResult.keywords?.map((kw, i) => (
              <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                #{kw}
              </span>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
