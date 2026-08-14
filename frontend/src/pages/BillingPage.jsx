import React from 'react';
import { CreditCard, Check, Sparkles, Zap } from 'lucide-react';

export const BillingPage = () => {
  const plans = [
    { name: "Free", price: "$0", desc: "Sinov va kichik loyihalar uchun", queries: "50 so'rov/oy", featured: false },
    { name: "Starter", price: "$49", desc: "O'sib borayotgan startaplar uchun", queries: "1,000 so'rov/oy", featured: false },
    { name: "Business", price: "$199", desc: "Kompaniyalar va Local LLM uchun", queries: "Cheksiz so'rovlar", featured: true },
    { name: "Enterprise", price: "Custom", desc: "On-premise deploy va maxsus SLA", queries: "Custom limit", featured: false },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-semibold text-2xl text-white">Tariflar & Obuna</h1>
        <p className="text-xs text-slate-400 mt-1">
          Kompaniyangiz ehtiyojiga mos obuna tarifini tanlang
        </p>
      </div>

      {/* Current Usage Box */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-700 border border-teal/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] bg-teal/20 text-teal-light font-mono px-2.5 py-1 rounded-full border border-teal/40">
              Joriy Tarif: Free Plan
            </span>
            <h2 className="font-display font-semibold text-xl text-white mt-2">
              Oyiga 50 ta Bepul So'rov Tizimi
            </h2>
          </div>
          <button className="bg-teal hover:bg-teal-light text-navy-900 font-semibold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-teal/20 transition-all">
            Tarifni Yangilash (Upgrade)
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Sarflangan So'rovlar: 18 / 50</span>
            <span className="text-teal-light font-bold">36% ISHLATILDI</span>
          </div>
          <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden p-0.5 border border-navy-600">
            <div className="h-full bg-gradient-to-r from-teal to-teal-light rounded-full w-[36%]"></div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p, idx) => (
          <div 
            key={idx}
            className={`rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-200 ${
              p.featured 
                ? 'bg-gradient-to-b from-navy-700 to-navy-800 border-2 border-teal shadow-2xl relative scale-105' 
                : 'bg-navy-800/80 border border-navy-600 hover:border-slate-500'
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal text-navy-900 font-bold text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md">
                Tavsiya etiladi
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
              </div>

              <div className="font-display font-bold text-3xl text-white">
                {p.price}<span className="text-xs font-sans text-slate-400 font-normal">/oy</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-teal" />
                  <span>{p.queries}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-teal" />
                  <span>PostgreSQL & MySQL ulanish</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-teal" />
                  <span>1-Click Excel export</span>
                </li>
                {p.featured && (
                  <li className="flex items-center space-x-2 text-teal-light font-semibold">
                    <Sparkles className="w-4 h-4 text-teal" />
                    <span>Local LLM (Ollama) imkoniyati</span>
                  </li>
                )}
              </ul>
            </div>

            <button 
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                p.featured 
                  ? 'bg-teal text-navy-900 hover:bg-teal-light shadow-lg shadow-teal/20' 
                  : 'bg-navy-700 text-white hover:bg-navy-600'
              }`}
            >
              {p.featured ? 'Business ga O\'tish' : 'Tanlash'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
