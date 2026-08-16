import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Filter, AlertTriangle, CheckCircle2, ShieldCheck, Building2, Eye, Layers } from 'lucide-react';

export default function AdminMapView() {
  const { complaints, setSelectedComplaint } = useApp();
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const filtered = complaints.filter(c => {
    if (selectedWard !== 'ALL' && !c.ward.includes(selectedWard)) return false;
    if (selectedDept !== 'ALL' && c.department !== selectedDept) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Map Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
            <MapPin className="text-amber-400" />
            GIS Municipal Jurisdiction Map
          </h2>
          <p className="text-xs text-slate-400">Live Ward Issue Pin Mapping & Hotspot Visualizer</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Filter size={14} className="text-emerald-400" />
            <select 
              value={selectedWard} 
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none"
            >
              <option value="ALL">All Wards</option>
              <option value="Ward 12">Ward 12 (Central)</option>
              <option value="Ward 8">Ward 8 (North)</option>
              <option value="Ward 4">Ward 4 (West)</option>
              <option value="Ward 3">Ward 3 (East)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Building2 size={14} className="text-amber-400" />
            <select 
              value={selectedDept} 
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Public Works Department (PWD)">Public Works (PWD)</option>
              <option value="Solid Waste Management (SWM)">Solid Waste (SWM)</option>
              <option value="Electrical Department">Electrical Dept</option>
              <option value="Water Supply & Hydro Utility">Water Supply Utility</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Layout: Map Canvas + Interactive Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        
        {/* Map View Box (2 Cols) */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 relative overflow-hidden h-full rounded-2xl flex flex-col">
          
          {/* Mock Interactive Map Interface with dark mode tile grid */}
          <div className="relative w-full h-full bg-slate-950 p-4 flex flex-col justify-between overflow-hidden">
            
            {/* Ambient Gridlines mimicking GIS software */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
            
            {/* Top Overlay Legend */}
            <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 shadow-xl">
              <span className="font-bold text-white block mb-1">GIS Priority Legend</span>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/50 animate-pulse"></span>
                Critical / SLA Breached
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-md shadow-amber-500/50"></span>
                High / Medium Active Issue
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50"></span>
                Verified & Resolved
              </div>
            </div>

            {/* Simulated Map Markers Grid */}
            <div className="relative w-full h-full z-10 flex items-center justify-center">
              {filtered.map((item, idx) => {
                // Calculate position offsets for demo map representation
                const topPos = 20 + ((idx * 23 + item.priorityScore) % 65);
                const leftPos = 15 + ((idx * 31 + item.confidence) % 70);

                const isBreached = item.slaBreached || item.slaHoursRemaining < 0;
                const isResolved = item.status === 'RESOLVED';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedComplaint(item)}
                    style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                    className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-20"
                  >
                    {/* Pulsing Ring */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-slate-950 font-extrabold shadow-2xl transition-transform ${
                      isBreached
                        ? 'bg-red-500 shadow-red-500/60 ring-4 ring-red-500/30 animate-pulse'
                        : isResolved
                        ? 'bg-emerald-500 shadow-emerald-500/60'
                        : 'bg-amber-500 shadow-amber-500/60'
                    }`}>
                      <MapPin size={18} className="text-slate-950" />
                    </div>

                    {/* Marker Tooltip Popover */}
                    <div className="absolute left-1/2 bottom-12 transform -translate-x-1/2 hidden group-hover:block w-56 glass-panel border border-slate-700 bg-slate-950 p-3 shadow-2xl z-30 pointer-events-none text-xs">
                      <div className="font-mono text-emerald-400 font-bold mb-1">{item.id}</div>
                      <div className="font-bold text-white line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.ward} • {item.department}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
              GPS Center: 19.0760° N, 72.8777° E (Mumbai Municipal Region)
            </div>

          </div>
        </div>

        {/* Sidebar Issue Feed (1 Col) */}
        <div className="glass-panel border border-slate-800 p-4 h-full overflow-y-auto space-y-3">
          <h3 className="font-heading font-bold text-sm text-white flex items-center justify-between">
            <span>Mapped Incidents ({filtered.length})</span>
            <span className="text-xs text-slate-400">Click pin or card</span>
          </h3>

          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedComplaint(item)}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1 text-xs"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">{item.id}</span>
                <span className="text-slate-400">{item.ward}</span>
              </div>
              <h4 className="font-bold text-white truncate">{item.title}</h4>
              <p className="text-[11px] text-slate-400 truncate">{item.department}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
