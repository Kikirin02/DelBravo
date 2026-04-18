import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Share2, Plus, Shield, Clock, Search, Book, Pill } from 'lucide-react';
import { cn } from '../lib/utils';

export const catalog = [
  { id: 1, name: 'AMOXICILLIN TRIHYDRATE', code: '29411012', client: 'PISA AGROPECUARIA', status: 'Activo', type: 'Fármaco' },
  { id: 2, name: 'METFORMIN HYDROCHLORIDE', code: '29252999', client: 'LABORATORIOS PISA', status: 'Activo', type: 'Fármaco' },
  { id: 3, name: 'CEFOTAXIME SODIUM STERILE', code: '29419099', client: 'LABORATORIOS PISA', status: 'Revisión', type: 'Fármaco' },
  { id: 4, name: 'GLUCOSE MONOHYDRATE', code: '17023001', client: 'LABORATORIOS PISA', status: 'Activo', type: 'Fármaco' },
];

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Catálogo de Clasificación (TIGIE)</h2>
          <p className="text-gray-500 text-sm italic font-medium">Bases de datos de productos y fracciones arancelarias.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-800 transition-all">
          <Plus size={16} />
          Nueva Clasificación
        </button>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por descripción, fracción o cliente..." 
            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {catalog.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5, borderColor: '#4338ca' }}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all relative overflow-hidden group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Pill size={24} />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-300 hover:text-indigo-600 rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-4">FRACCIÓN {item.code}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-black uppercase tracking-tight">
                  <Book size={12} />
                  {item.client}
                </div>
                <span className={cn(
                  "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                  item.status === 'Activo' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                )}>
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-indigo-950 rounded-[2.5rem] p-8 text-white self-start sticky top-30 shadow-2xl shadow-indigo-900/40 border border-indigo-400/20">
          <div className="w-14 h-14 bg-indigo-400/20 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-indigo-400/30">
            <Shield size={28} className="text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold mb-3 tracking-tight">Validación TIGIE 2026</h3>
          <p className="text-indigo-200/60 text-xs leading-relaxed mb-8">Todos los códigos están sincronizados con la última actualización de Hacienda y VUCEM.</p>
          <div className="space-y-4 mb-8">
            {['Anexo 22 Integrado', 'NICO Detectado', 'Historial por Aduana'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_#818cf8]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{f}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-white text-indigo-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
             Actualizar Normativa
          </button>
        </div>
      </div>
    </div>
  );
}
