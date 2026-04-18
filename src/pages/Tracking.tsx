import React from 'react';
import { motion } from 'motion/react';
import { 
  Anchor, 
  Truck, 
  Plane, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';

export const shipments = [
  {
    id: 'SH-9901',
    type: 'Maersk Liberty',
    origin: 'Shanghai, CN',
    destination: 'Manzanillo, MX',
    eta: '22 Abr 2026',
    status: 'En Tránsito',
    priority: 'Alta',
    icon: Anchor,
    progress: 75
  },
  {
    id: 'SH-9905',
    type: 'Swift Trucking #402',
    origin: 'Laredo, TX',
    destination: 'Monterrey, NL',
    eta: '18 Abr 2026',
    status: 'Arribo en Terminal',
    priority: 'Crítica',
    icon: Truck,
    progress: 100
  },
  {
    id: 'SH-9912',
    type: 'Lufthansa Cargo LH821',
    origin: 'Frankfurt, DE',
    destination: 'AICM, CDMX',
    eta: '19 Abr 2026',
    status: 'Despacho Aduanal',
    priority: 'Media',
    icon: Plane,
    progress: 90
  }
];

export default function Tracking() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Seguimiento de Arribos</h2>
          <p className="text-slate-500 mt-1">Control logístico de mercancías y tiempos de llegada a terminal.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             Actualizar Estados
           </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por guía, contenedor o buque..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} />
          Filtros Avanzados
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {shipments.map((ship, idx) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                ship.status === 'Arribo en Terminal' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
              )}>
                <ship.icon size={32} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{ship.type}</h3>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border",
                    ship.priority === 'Crítica' ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {ship.priority}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5 underline decoration-slate-200 underline-offset-4">
                    <MapPin size={14} />
                    {ship.origin}
                  </div>
                  <ArrowRight size={14} className="text-slate-300" />
                  <div className="flex items-center gap-1.5 text-slate-900">
                    <MapPin size={14} />
                    {ship.destination}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={14} />
                    ETA: {ship.eta}
                  </div>
                </div>
              </div>

              <div className="lg:w-64">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</span>
                  <span className={cn(
                    "text-xs font-bold",
                    ship.status === 'Arribo en Terminal' ? "text-emerald-600" : "text-blue-600"
                  )}>
                    {ship.status}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${ship.progress}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      ship.status === 'Arribo en Terminal' ? "bg-emerald-500" : "bg-blue-500"
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Integración con Terminales</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Recibe notificaciones automáticas cuando tu carga sea liberada o asignada a revisión en aduana mediante nuestras APIs directas con los principales recintos.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    T{i}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-slate-400">+12 Terminales Conectadas</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="text-brand-accent font-bold text-xl mb-1">0.8 hrs</div>
                <div className="text-xs text-slate-400">Tiempo promedio de respuesta</div>
             </div>
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="text-blue-400 font-bold text-xl mb-1">98.2%</div>
                <div className="text-xs text-slate-400">Precisión de ETA</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
