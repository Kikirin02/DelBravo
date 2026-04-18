import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { ShieldCheck, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = () => {
  const [nip, setNip] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(nip)) {
      setError(false);
    } else {
      setError(true);
      setNip('');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">Bravo Customs</h1>
            <p className="text-indigo-300/60 text-xs font-black uppercase tracking-[0.3em] mt-2">Executive Access Control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-300/40 uppercase tracking-widest block ml-1">
                Pin de Seguridad / NIP
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="password"
                  maxLength={4}
                  value={nip}
                  onChange={(e) => setNip(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-2xl tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                />
              </div>
              {error && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center mt-3">
                  Acceso Denegado. Verifique su NIP.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white text-[#020617] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-[0.98] shadow-xl"
            >
              Ingresar al Sistema
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-4 opacity-50">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-[9px] font-black text-indigo-200/40 uppercase tracking-widest">Servidor SAAI En Línea</span>
          </div>
        </div>

        <div className="text-center mt-8 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Solo Personal Autorizado</p>
          <p className="text-[9px] text-slate-600">ID: AIS-SECURE-2026.MX</p>
        </div>
      </motion.div>
    </div>
  );
};
