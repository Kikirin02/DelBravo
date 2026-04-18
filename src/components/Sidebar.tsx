import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ScrollText, 
  MessageSquare, 
  BookOpen,
  Settings,
  ShieldCheck,
  Ship,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Crown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['JEFE', 'USER'] },
    { icon: ScrollText, label: 'Pedimentos', path: '/pedimentos', roles: ['JEFE', 'USER'] },
    { icon: Ship, label: 'Tracking / Arribos', path: '/tracking', roles: ['JEFE', 'USER'] },
    { icon: Bell, label: 'Recordatorios', path: '/reminders', roles: ['JEFE', 'USER'] },
    { icon: MessageSquare, label: 'Asistente Glosa AI', path: '/assistant', roles: ['JEFE'] },
    { icon: BookOpen, label: 'Catálogo Tarifario', path: '/catalog', roles: ['JEFE', 'USER'] },
  ];

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className={cn(
      "bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 relative",
      isCollapsed ? "w-24" : "w-72"
    )}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm z-50 transition-colors"
        aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={cn(
        "flex items-center gap-4 transition-all duration-300",
        isCollapsed ? "p-4 justify-center" : "p-8 pb-10"
      )}>
        <div className={cn(
          "bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 transition-all",
          isCollapsed ? "w-10 h-10" : "w-12 h-12"
        )}>
          <ShieldCheck size={isCollapsed ? 22 : 28} />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-bold text-slate-900 tracking-tight text-xl leading-tight">Bravo</h1>
            <span className="text-indigo-600 block text-[10px] tracking-[0.25em] font-black uppercase mt-0.5">Customs AI</span>
          </motion.div>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-hidden">
        <div className={cn(
          "px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 transition-opacity",
          isCollapsed ? "opacity-0 invisible h-0" : "opacity-100"
        )}>
          Menú Principal
        </div>
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) => cn(
              "flex items-center gap-3.5 rounded-2xl transition-all duration-300 group text-sm font-semibold",
              isCollapsed ? "p-4 justify-center" : "px-4 py-3.5",
              isActive 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform duration-300 shrink-0",
              "group-hover:scale-110"
            )} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      
      <div className={cn(
        "border-t border-slate-100 mt-auto transition-all duration-300",
        isCollapsed ? "p-4" : "p-6"
      )}>
        {!isCollapsed && user && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-4 mb-4 border border-white/10 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-20 transition-opacity group-hover:opacity-40">
              {user.role === 'JEFE' ? <Crown size={32} className="text-indigo-400" /> : <UserIcon size={32} className="text-slate-400" />}
            </div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 relative z-10">SESIÓN ACTIVA</p>
            <div className="text-xs font-bold text-white relative z-10 truncate">{user.name}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 relative z-10">{user.position}</div>
          </motion.div>
        )}
        
        <div className="space-y-1">
          <button className={cn(
            "flex items-center gap-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 text-sm font-semibold w-full text-left",
            isCollapsed ? "p-4 justify-center" : "px-4 py-3"
          )}>
            <Settings size={18} className="shrink-0" />
            {!isCollapsed && <span>Configuración</span>}
          </button>
          <button 
            onClick={logout}
            className={cn(
              "flex items-center gap-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 text-sm font-bold w-full text-left",
              isCollapsed ? "p-4 justify-center" : "px-4 py-3"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="uppercase tracking-widest text-[10px]">Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
