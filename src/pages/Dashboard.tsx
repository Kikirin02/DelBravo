import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Package, 
  Zap, 
  BarChart3,
  Globe,
  Anchor,
  ShieldCheck,
  Bell,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const data = [
  { name: 'Lun', pedimentos: 45, errores: 2 },
  { name: 'Mar', pedimentos: 52, errores: 1 },
  { name: 'Mie', pedimentos: 38, errores: 4 },
  { name: 'Jue', pedimentos: 65, errores: 0 },
  { name: 'Vie', pedimentos: 48, errores: 3 },
  { name: 'Sab', pedimentos: 24, errores: 1 },
  { name: 'Dom', pedimentos: 10, errores: 0 },
];

const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend > 0 ? '+' : ''}{trend}% vs mes ant.
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
  </motion.div>
);

export default function Dashboard() {
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bravo_reminders');
    if (saved) {
      setReminders(JSON.parse(saved).filter((r: any) => !r.isCompleted).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
  }, []);

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Resumen Operativo</h2>
          <p className="text-slate-500 text-lg mt-1 font-medium">Panel de control de la agencia aduanal.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
             <Clock size={14} />
             Última actualización: 12:45 PM
           </div>
        </div>
      </header>

      {/* Prominent Reminders Banner */}
      {reminders.length > 0 && reminders.some(r => new Date(r.date).getTime() - new Date().getTime() < 15 * 24 * 60 * 60 * 1000) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm group hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-red-200 shrink-0">
              <Bell size={32} className="animate-[ring_2s_infinite]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900">Vencimientos Críticos Próximos</h3>
              <p className="text-red-700/70 text-sm font-medium mt-1">
                Tienes {reminders.filter(r => new Date(r.date).getTime() - new Date().getTime() < 15 * 24 * 60 * 60 * 1000).length} trámites que vencen en los próximos 15 días. Es necesario actuar pronto.
              </p>
            </div>
          </div>
          <Link 
            to="/reminders" 
            className="w-full lg:w-auto px-8 py-4 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Gestionar Vencimientos
            <ChevronRight size={18} />
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={FileText} 
          label="Pedimentos Validados" 
          value="284" 
          color="bg-blue-50 text-blue-600"
          trend={12}
        />
        <StatCard 
          icon={Anchor} 
          label="Arribos en Terminal" 
          value="18" 
          color="bg-indigo-50 text-indigo-600"
          trend={5}
        />
        <StatCard 
          icon={AlertCircle} 
          label="Glosas con Error" 
          value="04" 
          color="bg-red-50 text-red-600"
          trend={-2}
        />
        <StatCard 
          icon={Globe} 
          label="Aduanas Activas" 
          value="12" 
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <BarChart3 size={20} className="text-brand-primary" />
              Operaciones por Día
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPedimentos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pedimentos" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPedimentos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-xl">
               <div className="relative z-10">
                  <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck size={24} className="text-brand-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Asistente de Glosa</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Sube un PDF de pedimento para validación automática de campos y discrepancias arancelarias.
                  </p>
                  <button className="bg-brand-primary hover:bg-brand-primary/90 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-primary/20">
                     Iniciar Validación
                  </button>
               </div>
               <div className="absolute right-[-40px] bottom-[-40px] opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Zap size={200} />
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-brand-primary" />
                  Arribos Prioritarios
               </h3>
               <div className="space-y-6">
                  {[
                    { id: 'MAEU-1234', ship: 'Maersk Salina', eta: 'In 2h' },
                    { id: 'LU-8891', ship: 'Hapag-Lloyd Express', eta: 'In 5h' },
                    { id: 'T-440', ship: 'Swift Logistics #402', eta: 'Arrived' }
                  ].map((ship, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-primary transition-colors">
                             <Package size={18} />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-900 tracking-tight">{ship.id}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">{ship.ship}</p>
                          </div>
                       </div>
                       <span className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                          ship.eta === 'Arrived' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                       )}>
                          {ship.eta}
                       </span>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-3 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-brand-primary transition-colors border-t border-slate-50">
                  Ver todos los arribos →
               </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 flex flex-col h-full">
              <Globe size={48} className="text-emerald-300/30 mb-8" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-emerald-50">Cumplimiento Normativo</h3>
              <p className="text-emerald-100/70 text-sm leading-relaxed mb-10 flex-1">
                Tu agencia opera bajo los estándares del Anexo 22. Tienes un 99.8% de precisión en glosa este periodo.
              </p>
              <div className="bg-emerald-700/50 p-6 rounded-3xl border border-white/10">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Meta Mensual</span>
                    <span className="text-xs font-bold text-white">94%</span>
                 </div>
                 <div className="w-full bg-emerald-800/50 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-300 w-[94%] h-full rounded-full"></div>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 leading-none">Alertas SAAI</h4>
             <div className="space-y-4">
                {[
                  { msg: 'Firma electrónica vence en 12 días', type: 'warning' },
                  { msg: 'Error de validación en pedimento 260-3501-4409988', type: 'error' }
                ].map((alert, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-xl border flex items-start gap-3",
                    alert.type === 'error' ? "bg-red-50 border-red-100 text-red-700" : "bg-amber-50 border-amber-100 text-amber-700"
                  )}>
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p className="text-xs font-bold leading-tight tracking-tight">{alert.msg}</p>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
