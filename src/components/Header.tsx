import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Anchor, Pill, X, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/auth';
import { mockPedimentos } from '../pages/Pedimentos';
import { catalog } from '../pages/Catalog';
import { shipments } from '../pages/Tracking';
import { cn } from '../lib/utils';

interface SearchResult {
  id: string | number;
  title: string;
  subtitle: string;
  type: 'pedimento' | 'tracking' | 'catalog';
  link: string;
}

export const Header = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search Pedimentos
    mockPedimentos.forEach(p => {
      if (p.id.toLowerCase().includes(lowerQuery) || p.client.toLowerCase().includes(lowerQuery) || p.rfc.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: p.id,
          title: p.id,
          subtitle: `Pedimento - ${p.client}`,
          type: 'pedimento',
          link: '/pedimentos'
        });
      }
    });

    // Search Tracking
    shipments.forEach(s => {
      if (s.id.toLowerCase().includes(lowerQuery) || s.type.toLowerCase().includes(lowerQuery) || s.origin.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: s.id,
          title: s.id,
          subtitle: `Tracking - ${s.type}`,
          type: 'tracking',
          link: '/tracking'
        });
      }
    });

    // Search Catalog
    catalog.forEach(c => {
      if (c.name.toLowerCase().includes(lowerQuery) || c.code.toLowerCase().includes(lowerQuery) || c.client.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: c.id,
          title: c.name,
          subtitle: `Catálogo - Fracción: ${c.code}`,
          type: 'catalog',
          link: '/catalog'
        });
      }
    });

    setResults(searchResults.slice(0, 8));
    setIsOpen(true);
  }, [query]);

  const handleSelect = (link: string) => {
    navigate(link);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-40 w-full mb-8">
      <div className="flex items-center justify-between">
        <div ref={searchRef} className="relative w-full max-w-2xl">
          <div className="relative group">
            <Search 
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                isOpen ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"
              )} 
              size={18} 
            />
            <input
              type="text"
              placeholder="Búsqueda global (Pedimentos, Guías, Catálogo...)"
              className={cn(
                "w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm font-medium",
                isOpen && "rounded-b-none border-b-transparent ring-2 ring-indigo-500/20 border-indigo-500"
              )}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            )}
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-500 pointer-events-none select-none">
              <span className="text-[12px]">⌘</span>
              <span>K</span>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && query.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 w-full bg-white border border-slate-200 border-t-0 rounded-b-2xl shadow-xl overflow-hidden shadow-indigo-900/10"
              >
                <div className="p-2 border-t border-slate-100">
                  {results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSelect(result.link)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            result.type === 'pedimento' && "bg-blue-50 text-blue-600",
                            result.type === 'tracking' && "bg-orange-50 text-orange-600",
                            result.type === 'catalog' && "bg-indigo-50 text-indigo-600"
                          )}>
                            {result.type === 'pedimento' && <FileText size={20} />}
                            {result.type === 'tracking' && <Anchor size={20} />}
                            {result.type === 'catalog' && <Pill size={20} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{result.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{result.subtitle}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="text-slate-300" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-900">No hay coincidencias</p>
                      <p className="text-xs text-slate-500 mt-1">Prueba con otro término o módulo.</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atajos: Enter para seleccionar</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 uppercase">Bravo AI Search</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{user?.name}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.position}</p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white",
            user?.role === 'JEFE' ? "bg-gradient-to-br from-indigo-600 to-indigo-900 shadow-indigo-200" : "bg-gradient-to-br from-slate-400 to-slate-600 shadow-slate-200"
          )}>
            {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
