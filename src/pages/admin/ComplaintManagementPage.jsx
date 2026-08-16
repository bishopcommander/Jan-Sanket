import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Filter, AlertTriangle, Eye, User, ChevronUp, ChevronDown } from 'lucide-react';

export default function ComplaintManagementPage() {
  const { complaints, assignOfficer } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('ALL');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [sortKey, setSortKey] = useState('updatedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [quickAssign, setQuickAssign] = useState(null);
  const [officerInput, setOfficerInput] = useState('');

  const filtered = complaints
    .filter(c => {
      if (priority !== 'ALL' && c.priorityLevel !== priority) return false;
      if (department !== 'ALL' && c.department !== department) return false;
      if (status !== 'ALL' && c.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.ward.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }) => sortKey === k ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : null;

  const depts = [...new Set(complaints.map(c => c.department))];

  return (
    <div className="max-w-full px-4 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Complaint Management</h1>
          <p className="text-slate-600 text-sm">{filtered.length} complaints · Assign, prioritize & escalate</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel border border-slate-200 bg-white p-4 rounded-2xl flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-48">
          <input type="text" placeholder="Search ID, title, ward..." value={search} onChange={e => setSearch(e.target.value)} className="form-input text-xs pl-8 py-2 bg-slate-50 border-slate-300 text-slate-900" />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
        {[
          { label: 'Priority', value: priority, setter: setPriority, opts: [['ALL', 'All Priorities'], ['HIGH', 'High'], ['MEDIUM', 'Medium']] },
          { label: 'Status', value: status, setter: setStatus, opts: [['ALL', 'All Status'], ['CLASSIFIED', 'Classified'], ['ROUTED', 'Routed'], ['ASSIGNED', 'Assigned'], ['IN_PROGRESS', 'In Progress'], ['CITIZEN_VERIFICATION', 'Verification'], ['RESOLVED', 'Resolved']] },
        ].map(({ label, value, setter, opts }) => (
          <div key={label} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter size={13} className="text-slate-400" />
            <select value={value} onChange={e => setter(e.target.value)} className="bg-transparent text-slate-900 focus:outline-none font-semibold">
              {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        ))}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <select value={department} onChange={e => setDepartment(e.target.value)} className="bg-transparent text-slate-900 focus:outline-none font-semibold">
            <option value="ALL">All Departments</option>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                {[
                  { label: 'ID', key: 'id' },
                  { label: 'Title & Category', key: 'title' },
                  { label: 'Ward', key: 'ward' },
                  { label: 'Priority', key: 'priorityScore' },
                  { label: 'Department & Officer', key: 'department' },
                  { label: 'SLA', key: 'slaHoursRemaining' },
                  { label: 'Status', key: 'status' },
                  { label: 'Actions', key: null },
                ].map(({ label, key }) => (
                  <th key={label} onClick={key ? () => toggleSort(key) : undefined} className={`py-3.5 px-4 text-left ${key ? 'cursor-pointer hover:text-slate-900 select-none' : ''}`}>
                    <span className="flex items-center gap-1">{label}{key && <SortIcon k={key} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.length === 0 && (
                <tr><td colSpan="8" className="py-10 text-center text-slate-500 font-semibold">No complaints match your filters.</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-extrabold text-emerald-700">{c.id}</td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">{c.title}</div>
                    <div className="text-[11px] text-slate-500">{c.category}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 truncate max-w-[120px]">{c.ward}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${c.priorityLevel === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                      {c.priorityLevel}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Score: {c.priorityScore}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-700 text-[11px] font-semibold truncate max-w-[130px]">{c.department}</div>
                    {quickAssign === c.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input type="text" placeholder="Officer name" value={officerInput} onChange={e => setOfficerInput(e.target.value)} className="form-input text-[10px] py-0.5 px-1.5 w-24 bg-white border-slate-300" />
                        <button onClick={() => { if (officerInput) { assignOfficer(c.id, officerInput); setQuickAssign(null); setOfficerInput(''); } }} className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">✓</button>
                        <button onClick={() => { setQuickAssign(null); setOfficerInput(''); }} className="text-slate-500 text-[10px]">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setQuickAssign(c.id)} className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5 mt-0.5">
                        <User size={10} /> {c.assignedOfficer === 'Pending Assignment' || !c.assignedOfficer ? 'Assign Officer' : c.assignedOfficer}
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {c.slaHoursRemaining < 0 || c.slaBreached ? (
                      <span className="text-red-700 font-extrabold flex items-center gap-1"><AlertTriangle size={11} /> Breached</span>
                    ) : <span className="text-slate-700 font-bold">{c.slaHoursRemaining}h left</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      c.status === 'CITIZEN_VERIFICATION' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>{c.status.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => navigate(`/admin/complaints/${c.id}`)} className="btn-secondary py-1 px-2.5 text-[11px] font-bold flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300">
                      <Eye size={12} /> Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
