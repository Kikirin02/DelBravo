import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ArrowUpRight, 
  AlertCircle,
  Clock,
  CheckCircle2,
  FileCheck,
  Ship,
  Truck,
  X,
  Plus,
  Info,
  Zap,
  Bot,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth';
import { askTraffiBot } from '../services/gemini';

const RFC_REGEX = /^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{3}$/;
const PEDIMENTO_REGEX = /^\d{3}-\d{4}-\d{7}$/;
const NICO_REGEX = /^\d{10}$/;

interface FormErrors {
  id?: string;
  client?: string;
  rfc?: string;
  value?: string;
  items?: string;
  nico?: string;
}

interface ValidationRecord {
  date: string;
  status: 'success' | 'error';
  message: string;
}

type ValidationHistoryMap = Record<string, ValidationRecord[]>;

const INITIAL_HISTORY: ValidationHistoryMap = {
  '260-3501-4409988': [
    { date: '18 Abr 2026 10:45', status: 'error', message: 'Error 102: RFC del importador no se encuentra en el Padrón.' },
    { date: '18 Abr 2026 09:12', status: 'error', message: 'Error 305: Fracción arancelaria requiere permiso de Secretaría de Economía.' }
  ],
  '260-3501-4001236': [
    { date: '18 Abr 2026 08:30', status: 'success', message: 'Validación SAAI exitosa. Pendiente de firma electrónica.' }
  ]
};

export const mockPedimentos = [
  {
    id: '260-3501-4001234',
    patent: '3501',
    aduana: '400 (Laredo)',
    rfc: 'EXP230501ABC',
    client: 'Industrial Automotriz S.A.',
    type: 'IM (Importación)',
    regimen: 'A1',
    status: 'Validado',
    date: '18 Abr 2026',
    value: 1254300.50,
    items: 45
  },
  {
    id: '260-3501-4001235',
    patent: '3501',
    aduana: '400 (Laredo)',
    rfc: 'TEXT440812XYZ',
    client: 'Textiles del Norte',
    type: 'EX (Exportación)',
    regimen: 'RT',
    status: 'Pagado',
    date: '17 Abr 2026',
    value: 450200.00,
    items: 12
  },
  {
    id: '260-3501-4409988',
    patent: '3501',
    aduana: '440 (Manzanillo)',
    rfc: 'FOOD991231MNO',
    client: 'Importadora de Alimentos Premium',
    type: 'IM (Importación)',
    regimen: 'A1',
    status: 'Error Validación',
    date: '16 Abr 2026',
    value: 89000.00,
    items: 3
  },
  {
    id: '260-3501-4001236',
    patent: '3501',
    aduana: '400 (Laredo)',
    rfc: 'CHIP770115BCA',
    client: 'Tech Solutions MX',
    type: 'IM (Importación)',
    regimen: 'A1',
    status: 'En Firma',
    date: '15 Abr 2026',
    value: 3200500.25,
    items: 120
  },
  {
    id: '260-3501-4501237',
    patent: '3501',
    aduana: '400 (Laredo)',
    rfc: 'CHEM901120KLA',
    client: 'Químicos Globales',
    type: 'IM (Importación)',
    regimen: 'A1',
    status: 'Validado',
    date: '14 Abr 2026',
    value: 670400.00,
    items: 8
  },
  {
    id: '260-3501-4001238',
    patent: '3501',
    aduana: '240 (Nuevo Laredo)',
    rfc: 'AUTO771022HJP',
    client: 'Partes de Occidente',
    type: 'IM (Importación)',
    regimen: 'A1',
    status: 'Pagado',
    date: '13 Abr 2026',
    value: 156000.75,
    items: 15
  },
  {
    id: '260-3101-4001239',
    patent: '3101',
    aduana: '400 (Laredo)',
    rfc: 'AGRO881201TRG',
    client: 'Agropecuaria del Bajío',
    type: 'EX (Exportación)',
    regimen: 'A1',
    status: 'Validado',
    date: '12 Abr 2026',
    value: 890450.00,
    items: 22
  },
  {
    id: '260-3501-4001240',
    patent: '3501',
    aduana: '160 (Aeropuerto MX)',
    rfc: 'LOGI660514MED',
    client: 'Logística Médica S.A.',
    type: 'IM (Importación)',
    regimen: 'A1',
    status: 'Error Validación',
    date: '11 Abr 2026',
    value: 234100.00,
    items: 5
  },
  {
    id: '260-3501-4001241',
    patent: '3514',
    aduana: '400 (Laredo)',
    rfc: 'CONV550101XYZ',
    client: 'Manufacturas del Sur',
    type: 'IM (Importación)',
    regimen: 'A1',
    status: 'En Firma',
    date: '10 Abr 2026',
    value: 1200000.00,
    items: 60
  },
  {
    id: '260-3501-4001242',
    patent: '3501',
    aduana: '440 (Manzanillo)',
    rfc: 'PAPE440312JKL',
    client: 'Papelera Nacional',
    type: 'EX (Exportación)',
    regimen: 'A1',
    status: 'Validado',
    date: '09 Abr 2026',
    value: 345000.00,
    items: 10
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Validado': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Pagado': 'bg-blue-50 text-blue-700 border-blue-100',
    'Error Validación': 'bg-red-50 text-red-700 border-red-100',
    'En Firma': 'bg-amber-50 text-amber-700 border-amber-100'
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      styles[status] || "bg-gray-50 text-gray-600 border-gray-100"
    )}>
      {status}
    </span>
  );
};

export default function Pedimentos() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    patent: '3501',
    aduana: '400',
    rfc: '',
    client: '',
    type: 'IM',
    regimen: 'A1',
    value: '',
    items: '',
    description: '',
    nico: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [validationHistory, setValidationHistory] = useState<ValidationHistoryMap>(() => {
    const saved = localStorage.getItem('bravo_validation_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  // Persist history
  useEffect(() => {
    localStorage.setItem('bravo_validation_history', JSON.stringify(validationHistory));
  }, [validationHistory]);

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};
    
    if (formData.id && !PEDIMENTO_REGEX.test(formData.id)) {
      newErrors.id = 'Formato inválido (XXX-XXXX-XXXXXXX)';
    }
    
    if (formData.rfc && !RFC_REGEX.test(formData.rfc.toUpperCase())) {
      newErrors.rfc = 'RFC con formato inválido';
    }

    if (formData.client && formData.client.length < 3) {
      newErrors.client = 'Nombre demasiado corto';
    }

    if (formData.value && (isNaN(Number(formData.value)) || Number(formData.value) <= 0)) {
      newErrors.value = 'Debe ser un valor numérico positivo';
    }

    if (formData.items && (isNaN(Number(formData.items)) || Number(formData.items) <= 0)) {
      newErrors.items = 'Debe ser un número entero positivo';
    }

    if (formData.nico && !NICO_REGEX.test(formData.nico.replace(/[\s.]/g, ''))) {
      newErrors.nico = 'Formato inválido (8 dígitos + 2 NICO)';
    }

    setErrors(newErrors);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHistoryRecord = (pedimentoId: string, status: 'success' | 'error', message: string) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })} ${now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    
    setValidationHistory(prev => ({
      ...prev,
      [pedimentoId]: [
        { date: formattedDate, status, message },
        ...(prev[pedimentoId] || [])
      ].slice(0, 10) // Keep last 10 records per pedimento
    }));
  };

  const handleAiSuggest = async () => {
    if (!formData.description.trim()) return;
    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
      const prompt = `Sugiere la fracción arancelaria (8 dígitos) y el NICO (2 dígitos) para la siguiente mercancía en el contexto de la TIGIE mexicana: "${formData.description}". Responde solo con el código de 10 dígitos y una breve descripción justificando la partida.`;
      const result = await askTraffiBot(prompt);
      setAiSuggestion(result);
      
      if (formData.id) {
        addHistoryRecord(formData.id, 'success', `Sugerencia IA obtenida: ${result}`);
      }
    } catch (error) {
      console.error(error);
      setAiSuggestion("Error al obtener sugerencia.");
      if (formData.id) {
        addHistoryRecord(formData.id, 'error', `Fallo en sugerencia IA: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFinalValidation = () => {
    if (Object.keys(errors).length > 0) {
      addHistoryRecord(formData.id, 'error', `Error de Captura: ${Object.values(errors).join(', ')}`);
      return;
    }

    // Simulate SAAI response
    const isSuccess = Math.random() > 0.3;
    if (isSuccess) {
      addHistoryRecord(formData.id, 'success', 'Validación SAAI exitosa. Firma electrónica generada correctamente.');
    } else {
      addHistoryRecord(formData.id, 'error', 'Error 501: Discrepancia en valor aduana detectada por algoritmo de riesgo.');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Pedimentos</h2>
          <p className="text-slate-500 mt-1">Monitoreo en tiempo real de declaraciones aduanales y validaciones SAAI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Exportar reporte
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
          >
            <FileText size={18} />
            Nuevo Pedimento
          </button>
        </div>
      </header>

      {/* Nuevo Pedimento Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl z-[51] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Nueva Declaración Aduanal</h3>
                    <p className="text-sm text-slate-500">Completa los campos para validación previa.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Numero de Pedimento */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Número de Pedimento</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="260-3501-1234567"
                        className={cn(
                          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all",
                          errors.id ? "border-red-200 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:ring-2 focus:ring-brand-primary/10"
                        )}
                        value={formData.id}
                        onChange={(e) => handleInputChange('id', e.target.value)}
                      />
                      {errors.id && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.id}</p>}
                    </div>
                  </div>

                  {/* RFC */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">RFC Cliente</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="ABCD880101XYZ"
                        className={cn(
                          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all uppercase",
                          errors.rfc ? "border-red-200 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:ring-2 focus:ring-brand-primary/10"
                        )}
                        value={formData.rfc}
                        onChange={(e) => handleInputChange('rfc', e.target.value)}
                      />
                      {errors.rfc && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.rfc}</p>}
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre / Razón Social</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Ej: Inversiones Globales S.A."
                        className={cn(
                          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all",
                          errors.client ? "border-red-200 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:ring-2 focus:ring-brand-primary/10"
                        )}
                        value={formData.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                      />
                      {errors.client && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.client}</p>}
                    </div>
                  </div>

                  {/* Valor Aduana */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Aduana (MXN)</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="0.00"
                        className={cn(
                          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all",
                          errors.value ? "border-red-200 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:ring-2 focus:ring-brand-primary/10"
                        )}
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                      />
                      {errors.value && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.value}</p>}
                    </div>
                  </div>

                  {/* Partidas */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Total de Partidas</label>
                    <div className="relative">
                      <input 
                        type="number"
                        placeholder="1"
                        className={cn(
                          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all",
                          errors.items ? "border-red-200 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:ring-2 focus:ring-brand-primary/10"
                        )}
                        value={formData.items}
                        onChange={(e) => handleInputChange('items', e.target.value)}
                      />
                      {errors.items && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.items}</p>}
                    </div>
                  </div>

                  {/* Tipo / Regimen */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Operación</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-semibold"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      <option value="IM">Importación (IM)</option>
                      <option value="EX">Exportación (EX)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Régimen</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-semibold"
                      value={formData.regimen}
                      onChange={(e) => handleInputChange('regimen', e.target.value)}
                    >
                      <option value="A1">Definitivo (A1)</option>
                      <option value="RT">Retorno de Elaboración (RT)</option>
                      <option value="V1">Transferencias (V1)</option>
                    </select>
                  </div>

                  {/* AI & NICO Section */}
                  <div className="md:col-span-2 pt-4 border-t border-slate-50 space-y-6">
                    {/* AI Classification Assistant - Only for Jefe */}
                    {user?.role === 'JEFE' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Zap size={14} className="text-brand-primary" />
                            Asistente de Clasificación IA
                          </label>
                          <span className="text-[10px] font-black text-brand-primary uppercase bg-brand-primary/5 px-2 py-0.5 rounded-full">GlosaAI Active</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="relative">
                            <textarea 
                              placeholder="Describe la mercancía (ej: Monitores LED de 24 pulgadas con puerto HDMI...)"
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all resize-none"
                              value={formData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                            <button 
                              onClick={handleAiSuggest}
                              type="button"
                              disabled={isAiLoading || !formData.description.trim()}
                              className="absolute bottom-3 right-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                              {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                              Sugerir Clasificación
                            </button>
                          </div>

                          <AnimatePresence>
                            {aiSuggestion && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl"
                              >
                                <div className="flex items-start gap-3">
                                  <Bot size={18} className="text-indigo-600 mt-1 shrink-0" />
                                  <div className="space-y-2 flex-1">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Sugerencia de GlosaAI:</p>
                                    <div className="text-xs text-indigo-900 leading-relaxed font-medium">
                                      {aiSuggestion}
                                    </div>
                                    <div className="flex justify-end pt-2">
                                      <button 
                                        type="button"
                                        onClick={() => handleInputChange('nico', aiSuggestion.split(' ')[0].replace(/[^0-9]/g, '').substring(0, 10))}
                                        className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                                      >
                                        Aplicar Código
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* NICO Field - Visible to All */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Fracción Arancelaria / NICO</label>
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="8528520101"
                          maxLength={13}
                          className={cn(
                            "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all font-mono",
                            errors.nico ? "border-red-200 focus:ring-2 focus:ring-red-100" : "border-slate-100 focus:ring-2 focus:ring-brand-primary/10"
                          )}
                          value={formData.nico}
                          onChange={(e) => handleInputChange('nico', e.target.value)}
                        />
                        {errors.nico && <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {errors.nico}</p>}
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium ml-1">Estructura: 8 dígitos de fracción + 2 dígitos de NICO.</p>
                    </div>
                  </div>
                </div>

                {/* Validation History Section */}
                {formData.id && validationHistory[formData.id] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 px-1">
                      <Clock size={16} className="text-slate-400" />
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historial de Validación</h4>
                    </div>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 bg-slate-50/30">
                      {validationHistory[formData.id].map((attempt, idx) => (
                        <div key={idx} className="p-4 flex gap-4 hover:bg-white/50 transition-colors">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                            attempt.status === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                          )}>
                            {attempt.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-900">{attempt.date}</span>
                              <span className={cn(
                                "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                                attempt.status === 'success' ? "bg-emerald-100/50 text-emerald-700" : "bg-red-100/50 text-red-700"
                              )}>
                                {attempt.status === 'success' ? 'EXITOSA' : 'FALLIDA'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-mono">
                              {attempt.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                   <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                   <div className="text-xs text-amber-800 leading-relaxed font-medium">
                     <p className="font-bold mb-1">Nota de Validación:</p>
                     Los datos ingresados se validarán contra las reglas del Anexo 22. Asegúrate de que el RFC esté activo ante el SAT y que la fracción arancelaria (NICO) sea válida.
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-3 bg-slate-50/20">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleFinalValidation}
                  disabled={Object.keys(errors).length > 0 || !formData.id}
                  className="px-10 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 disabled:grayscale transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Enviar a Validación
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: FileCheck, label: 'Validados Hoy', value: '24', color: 'text-emerald-600' },
          { icon: AlertCircle, label: 'Con Errores', value: '03', color: 'text-red-600' },
          { icon: Clock, label: 'Pendientes Pago', value: '12', color: 'text-amber-600' },
          { icon: FileText, label: 'Total Mensual', value: '842', color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("p-2 rounded-lg bg-slate-50", stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Historial de Pedimentos</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Listado de las últimas 10 operaciones procesadas por la agencia.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filtrar historial..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-11 pr-4 text-xs focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-[0.1em]">Número</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-[0.1em]">Fecha Proceso</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-[0.1em]">Cliente / RFC</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-[0.1em]">Timbres / Aduana</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-[0.1em]">Estado</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-[0.1em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockPedimentos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 tracking-tight">{p.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-600 tracking-tight">{p.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{p.client}</p>
                    <p className="text-[10px] text-slate-400 font-bold font-mono tracking-tight">{p.rfc}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={cn(
                         "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                         p.type.includes('Importación') ? "bg-indigo-50 text-indigo-700" : "bg-orange-50 text-orange-700"
                       )}>
                         {p.type.split(' ')[0]}
                       </span>
                       <span className="text-[10px] font-bold text-slate-500">{p.regimen}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{p.aduana.split(' ')[0]} - {p.items} Partidas</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-2 ml-auto shadow-sm">
                      Detalles
                      <ArrowUpRight size={10} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
