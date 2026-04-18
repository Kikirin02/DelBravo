import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Calendar, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Car,
  Shield,
  UserCheck,
  MoreVertical
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Reminder {
  id: string;
  title: string;
  category: 'Licencia' | 'ITV' | 'Seguro' | 'Aduana' | 'Otro';
  date: string;
  description: string;
  isCompleted: boolean;
}

const CATEGORY_ICONS = {
  Licencia: UserCheck,
  ITV: Car,
  Seguro: Shield,
  Aduana: Bell,
  Otro: Clock
};

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('bravo_reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Renovación de Licencia Conducir - Juan P.', category: 'Licencia', date: '2026-05-15', description: 'Trámite presencial en DGT.', isCompleted: false },
      { id: '2', title: 'Inspección Técnica (ITV) - Trailer #4', category: 'ITV', date: '2026-04-20', description: 'Cita reservada a las 10:00 AM.', isCompleted: false },
      { id: '3', title: 'Vencimiento Seguro - Flota Camiones', category: 'Seguro', date: '2026-06-01', description: 'Revisar póliza con corredor.', isCompleted: false }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    category: 'Otro',
    date: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('bravo_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminder.title && newReminder.date) {
      const reminder: Reminder = {
        id: Math.random().toString(36).substr(2, 9),
        title: newReminder.title as string,
        category: newReminder.category as any,
        date: newReminder.date as string,
        description: newReminder.description || '',
        isCompleted: false
      };
      setReminders([reminder, ...reminders]);
      setNewReminder({ title: '', category: 'Otro', date: '', description: '' });
      setIsAdding(false);
    }
  };

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Recordatorios y Alertas</h2>
          <p className="text-slate-500 mt-1">Gestión de vencimientos críticos para la flota y personal.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus size={20} />
          Nuevo Recordatorio
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl"
          >
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Título</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ej: Renovación Seguros"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                  value={newReminder.title}
                  onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                  value={newReminder.category}
                  onChange={e => setNewReminder({ ...newReminder, category: e.target.value as any })}
                >
                  <option value="Licencia">Licencia</option>
                  <option value="ITV">ITV / Inspección</option>
                  <option value="Seguro">Seguro</option>
                  <option value="Aduana">Aduana / Patente</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Fecha de Vencimiento</label>
                <input 
                  required
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                  value={newReminder.date}
                  onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Descripción (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Detalles adicionales..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                  value={newReminder.description}
                  onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                  Guardar Recordatorio
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((reminder, idx) => {
          const Icon = CATEGORY_ICONS[reminder.category];
          const isUrgent = new Date(reminder.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "bg-white p-6 rounded-3xl border transition-all group relative overflow-hidden",
                reminder.isCompleted ? "opacity-60 grayscale border-slate-100" : "border-slate-100 hover:shadow-xl hover:border-brand-primary/20",
                !reminder.isCompleted && isUrgent && "border-red-100 bg-red-50/10 shadow-red-50"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  reminder.isCompleted ? "bg-slate-100 text-slate-400" : 
                  isUrgent ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                )}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => toggleComplete(reminder.id)}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      reminder.isCompleted ? "text-emerald-500 bg-emerald-50" : "text-slate-300 hover:bg-slate-100"
                    )}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className={cn(
                "font-bold text-slate-900 leading-tight mb-2",
                reminder.isCompleted && "line-through"
              )}>
                {reminder.title}
              </h3>
              
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Calendar size={14} />
                <span className={isUrgent && !reminder.isCompleted ? "text-red-600" : ""}>
                   {new Date(reminder.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {isUrgent && !reminder.isCompleted && (
                  <span className="flex items-center gap-1 text-red-600 animate-pulse ml-auto text-[10px]">
                    <AlertCircle size={10} /> PRÓXIMO
                  </span>
                )}
              </div>

              {reminder.description && (
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {reminder.description}
                </p>
              )}

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{reminder.category}</span>
                {!reminder.isCompleted && (
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                     <Clock size={12} />
                     {Math.ceil((new Date(reminder.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                   </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
