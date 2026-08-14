import React, { useState } from 'react';
import { queryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Database, ShieldCheck, Zap, ArrowRight, CheckCircle2, 
  Search, Clock, Lock, BarChart2, Layers, Cpu, Download, Send, Globe, Users, Award 
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth, onGoToDashboard }) => {
  const { user } = useAuth();
  
  // Interactive Sandbox state
  const [question, setQuestion] = useState("Eng ko'p sotilgan 5 ta mahsulotni ko'rsat");
  const [loading, setLoading] = useState(false);
  const [demoResult, setDemoResult] = useState({
    status: "success",
    question: "Eng ko'p sotilgan 5 ta mahsulotni ko'rsat",
    generated_sql: "SELECT p.product_name, SUM(o.quantity) AS total_sold, SUM(o.total_amount) AS total_revenue FROM orders o JOIN products p ON o.product_id = p.product_id GROUP BY p.product_name ORDER BY total_sold DESC LIMIT 5;",
    columns: ["product_name", "total_sold", "total_revenue"],
    rows: [
      ["iPhone 15 Pro Max 256GB", 11, 14300.0],
      ["MacBook Pro M3 16GB", 5, 9250.0],
      ["Samsung Ultra HD TV 55", 4, 3000.0],
      ["Ayollar bahoriy ko'ylagi", 3, 255.0],
      ["Python va AI qo'llanmasi", 2, 50.0]
    ],
    execution_time_ms: 12
  });

  const handleRunQuery = async (queryText = question) => {
    if (!queryText.trim()) return;
    setLoading(true);

    try {
      const resp = await queryAPI.runQuery(queryText, 1);
      setDemoResult(resp.data);
    } catch (e) {
      console.log("Query demo fallback");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!demoResult || !demoResult.columns || demoResult.columns.length === 0) return;
    try {
      const resp = await queryAPI.exportExcel(
        demoResult.columns,
        demoResult.rows,
        `Analytix_Report_${demoResult.question || 'Export'}`
      );
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Analytix_Report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Excel yuklab olish xatosi: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-navy-700 font-sans selection:bg-teal selection:text-white">
      
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-40 bg-white/86 backdrop-blur-md border-b border-mist px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <a href="#" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="Analytix AI" 
              className="h-10 w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-105" 
            />
            <span className="font-display font-semibold text-xl text-navy-700">
              Analytix<span className="text-teal font-bold text-xs align-super ml-1">AI</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-600">
            <a href="#imkoniyatlar" className="hover:text-navy-700 transition-colors">Imkoniyatlar</a>
            <a href="#qanday-ishlaydi" className="hover:text-navy-700 transition-colors">Qanday ishlaydi</a>
            <a href="#narxlar" className="hover:text-navy-700 transition-colors">Narxlar</a>
            <a href="#boglanish" className="hover:text-navy-700 transition-colors">Bog'lanish</a>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <button
                onClick={onGoToDashboard}
                className="bg-teal hover:bg-teal-dark text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-teal/20 transition-all"
              >
                <span>Dashboard ga O'tish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth(false)}
                  className="px-4 py-2 text-xs font-semibold text-navy-700 border border-mist hover:border-navy-700 rounded-xl transition-all"
                >
                  Kirish
                </button>
                <button
                  onClick={() => onOpenAuth(true)}
                  className="bg-teal hover:bg-teal-dark text-navy-900 font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-teal/20 transition-all"
                >
                  <span>Boshlash</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden bg-radial-hero">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-teal bg-teal/10 border border-teal/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-teal" />
              <span>Har qanday baza uchun AI-tahlil</span>
            </div>

            <h1 className="font-display font-semibold text-3xl sm:text-5xl text-navy-700 leading-tight">
              Ma'lumotlaringizga so'rov bering, javobni <em className="italic text-teal not-italic">soniyada</em> oling.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Analytix AI kompaniyangizning bazasiga ulanadi, savolingizni SQL'ga aylantiradi va natijani jadval, chart yoki Excel ko'rinishida qaytaradi — kod yozmasdan.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onOpenAuth(true)}
                className="bg-teal hover:bg-teal-dark text-navy-900 font-semibold px-6 py-3.5 rounded-xl text-xs flex items-center space-x-2 shadow-xl shadow-teal/25 transition-all"
              >
                <span>Demo so'rash</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#qanday-ishlaydi"
                className="bg-white hover:border-navy-700 border border-mist text-navy-700 font-semibold px-6 py-3.5 rounded-xl text-xs transition-all shadow-sm"
              >
                Qanday ishlashini ko'rish
              </a>
            </div>

            <div className="pt-4 text-xs font-mono text-slate-500 space-x-3">
              <span className="text-navy-700 font-semibold">PostgreSQL</span> · 
              <span className="text-navy-700 font-semibold ml-2">MySQL</span> · 
              <span className="text-navy-700 font-semibold ml-2">Local LLM (Ollama)</span> · 
              <span className="text-teal font-semibold ml-2">Bulutli AI</span>
            </div>
          </div>

          {/* Hero Right: Signature Dark Query Card */}
          <div className="lg:col-span-6">
            <div className="bg-navy-900 border border-navy-600 rounded-3xl p-6 shadow-2xl space-y-4 relative text-white">
              
              <div className="flex items-center justify-between border-b border-navy-600/80 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-navy-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-navy-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-navy-600"></div>
                  <span className="font-mono text-xs text-slate-400 ml-2">analytix — jonli AI query playground</span>
                </div>
                <span className="text-[10px] bg-teal/20 text-teal-light font-mono px-2 py-0.5 rounded">
                  Read-Only Sandbox
                </span>
              </div>

              {/* Input bar */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
                  className="flex-1 bg-navy-800 border border-navy-600 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal transition-colors"
                />
                <button
                  onClick={() => handleRunQuery()}
                  disabled={loading}
                  className="bg-teal text-navy-900 font-semibold px-4 py-2.5 rounded-xl text-xs hover:bg-teal-light transition-all flex items-center space-x-1.5"
                >
                  {loading ? <span>...</span> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Eng ko'p sotilgan 5 ta mahsulotni ko'rsat",
                  "Oylik tushum va foyda ko'rsatkichlari",
                  "Shaharlar bo'yicha xaridorlar soni"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuestion(chip);
                      handleRunQuery(chip);
                    }}
                    className="text-[11px] bg-navy-800 hover:bg-teal/20 border border-navy-600 text-slate-300 hover:text-white px-2.5 py-1 rounded-full transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Generated SQL */}
              <div className="bg-navy-800/80 border border-navy-600 rounded-xl p-3">
                <p className="text-[10px] font-mono text-slate-400 mb-1">SQL Guard Sanitized Query:</p>
                <code className="font-mono text-[11px] text-teal-light break-all leading-relaxed">
                  {demoResult.generated_sql}
                </code>
              </div>

              {/* Table Result */}
              {demoResult.rows && demoResult.rows.length > 0 && (
                <div className="overflow-x-auto max-h-44 border border-navy-600 rounded-xl">
                  <table className="w-full text-left text-[11px] font-mono text-slate-300">
                    <thead className="bg-navy-800 text-white uppercase text-[9px] border-b border-navy-600 sticky top-0">
                      <tr>
                        {demoResult.columns.map((c, i) => (
                          <th key={i} className="px-3 py-2">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-600/50">
                      {demoResult.rows.slice(0, 5).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-navy-800/60">
                          {row.map((val, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer row */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  onClick={handleExportExcel}
                  className="bg-teal/15 border border-teal text-teal-light hover:bg-teal hover:text-navy-900 px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center space-x-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel (.xlsx) Yuklab Olish</span>
                </button>
                <span className="font-mono text-[11px] text-teal-light">
                  ⚡ {demoResult.execution_time_ms || 12}ms ichida javob
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==================== PROBLEM SECTION ==================== */}
      <section className="py-20 px-6 bg-white border-t border-mist" id="muammo">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-semibold uppercase text-teal tracking-wider">Muammo</span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-navy-700">Ma'lumot ko'p, lekin javob yo'q</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="pt-5 border-t-2 border-mist space-y-3">
              <Search className="w-6 h-6 text-teal" />
              <h3 className="font-semibold text-base text-navy-700">Analitik yetishmaydi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Malakali analitikni yollash yoki ushlab turish har bir kompaniya uchun ham oson emas.
              </p>
            </div>

            <div className="pt-5 border-t-2 border-mist space-y-3">
              <Clock className="w-6 h-6 text-teal" />
              <h3 className="font-semibold text-base text-navy-700">Hisobot kunlab kutiladi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oddiy savolga javob olish uchun IT yoki BI bo'limi navbatida kunlab turasiz.
              </p>
            </div>

            <div className="pt-5 border-t-2 border-mist space-y-3">
              <Lock className="w-6 h-6 text-teal" />
              <h3 className="font-semibold text-base text-navy-700">Korporativ vositalar qimmat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To'liq funksional BI platformalar yiliga yuz minglab dollar turadi — faqat yirik kompaniyalar uchun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SOLUTION SECTION ==================== */}
      <section className="py-20 px-6 bg-paper border-t border-mist" id="imkoniyatlar">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-semibold uppercase text-teal tracking-wider">Imkoniyatlar</span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-navy-700">Analytix AI — Yechim</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-mist p-8 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center text-teal-light">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-navy-700">Xavfsiz Baza Ulanishi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PostgreSQL, MySQL va boshqalar — bir necha daqiqada, faqat o'qish huquqi (Read-only) va AES-256 shifrlangan holda.
              </p>
            </div>

            <div className="bg-white border border-mist p-8 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center text-teal-light">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-navy-700">Oddiy tilda so'rang</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SQL, jadval va chartlarni bir zumda oling — dasturlash yoki SQL bilish shart emas.
              </p>
            </div>

            <div className="bg-white border border-mist p-8 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center text-teal-light">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-navy-700">Bulutli yoki Local AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maxfiy ma'lumot uchun Ollama orqali local modelni tanlang — hech narsa tashqariga chiqmaydi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 px-6 bg-white border-t border-mist" id="qanday-ishlaydi">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-semibold uppercase text-teal tracking-wider">Jarayon</span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-navy-700">To'rt qadamda ulanishdan natijagacha</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Ulash", desc: "Bazangizni xavfsiz, faqat o'qish huquqi bilan ulang." },
              { num: "2", title: "Model tanlash", desc: "Bulutli API yoki local LLM — sizga qulay bo'lganini tanlang." },
              { num: "3", title: "So'rash", desc: "O'z tilingizda, oddiy jumla bilan savol yozing." },
              { num: "4", title: "Natija olish", desc: "Jadval, chart yoki Excel — kerakli ko'rinishda darhol oling." }
            ].map((step, idx) => (
              <div key={idx} className="bg-paper border border-mist p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-navy-700 text-white font-display font-semibold flex items-center justify-center text-sm">
                  {step.num}
                </div>
                <h3 className="font-semibold text-sm text-navy-700">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STAT BAND ==================== */}
      <section className="py-20 px-6 bg-navy-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-light">Bozor</span>
          <div className="font-display font-semibold text-3xl sm:text-6xl flex items-center justify-center gap-4">
            <span>$50.4B</span>
            <span className="text-teal-light">→</span>
            <span>$95.8B</span>
          </div>
          <p className="text-sm text-slate-300 font-medium">Global BI va analitika bozori hajmi, 2026–2033</p>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed pt-2">
            Yirik bulutli kompaniyalar asosiy AI dashboardlarni bepul qo'shmoqda — bu qiymatni maxsus va ishonchli tahlil yechimlariga siljitmoqda. Universitetlar, mintaqaviy KOB va maxfiylikka sezgir sohalar bu bo'shliqda qolmoqda.
          </p>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <section className="py-20 px-6 bg-white border-t border-mist" id="narxlar">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-semibold uppercase text-teal tracking-wider">Narxlar</span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-navy-700">O'sishingizga mos tarif</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Bepul", price: "$0", q: "Oyiga 50 so'rov", p: "1 loyiha", feat: false },
              { name: "Starter", price: "$49", q: "Oyiga 1,000 so'rov", p: "3 loyiha", feat: false },
              { name: "Business", price: "$199", q: "Cheksiz loyihalar", p: "Local LLM imkoniyati", feat: true },
              { name: "Enterprise", price: "Custom", q: "On-premise deploy", p: "Maxsus SLA", feat: false }
            ].map((tier, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all ${
                  tier.feat 
                    ? 'bg-navy-900 text-white shadow-2xl relative scale-105 border-2 border-teal' 
                    : 'bg-white border border-mist text-navy-700 shadow-sm'
                }`}
              >
                {tier.feat && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal text-navy-900 font-bold text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full">
                    Tavsiya etiladi
                  </span>
                )}
                <div className="space-y-3">
                  <h3 className={`font-semibold text-base ${tier.feat ? 'text-white' : 'text-navy-700'}`}>{tier.name}</h3>
                  <div className={`font-display font-bold text-3xl ${tier.feat ? 'text-white' : 'text-navy-700'}`}>
                    {tier.price}<span className="text-xs font-sans text-slate-400 font-normal">/oy</span>
                  </div>
                  <ul className="space-y-2 text-xs pt-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className={`w-4 h-4 ${tier.feat ? 'text-teal-light' : 'text-teal'}`} />
                      <span className={tier.feat ? 'text-slate-200' : 'text-slate-600'}>{tier.q}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className={`w-4 h-4 ${tier.feat ? 'text-teal-light' : 'text-teal'}`} />
                      <span className={tier.feat ? 'text-slate-200' : 'text-slate-600'}>{tier.p}</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onOpenAuth(true)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    tier.feat 
                      ? 'bg-teal text-navy-900 hover:bg-teal-light shadow-lg shadow-teal/20' 
                      : 'bg-white border border-mist text-navy-700 hover:border-navy-700'
                  }`}
                >
                  Boshlash
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-10 px-6 bg-white border-t border-mist">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Analytix AI" className="h-8 w-auto object-contain rounded-md" />
            <span className="font-display font-semibold text-base text-navy-700">Analytix AI</span>
          </div>
          <p className="text-xs text-slate-500">© 2026 Analytix AI Multi-Tenant SaaS Platform</p>
        </div>
      </footer>

    </div>
  );
};
