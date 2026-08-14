import React, { useState } from 'react';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Database, Cpu, Plus, CheckCircle2, ShieldCheck, Key, Server, User, Lock } from 'lucide-react';

export const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dbType, setDbType] = useState('sqlite');
  
  // Database Connection Credentials
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState(5432);
  const [dbName, setDbName] = useState('sales_db');
  const [dbUser, setDbUser] = useState('read_only_user');
  const [dbPassword, setDbPassword] = useState('');

  const [llmProvider, setLlmProvider] = useState('ollama');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Loyiha nomini kiritish majburiy');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const resp = await projectsAPI.create({
        company_id: user?.company_id || 1,
        name,
        description,
        db_type: dbType,
        db_host: dbHost,
        db_port: Number(dbPort),
        db_name: dbName,
        db_user: dbUser,
        db_password: dbPassword,
        llm_provider: llmProvider
      });
      onProjectCreated(resp.data);
      onClose();
      setName('');
      setDescription('');
      setDbPassword('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Loyiha yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-mist rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-mist flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-teal" />
            <h3 className="font-display font-semibold text-lg text-navy-700">Yangi Loyiha Yaratish</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-navy-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Loyiha Nomi *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Moliya Analitikasi 2026"
              className="w-full bg-paper border border-mist rounded-xl px-4 py-2.5 text-sm text-navy-700 focus:outline-none focus:border-teal transition-colors font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tavsifi (Ixtiyoriy)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kompaniya sotuvlari va mijozlar bazasi..."
              rows={2}
              className="w-full bg-paper border border-mist rounded-xl px-4 py-2 text-sm text-navy-700 focus:outline-none focus:border-teal transition-colors resize-none font-medium"
            />
          </div>

          {/* Database Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Ma'lumotlar Bazasi Turi
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'sqlite', label: 'SQLite Demo', badge: 'Ichki DB' },
                { id: 'postgresql', label: 'PostgreSQL', badge: 'Tavsiya' },
                { id: 'mysql', label: 'MySQL', badge: 'Tezkor' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setDbType(item.id);
                    if (item.id === 'mysql') setDbPort(3306);
                    if (item.id === 'postgresql') setDbPort(5432);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    dbType === item.id
                      ? 'bg-teal/10 border-teal text-teal font-semibold'
                      : 'bg-paper border-mist text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <p className="text-xs font-semibold text-navy-700">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.badge}</p>
                  {dbType === item.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal absolute top-2.5 right-2.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DB Credentials Input Fields (Show when PostgreSQL or MySQL selected) */}
          {dbType !== 'sqlite' && (
            <div className="bg-slate-50 border border-mist rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-navy-700 border-b border-mist pb-2">
                <Server className="w-4 h-4 text-teal" />
                <span>Baza Ulanish Parametrlari (Host, Login, Parol)</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Host / Server URL *
                  </label>
                  <input
                    type="text"
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                    placeholder="localhost yoki db.company.com"
                    className="w-full bg-white border border-mist rounded-xl px-3 py-2 text-xs text-navy-700 focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Port *
                  </label>
                  <input
                    type="number"
                    value={dbPort}
                    onChange={(e) => setDbPort(e.target.value)}
                    className="w-full bg-white border border-mist rounded-xl px-3 py-2 text-xs text-navy-700 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Baza Nomi (Database Name) *
                </label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="masalan: sales_db"
                  className="w-full bg-white border border-mist rounded-xl px-3 py-2 text-xs text-navy-700 focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Baza Logini (Username) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dbUser}
                      onChange={(e) => setDbUser(e.target.value)}
                      placeholder="read_only_user"
                      className="w-full bg-white border border-mist rounded-xl pl-8 pr-3 py-2 text-xs text-navy-700 focus:outline-none focus:border-teal"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Baza Paroli (Password) *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={dbPassword}
                      onChange={(e) => setDbPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-mist rounded-xl pl-8 pr-3 py-2 text-xs text-navy-700 focus:outline-none focus:border-teal"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-[10px] text-teal font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Xavfsizlik majburiyati: Faqat Read-Only foydalanuvchi ulanishi tavsiya etiladi.</span>
              </div>
            </div>
          )}

          {/* LLM Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              LLM Model Provayderi
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'ollama', label: 'Local Ollama', info: 'Llama3 (Maxfiy)' },
                { id: 'openai', label: 'OpenAI GPT-4', info: 'Cloud API' },
                { id: 'gemini', label: 'Google Gemini', info: 'Cloud API' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setLlmProvider(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    llmProvider === item.id
                      ? 'bg-teal/10 border-teal text-teal font-semibold'
                      : 'bg-paper border-mist text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <p className="text-xs font-semibold text-navy-700">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.info}</p>
                  {llmProvider === item.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal absolute top-2.5 right-2.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-mist">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-teal hover:bg-teal-dark text-navy-900 font-semibold text-xs rounded-xl shadow-lg shadow-teal/20 transition-all flex items-center space-x-2"
            >
              {loading ? (
                <span>Yaratilmoqda...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Loyihani Yaratish</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
