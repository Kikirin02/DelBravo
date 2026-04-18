import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askTraffiBot } from '../services/gemini';
import { cn } from '../lib/utils';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '¡Bienvenido a GlosaAI! Soy tu asistente experto en comercio exterior y normativa aduanal. Puedo ayudarte a clasificar mercancías, validar pedimentos o interpretar el Anexo 22. ¿En qué puedo apoyarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const botResponse = await askTraffiBot(userMessage);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">GlosaAI Expert</h3>
            <p className="text-xs text-brand-primary font-bold flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></span>
              Especialista en Comercio Exterior
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-xl transition-all">
            <HelpCircle size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
        {messages.map((message, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-5 max-w-[80%]",
              message.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
              message.role === 'user' ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-brand-primary"
            )}>
              {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={cn(
              "p-5 rounded-2xl text-sm leading-relaxed shadow-sm",
              message.role === 'user' 
                ? "bg-slate-900 text-white rounded-tr-none" 
                : "bg-white border border-slate-50 text-slate-800 rounded-tl-none prose prose-slate prose-sm max-w-none"
            )}>
              {message.role === 'bot' ? (
                <div className="markdown-body">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ) : (
                message.text
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-5">
            <div className="w-10 h-10 bg-white border border-slate-100 text-brand-primary rounded-xl flex items-center justify-center shadow-sm">
              <Bot size={20} />
            </div>
            <div className="bg-white border border-slate-50 p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
              <Loader2 className="animate-spin text-brand-primary" size={20} />
              <span className="text-sm text-slate-400 font-medium italic">GlosaAI consultando normativa TIGIE...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-8 bg-white border-t border-slate-50">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Clasifica un producto, pregunta por el Anexo 22 o valida un identificador..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-8 pr-16 text-sm focus:ring-2 focus:ring-brand-primary/10 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            '¿Qué es el identificador MV?', 
            'Clasificación de autopartes', 
            'Requisitos para regímenes A1', 
            'Cambios TIGIE 2024'
          ].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="text-[11px] font-bold text-slate-400 bg-slate-50 hover:bg-brand-primary/5 hover:text-brand-primary border border-slate-100 rounded-xl px-4 py-2 transition-all uppercase tracking-wider"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
