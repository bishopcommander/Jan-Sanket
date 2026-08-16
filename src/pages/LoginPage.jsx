import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Building, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null); // 'CITIZEN' | 'ADMIN'
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1); // 1 = role select, 2 = credentials

  const handleContinue = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(selectedRole, name.trim());
    navigate(selectedRole === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Brand */}
      <div className="flex flex-col items-center mb-10 gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-2xl shadow-emerald-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="text-emerald-400 w-8 h-8" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-heading">Jan Sanket</h1>
          <p className="text-slate-400 text-sm mt-1">AI-Assisted Civic Issue Resolution Platform</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md glass-panel border border-slate-800 bg-slate-900/70 p-8 rounded-3xl shadow-2xl">

        {step === 1 ? (
          <>
            <h2 className="text-xl font-extrabold text-white font-heading mb-1">Choose Your Portal</h2>
            <p className="text-slate-400 text-sm mb-6">Select how you want to access Jan Sanket</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Citizen Card */}
              <button
                onClick={() => { setSelectedRole('CITIZEN'); setStep(2); }}
                className={`group p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                  selectedRole === 'CITIZEN'
                    ? 'border-emerald-500 bg-emerald-950/40'
                    : 'border-slate-800 bg-slate-950/60 hover:border-emerald-500/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <User size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-sm font-heading">Citizen Portal</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">Report issues, track complaints & verify resolutions</p>
                <div className="mt-3 flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  Enter <ArrowRight size={13} />
                </div>
              </button>

              {/* Admin Card */}
              <button
                onClick={() => { setSelectedRole('ADMIN'); setStep(2); }}
                className={`group p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                  selectedRole === 'ADMIN'
                    ? 'border-amber-500 bg-amber-950/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-amber-500/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Building size={20} className="text-amber-400" />
                </div>
                <h3 className="font-bold text-white text-sm font-heading">Official Portal</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">Manage complaints, assign officers & upload resolutions</p>
                <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-bold">
                  Enter <ArrowRight size={13} />
                </div>
              </button>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
              <Sparkles size={14} className="text-teal-400 mt-0.5 shrink-0" />
              <span>This is a prototype demo. No real data is stored or transmitted.</span>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-5 hover:text-white transition-colors"
            >
              ← Back to portal selection
            </button>

            <div className={`flex items-center gap-3 p-3 rounded-xl border mb-6 ${
              selectedRole === 'ADMIN'
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-emerald-950/30 border-emerald-500/40'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                selectedRole === 'ADMIN' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
              }`}>
                {selectedRole === 'ADMIN'
                  ? <Building size={18} className="text-amber-400" />
                  : <User size={18} className="text-emerald-400" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {selectedRole === 'ADMIN' ? 'Municipal Official Login' : 'Citizen Login'}
                </h3>
                <p className="text-xs text-slate-400">{selectedRole === 'ADMIN' ? 'Administration Portal' : 'Citizen Services Portal'}</p>
              </div>
            </div>

            <form onSubmit={handleContinue} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={selectedRole === 'ADMIN' ? 'e.g. Rajesh Kumar, Ward Officer' : 'e.g. Amit Verma'}
                  className="form-input"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password (Demo)</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Any password works in demo mode"
                    className="form-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  selectedRole === 'ADMIN'
                    ? 'btn-amber shadow-amber-500/20'
                    : 'btn-primary shadow-emerald-500/20'
                }`}
              >
                <ArrowRight size={18} />
                Enter {selectedRole === 'ADMIN' ? 'Admin Portal' : 'Citizen Portal'}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="text-slate-600 text-xs mt-6">Jan Sanket — AI Civic Governance Platform © 2026</p>
    </div>
  );
}
