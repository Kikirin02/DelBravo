import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Bell, 
  Zap, 
  X, 
  Send, 
  Clock, 
  ArrowRight,
  User,
  Bot,
  Loader2,
  Calendar,
  CheckCircle2,
  FileText,
  AlertTriangle,
  FileWarning
} from 'lucide-react';
import { cn } from '../lib/utils';
import { askTraffiBot } from '../services/gemini';

type Tab = 'chat' | 'reminders' | 'actions' | 'notifications';

export const FloatingConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Soy GlosaAI. ¿Tienes alguna duda rápida sobre un pedimento o arribo?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([
    { id: 'n1', title: 'Falta documentación Pedimento 260-3501-4409988', client: 'Importadora Alimentos', date: 'Hace 2h', priority: 'high' },
    { id: 'n2', title: 'Seguimiento de COVE pendiente', client: 'Tech Solutions MX', date: 'Hace 5h', priority: 'medium' },
    { id: 'n3', title: 'Carga de CFDI faltante para remesa', client: 'Industrial Automotriz', date: 'Ayer', priority: 'low' }
  ]);
  const [showBadge, setShowBadge] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bravo_reminders');
    if (saved) {
      setReminders(JSON.parse(saved).filter((r: any) => !r.isCompleted).slice(0, 3));
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const response = await askTraffiBot(userMessage);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="collapsed"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-all group relative"
          >
            <ShieldCheck size={28} className="group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary rounded-full border-2 border-white flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} className="text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Concierge Inteligente</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bravo Customs Support</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-50">
              {(['chat', 'notifications', 'reminders', 'actions'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'notifications') setShowBadge(false);
                  }}
                  className={cn(
                    "flex-1 py-4 text-[9px] font-black uppercase tracking-[0.1em] transition-all relative",
                    activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    {tab === 'chat' && <MessageSquare size={12} />}
                    {tab === 'notifications' && <AlertTriangle size={12} />}
                    {tab === 'reminders' && <Bell size={12} />}
                    {tab === 'actions' && <Zap size={12} />}
                    {tab === 'notifications' ? 'Alertas' : tab}
                  </span>
                  {tab === 'notifications' && notifications.length > 0 && showBadge && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeTab === 'notifications' && (
                  <motion.div 
                    key="notifications"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-6 h-full overflow-y-auto space-y-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seguimiento Documental</h4>
                      <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[9px] font-bold">{notifications.length} PENDIENTES</span>
                    </div>
                    {notifications.map((n) => (
                      <div key={n.id} className={cn(
                        "p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer group",
                        n.priority === 'high' ? "bg-red-50/50 border-red-100" : "bg-slate-50 border-slate-100"
                      )}>
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            n.priority === 'high' ? "bg-red-100 text-red-600" : "bg-white text-slate-400 border border-slate-100 shadow-sm"
                          )}>
                            <FileWarning size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{n.title}</p>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{n.client}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{n.date}</span>
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                n.priority === 'high' ? "bg-red-500" : n.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                              )} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10 flex items-start gap-3">
                      <Bot size={16} className="text-brand-primary mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                        <span className="font-bold text-brand-primary block mb-1">BRAVO BOT NOTIFICA:</span>
                        Se han detectado pedimentos sin COVE vinculado o factura digitalizada. Favor de subir documentación para evitar retrasos en cruce.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.map((m, idx) => (
                        <div key={idx} className={cn(
                          "flex gap-3 max-w-[85%]",
                          m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}>
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                            m.role === 'user' ? "bg-slate-900 text-white" : "bg-slate-100 text-brand-primary"
                          )}>
                            {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                          </div>
                          <div className={cn(
                            "p-3 rounded-2xl text-xs leading-relaxed",
                            m.role === 'user' ? "bg-slate-900 text-white rounded-tr-none" : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
                          )}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-slate-100 text-brand-primary rounded-lg flex items-center justify-center">
                            <Bot size={14} />
                          </div>
                          <div className="p-3 bg-slate-50 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                            <Loader2 size={12} className="animate-spin text-brand-primary" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Procesando...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-50 flex gap-2">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregunta a GlosaAI..."
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                      />
                      <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'reminders' && (
                  <motion.div 
                    key="reminders"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-6 space-y-4"
                  >
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Próximos Vencimientos</h4>
                    {reminders.length > 0 ? reminders.map((r: any) => (
                      <div key={r.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group hover:border-brand-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                            <Calendar size={14} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 line-clamp-1">{r.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(r.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-brand-primary transition-colors" />
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <Bell size={32} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-xs text-slate-400 font-medium">No hay recordatorios pendientes</p>
                      </div>
                    )}
                    <button className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 mt-4 hover:text-brand-primary">
                      Ver todos en el panel →
                    </button>
                  </motion.div>
                )}

                {activeTab === 'actions' && (
                  <motion.div 
                    key="actions"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-6 space-y-3"
                  >
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Acciones Rápidas</h4>
                    {[
                      { label: 'Nuevo Pedimento', icon: FileText, color: 'text-blue-600' },
                      { icon: ShieldCheck, label: 'Validar Glosa', color: 'text-brand-primary' },
                      { icon: Clock, label: 'Consultar Arribo', color: 'text-amber-600' },
                      { icon: CheckCircle2, label: 'Estatus SAAI', color: 'text-emerald-600' }
                    ].map((action, i) => (
                      <button key={i} className="w-full flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-brand-primary/10 transition-all group">
                        <div className={cn("p-2 rounded-lg bg-slate-50 group-hover:bg-brand-primary group-hover:text-white transition-all", action.color)}>
                          <action.icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 tracking-tight">{action.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Accessibility */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4">
               <div className="flex items-center gap-1.5 opacity-40 grayscale group hover:grayscale-0 transition-all cursor-help" title="Soporte Técnico">
                  <ShieldCheck size={12} />
                  <span className="text-[9px] font-black uppercase tracking-tight">V2.4 Secure</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
