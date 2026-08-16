import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, Layers, Filter, Calendar, ChevronRight, ChevronLeft, 
  Sparkles, Users, Building2, Clock, CheckCircle2, AlertTriangle, Eye, Flame, Activity, X
} from 'lucide-react';

// Color definition by category
const CATEGORY_COLORS = {
  Potholes: { bg: '#ef4444', text: 'text-red-400', border: 'border-red-500', glow: 'rgba(239, 68, 68, 0.4)', label: 'Red = Pothole' },
  Garbage: { bg: '#d97706', text: 'text-amber-500', border: 'border-amber-600', glow: 'rgba(217, 119, 6, 0.4)', label: 'Brown = Garbage' },
  Streetlight: { bg: '#eab308', text: 'text-yellow-400', border: 'border-yellow-500', glow: 'rgba(234, 179, 8, 0.4)', label: 'Yellow = Streetlight' },
  Water: { bg: '#3b82f6', text: 'text-blue-400', border: 'border-blue-500', glow: 'rgba(59, 130, 246, 0.4)', label: 'Blue = Water / Drainage' }
};

export default function SmartCityDashboard() {
  const { complaints, setSelectedComplaint } = useApp();

  // Dashboard state
  const [viewMode, setViewMode] = useState('MARKERS'); // 'MARKERS' | 'HEATMAP'
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Pothole' | 'Garbage' | 'Streetlight' | 'Water'
  const [timeRange, setTimeRange] = useState('THIS_WEEK'); // 'THIS_WEEK' | 'THIS_MONTH' | 'ALL'
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(complaints[0] || null);

  // Map markers & clusters dataset with realistic city coordinates
  const markers = [
    {
      id: "JS-2026-001245",
      title: "Hazardous Deep Pothole near City High School",
      categoryKey: "Potholes",
      categoryLabel: "Pothole & Asphalt Repair",
      color: CATEGORY_COLORS.Potholes.bg,
      reportCount: 23,
      status: "CITIZEN_VERIFICATION",
      department: "Public Works Department (PWD)",
      photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      locationName: "MG Road Entrance, Ward 12",
      x: 32, y: 42,
      isCluster: true,
      clusterCount: 23
    },
    {
      id: "JS-2026-001246",
      title: "Overflowing Community Garbage Dumpster",
      categoryKey: "Garbage",
      categoryLabel: "Solid Waste Overflow",
      color: CATEGORY_COLORS.Garbage.bg,
      reportCount: 14,
      status: "IN_PROGRESS",
      department: "Solid Waste Management (SWM)",
      photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      locationName: "Market Junction, Ward 8",
      x: 58, y: 35,
      isCluster: true,
      clusterCount: 14
    },
    {
      id: "JS-2026-001247",
      title: "Non-Functional Streetlight Corridor",
      categoryKey: "Streetlight",
      categoryLabel: "Street Lighting Outage",
      color: CATEGORY_COLORS.Streetlight.bg,
      reportCount: 8,
      status: "ROUTED",
      department: "Electrical Department",
      photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
      locationName: "Lake View Avenue, Pole #42, Ward 4",
      x: 25, y: 68,
      isCluster: false,
      clusterCount: 8
    },
    {
      id: "JS-2026-001248",
      title: "Burst Pipeline Gushing Water",
      categoryKey: "Water",
      categoryLabel: "Water Main Leakage",
      color: CATEGORY_COLORS.Water.bg,
      reportCount: 31,
      status: "RESOLVED",
      department: "Water Supply & Hydro Utility",
      photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
      locationName: "Subhash Nagar 3rd Cross, Ward 3",
      x: 75, y: 62,
      isCluster: true,
      clusterCount: 31
    },
    {
      id: "JS-2026-001249",
      title: "Clogged Storm Drain Flooding Road",
      categoryKey: "Water",
      categoryLabel: "Drainage & Sewer Overflow",
      color: CATEGORY_COLORS.Water.bg,
      reportCount: 19,
      status: "IN_PROGRESS",
      department: "Drainage Utility Wing",
      photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      locationName: "Station Flyover Underpass, Ward 12",
      x: 40, y: 52,
      isCluster: true,
      clusterCount: 19
    },
    {
      id: "JS-2026-001250",
      title: "Broken Streetlamp Pole Hazardous Wire",
      categoryKey: "Streetlight",
      categoryLabel: "Electrical Hazard",
      color: CATEGORY_COLORS.Streetlight.bg,
      reportCount: 6,
      status: "REPORTED",
      department: "Electrical Department",
      photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
      locationName: "West End Circle, Ward 4",
      x: 18, y: 28,
      isCluster: false,
      clusterCount: 6
    },
    {
      id: "JS-2026-001251",
      title: "Plastic Trash Dump on Riverbed",
      categoryKey: "Garbage",
      categoryLabel: "Illegal Dumping",
      color: CATEGORY_COLORS.Garbage.bg,
      reportCount: 27,
      status: "IN_PROGRESS",
      department: "Solid Waste Management (SWM)",
      photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      locationName: "Riverfront Promenade, Ward 8",
      x: 65, y: 78,
      isCluster: true,
      clusterCount: 27
    }
  ];

  // Filtering
  const filteredMarkers = markers.filter(m => {
    if (categoryFilter !== 'ALL' && m.categoryKey !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#070b12] overflow-hidden select-none font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP OVERLAY TOOLBAR (Deep blue accents, teal filter highlights) */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: View Mode Toggle & Brand Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 px-3 py-2 rounded-2xl shadow-2xl">
          
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Activity size={18} className="animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-none font-heading">SmartCity Monitor</h2>
              <span className="text-[10px] text-teal-400 font-mono">Live GIS Geo-Grid</span>
            </div>
          </div>

          {/* Toggle Switch: Markers View vs Heatmap View */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('MARKERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'MARKERS'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin size={14} />
              Markers View
            </button>

            <button
              onClick={() => setViewMode('HEATMAP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'HEATMAP'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame size={14} />
              Heatmap View
            </button>
          </div>

        </div>

        {/* Right: Category Chips & Time Range Pills */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 p-2 rounded-2xl shadow-2xl">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'ALL'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              All Incidents ({markers.length})
            </button>

            <button
              onClick={() => setCategoryFilter('Potholes')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                categoryFilter === 'Potholes'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/60'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
              Potholes
            </button>

            <button
              onClick={() => setCategoryFilter('Garbage')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                categoryFilter === 'Garbage'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-600/60'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-sm"></span>
              Garbage
            </button>

            <button
              onClick={() => setCategoryFilter('Streetlight')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                categoryFilter === 'Streetlight'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/60'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm"></span>
              Streetlight
            </button>

            <button
              onClick={() => setCategoryFilter('Water')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                categoryFilter === 'Water'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/60'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
              Water/Drainage
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          {/* Time Range Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTimeRange('THIS_WEEK')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                timeRange === 'THIS_WEEK'
                  ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>

            <button
              onClick={() => setTimeRange('THIS_MONTH')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                timeRange === 'THIS_MONTH'
                  ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Month
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN FULL-SCREEN MAP CANVAS */}
      {/* ========================================================================= */}
      <div className="relative w-full h-full bg-[#090d16] flex items-center justify-center overflow-hidden">
        
        {/* Dynamic Dark Mode Grid Topology */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Geographic City Contours simulation */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 200 Q 300 150 500 350 T 900 600 T 1400 400" fill="none" stroke="#1e293b" strokeWidth="6" />
          <path d="M 200 700 Q 600 500 1000 800 T 1600 600" fill="none" stroke="#1e293b" strokeWidth="4" />
          <circle cx="450" cy="400" r="280" fill="rgba(15, 23, 42, 0.4)" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="1100" cy="550" r="320" fill="rgba(15, 23, 42, 0.3)" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Heatmap Layer Effect */}
        {viewMode === 'HEATMAP' && (
          <div className="absolute inset-0 pointer-events-none">
            {filteredMarkers.map((m) => (
              <div 
                key={`heat-${m.id}`}
                style={{
                  top: `${m.y}%`,
                  left: `${m.x}%`,
                  width: `${m.clusterCount * 12 + 120}px`,
                  height: `${m.clusterCount * 12 + 120}px`,
                  background: `radial-gradient(circle, ${m.color}66 0%, ${m.color}22 50%, transparent 70%)`
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 blur-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Clustered Color Markers Overlay */}
        {viewMode === 'MARKERS' && filteredMarkers.map((marker) => {
          const isSelected = selectedMarker?.id === marker.id;

          return (
            <div
              key={marker.id}
              onClick={() => {
                setSelectedMarker(marker);
                setIsSidePanelOpen(true);
              }}
              style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
              className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 z-20"
            >
              {/* Clustered Bubble / Marker Pin */}
              <div className="relative">
                
                {/* Glow ring */}
                <div 
                  className={`absolute -inset-2 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity ${
                    isSelected ? 'opacity-100 scale-125' : ''
                  }`}
                  style={{ background: marker.color }}
                />

                {/* Marker Outer Bubble */}
                <div 
                  style={{ 
                    backgroundColor: marker.color,
                    boxShadow: `0 0 20px ${marker.color}88` 
                  }}
                  className={`relative flex items-center justify-center text-slate-950 font-extrabold shadow-2xl transition-all border-2 border-slate-950 ${
                    marker.isCluster 
                      ? 'w-11 h-11 rounded-full text-xs font-mono tracking-tighter' 
                      : 'w-8 h-8 rounded-full text-[10px]'
                  } ${isSelected ? 'ring-4 ring-teal-400 scale-110' : ''}`}
                >
                  {marker.isCluster ? (
                    <span className="flex flex-col items-center leading-none">
                      <span className="font-extrabold text-sm">{marker.clusterCount}</span>
                      <span className="text-[8px] opacity-80 uppercase tracking-tighter">reports</span>
                    </span>
                  ) : (
                    <MapPin size={16} />
                  )}
                </div>

                {/* Micro Category Dot Tag */}
                <div className="absolute -bottom-1 -right-1 bg-slate-950 text-white rounded-full p-0.5 border border-slate-800 shadow">
                  <span 
                    className="block w-2 h-2 rounded-full" 
                    style={{ backgroundColor: marker.color }}
                  />
                </div>

              </div>

              {/* Hover Quick Card Tooltip */}
              <div className="absolute left-1/2 bottom-14 transform -translate-x-1/2 hidden group-hover:block w-60 glass-panel border border-slate-700 bg-slate-950/95 p-3 rounded-xl shadow-2xl z-40 pointer-events-none text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-teal-400 font-bold">{marker.id}</span>
                  <span className="text-slate-400">Reported by {marker.reportCount} citizens</span>
                </div>
                <h4 className="font-bold text-white line-clamp-1">{marker.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{marker.locationName}</p>
              </div>

            </div>
          );
        })}

      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM-LEFT LEGEND (Color coded category key) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
        <div className="glass-panel border border-slate-800/90 bg-slate-950/90 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl text-xs space-y-2.5 max-w-xs">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-heading font-extrabold text-white flex items-center gap-1.5 text-xs">
              <Layers size={14} className="text-teal-400" />
              Category Legend
            </span>
            <span className="text-[10px] font-mono text-slate-400">Live Pins</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50 shrink-0 animate-pulse"></span>
              <span className="text-slate-200 font-semibold truncate">Red = Pothole</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="w-3 h-3 rounded-full bg-amber-600 shadow-sm shadow-amber-600/50 shrink-0"></span>
              <span className="text-slate-200 font-semibold truncate">Brown = Garbage</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50 shrink-0"></span>
              <span className="text-slate-200 font-semibold truncate">Yellow = Streetlight</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 shrink-0"></span>
              <span className="text-slate-200 font-semibold truncate">Blue = Water/Drainage</span>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RIGHT SIDE PANEL (COLLAPSIBLE - Detailed Selected Issue Inspector) */}
      {/* ========================================================================= */}
      <div 
        className={`absolute top-20 right-6 bottom-6 z-30 w-96 transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-auto ${
          isSidePanelOpen ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+2rem)] opacity-0'
        }`}
      >
        {selectedMarker && (
          <div className="glass-panel border border-slate-800 bg-slate-950/95 backdrop-blur-2xl rounded-3xl h-full flex flex-col justify-between p-5 shadow-2xl overflow-y-auto">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/30">
                    {selectedMarker.id}
                  </span>
                  <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: selectedMarker.color }}>
                    {selectedMarker.categoryKey}
                  </span>
                </div>

                <button 
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  title="Collapse Panel"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Photo Thumbnail */}
              <div className="relative rounded-2xl overflow-hidden h-44 my-4 border border-slate-800 bg-slate-900 shadow-lg">
                <img 
                  src={selectedMarker.photoUrl} 
                  alt={selectedMarker.title} 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Users size={13} className="text-amber-400" />
                  Reported by {selectedMarker.reportCount} citizens
                </div>
              </div>

              {/* Issue Title & Description */}
              <h3 className="font-heading font-extrabold text-lg text-white leading-snug mb-2">
                {selectedMarker.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-4">
                <MapPin size={14} className="text-amber-400 shrink-0" />
                <span className="font-medium truncate">{selectedMarker.locationName}</span>
              </div>

              {/* Status & Department Metadata */}
              <div className="space-y-2 text-xs">
                
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Incident Status:</span>
                  <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase ${
                    selectedMarker.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    selectedMarker.status === 'CITIZEN_VERIFICATION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {selectedMarker.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Building2 size={14} className="text-teal-400" />
                    Assigned Dept:
                  </span>
                  <span className="font-bold text-slate-200 truncate max-w-[160px]">{selectedMarker.department}</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    SLA Clock:
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">18 hours remaining</span>
                </div>

              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  const target = complaints.find(c => c.id === selectedMarker.id) || complaints[0];
                  setSelectedComplaint(target);
                }}
                className="btn-primary py-3 w-full font-extrabold text-sm justify-center rounded-xl shadow-xl shadow-teal-500/20"
              >
                <Eye size={18} />
                View Full Details & Before/After Proof
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Collapse Toggle Floating Button (Shown when side panel is closed) */}
      {!isSidePanelOpen && (
        <button
          onClick={() => setIsSidePanelOpen(true)}
          className="absolute top-24 right-6 z-30 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-teal-400 hover:text-white shadow-2xl pointer-events-auto flex items-center gap-2 text-xs font-bold"
        >
          <ChevronLeft size={18} />
          Inspect Incident
        </button>
      )}

    </div>
  );
}
