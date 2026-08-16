import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, CheckCircle2, Clock, AlertTriangle, Activity, MapPin, ArrowRight } from 'lucide-react';

export default function HeroStats() {
  const { complaints, setIsReportModalOpen, setActiveRole, setActiveTab } = useApp();

  const total = complaints.length;
  const inVerification = complaints.filter(c => c.status === 'CITIZEN_VERIFICATION').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
  const breached = complaints.filter(c => c.slaBreached || c.slaHoursRemaining < 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-4">
      
      {/* Main Banner Hero */}
      <div className="relative glass-panel overflow-hidden p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="animate-spin" />
              Automated AI Classification & Geo-Routing Engine
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
              Report Civic Issues. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Track Real Resolution Evidence.
              </span>
            </h2>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Jan Sanket captures civic complaints with photo evidence & GPS, auto-detects issue categories via AI, routes to municipal departments with SLA enforcement, and requires citizen verification before closing tickets.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="btn-primary py-2.5 px-5 font-bold text-sm shadow-xl shadow-emerald-500/20"
              >
                <Sparkles size={18} />
                Submit New Complaint (AI Scan)
              </button>
              
              <button
                onClick={() => {
                  setActiveRole('ADMIN');
                  setActiveTab('ADMIN_MAP');
                }}
                className="btn-secondary py-2.5 px-5 text-sm font-semibold flex items-center gap-2"
              >
                <MapPin size={18} className="text-amber-400" />
                Explore GIS Ward Map
              </button>
            </div>
          </div>

          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto">
            
            <div className="glass-panel p-4 border border-slate-800 bg-slate-950/60 flex flex-col justify-between min-w-[130px]">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Total Reported</span>
                <Activity size={15} className="text-teal-400" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-white">{total}</span>
              <span className="text-[11px] text-emerald-400 mt-1 font-medium">100% AI Indexed</span>
            </div>

            <div className="glass-panel p-4 border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between min-w-[130px]">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-1">
                <span>Ready for Verify</span>
                <CheckCircle2 size={15} className="text-emerald-400 animate-bounce" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-emerald-400">{inVerification}</span>
              <span className="text-[11px] text-slate-400 mt-1">Awaiting Citizen Approval</span>
            </div>

            <div className="glass-panel p-4 border border-slate-800 bg-slate-950/60 flex flex-col justify-between min-w-[130px]">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Fully Resolved</span>
                <Shield size={15} className="text-cyan-400" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-white">{resolved}</span>
              <span className="text-[11px] text-cyan-400 mt-1 font-medium">Verified & Closed</span>
            </div>

            <div className="glass-panel p-4 border border-red-500/30 bg-red-950/20 flex flex-col justify-between min-w-[130px]">
              <div className="flex items-center justify-between text-red-400 text-xs font-semibold mb-1">
                <span>SLA Escalated</span>
                <AlertTriangle size={15} className="text-red-400 animate-pulse" />
              </div>
              <span className="text-3xl font-extrabold font-heading text-red-400">{breached}</span>
              <span className="text-[11px] text-red-400/80 mt-1">Auto-Escalated</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
