import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AdminMapView from './AdminMapView';
import { 
  Building, Filter, Search, AlertTriangle, CheckCircle2, Clock, MapPin, 
  User, ShieldAlert, ArrowUpDown, Eye, Plus, Sparkles, Map, List
} from 'lucide-react';

export default function AdminDashboard() {
  const { complaints, setSelectedComplaint, assignOfficer, activeTab, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Quick officer assignment state for table row
  const [quickAssignId, setQuickAssignId] = useState(null);
  const [quickOfficerName, setQuickOfficerName] = useState('');

  const filteredComplaints = complaints.filter(c => {
    if (priorityFilter !== 'ALL' && c.priorityLevel !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (departmentFilter !== 'ALL' && c.department !== departmentFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total = complaints.length;
  const breaches = complaints.filter(c => c.slaBreached || c.slaHoursRemaining < 0).length;
  const inVerification = complaints.filter(c => c.status === 'CITIZEN_VERIFICATION').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Admin Navigation Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-extrabold text-3xl text-white">Municipal Operations Hub</h2>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time civic complaint dispatch, SLA tracking & officer assignments</p>
        </div>

        {/* View Mode Toggle: Table vs Map */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('ADMIN_TABLE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ADMIN_TABLE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List size={15} />
            Complaint Management Table
          </button>
          
          <button
            onClick={() => setActiveTab('ADMIN_MAP')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ADMIN_MAP'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map size={15} />
            GIS Ward Map View
          </button>
        </div>
      </div>

      {activeTab === 'ADMIN_MAP' ? (
        <AdminMapView />
      ) : (
        <>
          {/* Executive Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-5 border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Total Active Tickets</span>
                <Building size={16} className="text-teal-400" />
              </div>
              <div className="text-3xl font-extrabold font-heading text-white">{total}</div>
              <span className="text-[11px] text-slate-400 mt-1">Across 4 Municipal Wards</span>
            </div>

            <div className="glass-panel p-5 border border-red-500/30 bg-red-950/20">
              <div className="flex items-center justify-between text-xs text-red-400 font-semibold mb-2">
                <span>Critical SLA Breaches</span>
                <AlertTriangle size={16} className="text-red-400 animate-bounce" />
              </div>
              <div className="text-3xl font-extrabold font-heading text-red-400">{breaches}</div>
              <span className="text-[11px] text-red-400/80 mt-1">Auto-Escalated to Zonal Officer</span>
            </div>

            <div className="glass-panel p-5 border border-amber-500/30 bg-amber-950/20">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-2">
                <span>Verification Pending</span>
                <Clock size={16} className="text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold font-heading text-amber-300">{inVerification}</div>
              <span className="text-[11px] text-slate-400 mt-1">Awaiting Citizen Approval</span>
            </div>

            <div className="glass-panel p-5 border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
                <span>Verified & Closed</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold font-heading text-emerald-400">{resolved}</div>
              <span className="text-[11px] text-emerald-400/80 mt-1">100% Quality Audited</span>
            </div>

          </div>

          {/* Search & Filters Controls Bar */}
          <div className="glass-panel p-4 border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <input 
                type="text"
                placeholder="Search ticket ID, category, ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input text-xs pl-9 pr-4 py-2 bg-slate-950 border-slate-800"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-slate-500" />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-400 font-semibold">Priority:</span>
                <select 
                  value={priorityFilter} 
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-400 font-semibold">Department:</span>
                <select 
                  value={departmentFilter} 
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Public Works Department (PWD)">PWD</option>
                  <option value="Solid Waste Management (SWM)">Solid Waste (SWM)</option>
                  <option value="Electrical Department">Electrical</option>
                  <option value="Water Supply & Hydro Utility">Water Utility</option>
                </select>
              </div>

            </div>

          </div>

          {/* Master Complaint Table */}
          <div className="glass-panel border border-slate-800 bg-slate-900/60 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ticket ID</th>
                    <th className="py-3.5 px-4">Category & Title</th>
                    <th className="py-3.5 px-4">Ward / Location</th>
                    <th className="py-3.5 px-4">Priority / Severity</th>
                    <th className="py-3.5 px-4">Assigned Department & Officer</th>
                    <th className="py-3.5 px-4">SLA Deadline</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400">
                        No complaints match your search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {c.id}
                        </td>

                        {/* Title */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-white line-clamp-1">{c.title}</div>
                          <div className="text-[11px] text-slate-400">{c.category}</div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200 truncate max-w-[140px]">{c.locationName}</div>
                          <div className="text-[10px] text-teal-400">{c.ward}</div>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              c.priorityLevel === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {c.priorityLevel}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              Score: {c.priorityScore}
                            </span>
                          </div>
                        </td>

                        {/* Officer */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-300">{c.department}</div>
                          {quickAssignId === c.id ? (
                            <div className="flex items-center gap-1 mt-1">
                              <input 
                                type="text"
                                placeholder="Officer Name"
                                value={quickOfficerName}
                                onChange={(e) => setQuickOfficerName(e.target.value)}
                                className="form-input text-[11px] py-0.5 px-1.5 w-28 bg-slate-950"
                              />
                              <button 
                                onClick={() => {
                                  if (quickOfficerName) {
                                    assignOfficer(c.id, quickOfficerName, "+91 98200 " + Math.floor(10000 + Math.random() * 89999));
                                    setQuickAssignId(null);
                                    setQuickOfficerName('');
                                  }
                                }}
                                className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold text-[10px]"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => setQuickAssignId(c.id)}
                              className="text-[11px] text-emerald-400 font-semibold cursor-pointer hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <User size={12} />
                              {c.assignedOfficer || "Click to Assign"}
                            </div>
                          )}
                        </td>

                        {/* SLA */}
                        <td className="py-3.5 px-4 font-mono">
                          {c.slaBreached || c.slaHoursRemaining < 0 ? (
                            <span className="text-red-400 font-bold flex items-center gap-1 text-[11px]">
                              <AlertTriangle size={12} /> Breached
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[11px]">{c.slaHoursRemaining}h remaining</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            c.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            c.status === 'CITIZEN_VERIFICATION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="btn-secondary py-1 px-2.5 text-[11px] font-bold"
                          >
                            <Eye size={13} />
                            Inspect & Manage
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
