import React from 'react';
import { MessageSquareCode, FolderKanban, KeyRound, History, CreditCard, Sparkles, Server } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'query', label: 'AI Query Engine', icon: MessageSquareCode, badge: 'Live' },
    { id: 'projects', label: 'Loyihalar & Bazalar', icon: FolderKanban },
    { id: 'tokens', label: 'API Kalitlar', icon: KeyRound },
    { id: 'logs', label: 'So\'rovlar Tarixi', icon: History },
    { id: 'billing', label: 'Tarif & Billing', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white/80 border-r border-mist p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Boshqaruv Paneli
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal/15 text-teal border border-teal/30 font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-navy-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-teal text-white font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Engine Banner */}
        <div className="bg-paper border border-mist rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-navy-700">
            <Sparkles className="w-4 h-4 text-teal" />
            <span className="text-xs font-semibold">Local & Cloud LLM</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Ollama orqali Llama3 local model yoki OpenAI GPT-4 API bilan bog'langan.
          </p>
          <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
            <Server className="w-3 h-3 text-teal" />
            <span>Read-Only Sandbox: ON</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-mist pt-4 px-2 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Analytix AI v1.0 MVP</span>
        <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
      </div>
    </aside>
  );
};
