import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroStats from './components/HeroStats';
import ComplaintCard from './components/ComplaintCard';
import ReportModal from './components/ReportModal';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import AdminDashboard from './components/AdminDashboard';
import SmartCityDashboard from './components/SmartCityDashboard';
import { 
  Sparkles, Filter, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  MapPin, Plus, HeartHandshake, Code2, Globe, Flame
} from 'lucide-react';

function MainApp() {
  const { 
    complaints, 
    activeRole, 
    activeTab, 
    setSelectedComplaint, 
    setIsReportModalOpen 
  } = useApp();

  const [feedFilter, setFeedFilter] = useState('ALL'); // 'ALL' | 'VERIFICATION' | 'CRITICAL' | 'RESOLVED'

  // Filter complaints for public/citizen feed
  const displayComplaints = complaints.filter(c => {
    if (activeTab === 'MY_COMPLAINTS') {
      // In demo mode, show user's created/tracked issues
      return true;
    }
    if (feedFilter === 'VERIFICATION') return c.status === 'CITIZEN_VERIFICATION';
    if (feedFilter === 'CRITICAL') return c.severity === 'CRITICAL' || c.priorityLevel === 'HIGH';
    if (feedFilter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body View Switching */}
      <main className="flex-1">
        
        {activeTab === 'SMART_CITY' ? (
          <SmartCityDashboard />
        ) : activeRole === 'ADMIN' || activeTab === 'ADMIN_TABLE' || activeTab === 'ADMIN_MAP' ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Hero Section */}
            <HeroStats />

            {/* Public Complaint Feed & Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
                    <Flame className="text-amber-400" />
                    Civic Incident Feed
                  </h3>
                  <p className="text-xs text-slate-400">Live AI-classified municipal issues & citizen resolution verification</p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                  <button
                    onClick={() => setFeedFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      feedFilter === 'ALL'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Incidents ({complaints.length})
                  </button>

                  <button
                    onClick={() => setFeedFilter('VERIFICATION')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      feedFilter === 'VERIFICATION'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock size={13} className="text-amber-400" />
                    Verify Proof ({complaints.filter(c => c.status === 'CITIZEN_VERIFICATION').length})
                  </button>

                  <button
                    onClick={() => setFeedFilter('CRITICAL')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      feedFilter === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle size={13} className="text-red-400" />
                    Critical Priority
                  </button>

                  <button
                    onClick={() => setFeedFilter('RESOLVED')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      feedFilter === 'RESOLVED'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 size={13} className="text-cyan-400" />
                    Resolved ({complaints.filter(c => c.status === 'RESOLVED').length})
                  </button>
                </div>
              </div>

              {/* Complaints Grid */}
              {displayComplaints.length === 0 ? (
                <div className="p-12 text-center glass-panel border border-slate-800 bg-slate-900/40 rounded-2xl space-y-3">
                  <Sparkles size={36} className="mx-auto text-slate-600" />
                  <h4 className="font-heading font-bold text-lg text-slate-300">No Incidents Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No complaints currently match this filter. Be the first to log a new civic issue!
                  </p>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="btn-primary py-2 px-4 text-xs font-bold mx-auto mt-2"
                  >
                    <Plus size={16} />
                    Report New Issue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayComplaints.map((complaint) => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      onSelect={(item) => setSelectedComplaint(item)} 
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}

      </main>

      {/* Modals */}
      <ReportModal />
      <ComplaintDetailModal />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500 w-5 h-5" />
            <span className="font-heading font-bold text-slate-300">Jan Sanket Platform</span>
            <span>— AI-Assisted Civic Resolution & Governance</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Report → AI Classify → Route → Resolve → Verify</span>
            <span className="text-emerald-400 font-bold">100% Verification SLA</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
