import React, { useState } from 'react';
import { queryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Download, Sparkles, ShieldCheck, Database, Table, BarChart2, AlertCircle, Clock, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const QueryPlayground = () => {
  const { activeProject } = useAuth();
  const [question, setQuestion] = useState("Eng ko'p sotilgan 5 ta mahsulotni ko'rsat");
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState({
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
    chart: {
      type: "bar",
      labels: ["iPhone 15 Pro Max", "MacBook Pro M3", "Samsung TV", "Ayollar ko'ylagi", "Python AI kitob"],
      datasets: [{ label: "total_sold", data: [11, 5, 4, 3, 2] }]
    },
    execution_time_ms: 12
  });
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'

  const suggestionChips = [
    "🔥 Eng ko'p sotilgan 5 ta mahsulot",
    "📈 Oylik tushum va foyda ko'rsatkichlari",
    "👥 Shaharlar bo'yicha xaridorlar soni",
    "📦 Barcha buyurtmalar va holatlari"
  ];

  const handleRunQuery = async (queryText = question) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError('');

    try {
      const resp = await queryAPI.runQuery(queryText, activeProject?.id || 1);
      setQueryResult(resp.data);
      if (resp.data.status === 'error') {
        setError(resp.data.error || 'SQL ijro etishda xatolik yuz berdi');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Server bilan bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!queryResult || !queryResult.columns || queryResult.columns.length === 0) return;
    try {
      const resp = await queryAPI.exportExcel(
        queryResult.columns,
        queryResult.rows,
        `Analytix_Report_${queryResult.question || 'Export'}`
      );
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Analytix_Report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Excel fayl yuklab olishda xatolik yuz berdi: " + err.message);
    }
  };

  const prepareChartData = () => {
    if (!queryResult || !queryResult.columns || !queryResult.rows) return [];
    return queryResult.rows.map(row => {
      const item = {};
      queryResult.columns.forEach((col, idx) => {
        item[col] = row[idx];
      });
      return item;
    });
  };

  const chartData = prepareChartData();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-navy-700 flex items-center gap-3">
            <span>AI Query Engine</span>
            <span className="text-xs bg-teal/15 text-teal font-mono px-2.5 py-0.5 rounded-full border border-teal/30 font-semibold">
              Vanna AI Core
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tabiiy tilda savol bering, SQL va avtomatik chart/Excel hisobot oling ({activeProject.name})
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-white border border-mist px-3 py-1.5 rounded-xl text-slate-600 shadow-sm flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal" />
            <span>Faqat SELECT (Safe)</span>
          </div>
          <div className="bg-white border border-mist px-3 py-1.5 rounded-xl text-slate-600 shadow-sm flex items-center space-x-2">
            <Zap className="w-4 h-4 text-teal" />
            <span>{queryResult.execution_time_ms || 12}ms</span>
          </div>
        </div>
      </div>

      {/* Input Box & Chips */}
      <div className="bg-white border border-mist rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
              placeholder="Masalan: Eng ko'p sotilgan 5 ta mahsulot va jami tushum..."
              className="w-full bg-paper border border-mist rounded-xl px-4 py-3 text-sm text-navy-700 focus:outline-none focus:border-teal transition-colors pr-10 font-medium"
            />
            <Sparkles className="w-4 h-4 text-teal absolute right-3.5 top-3.5 opacity-60" />
          </div>
          <button
            onClick={() => handleRunQuery()}
            disabled={loading}
            className="bg-teal hover:bg-teal-dark text-navy-900 font-semibold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-teal/20"
          >
            {loading ? (
              <span>O'ylanmoqda...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>So'rov yuborish</span>
              </>
            )}
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                const text = chip.replace(/^[^\s]+\s/, '');
                setQuestion(text);
                handleRunQuery(text);
              }}
              className="bg-slate-100 hover:bg-teal/15 hover:text-navy-700 border border-mist text-slate-600 text-xs px-3 py-1 rounded-full transition-all font-medium"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <div>
            <p className="font-semibold">So'rovda xatolik yuz berdi</p>
            <p className="text-slate-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Result Cards Section */}
      {queryResult && (
        <div className="space-y-6">
          
          {/* Generated SQL Block (Signature Dark Code Box) */}
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4 overflow-hidden shadow-md text-white">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-navy-700 pb-2 mb-3">
              <span className="font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal"></span>
                Avtomatik Yaratilgan SQL (Sanitized)
              </span>
              <span className="text-[10px] text-teal-light bg-teal/10 px-2 py-0.5 rounded font-mono">
                Read-Only Connection
              </span>
            </div>
            <pre className="font-mono text-xs text-teal-light leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {queryResult.generated_sql || "-- SQL mavjud emas"}
            </pre>
          </div>

          {/* Visualization & Data Table Tabs */}
          <div className="bg-white border border-mist rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mist pb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                    viewMode === 'chart'
                      ? 'bg-teal text-navy-900 shadow-md shadow-teal/20'
                      : 'bg-slate-100 text-slate-600 hover:text-navy-700'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Vizual Diagramma</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                    viewMode === 'table'
                      ? 'bg-teal text-navy-900 shadow-md shadow-teal/20'
                      : 'bg-slate-100 text-slate-600 hover:text-navy-700'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Jadval ({queryResult.rows?.length || 0} qator)</span>
                </button>
              </div>

              <button
                onClick={handleExportExcel}
                className="bg-teal/15 border border-teal text-teal hover:bg-teal hover:text-navy-900 font-semibold px-4 py-1.5 rounded-lg text-xs flex items-center space-x-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel (.xlsx) Yuklab Olish</span>
              </button>
            </div>

            {/* View Mode: Chart */}
            {viewMode === 'chart' && (
              <div className="h-72 w-full pt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EC" opacity={0.7} />
                      <XAxis 
                        dataKey={queryResult.columns[0]} 
                        stroke="#5B6478" 
                        fontSize={11} 
                        tickLine={false}
                      />
                      <YAxis stroke="#5B6478" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E6EC', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#00A896', fontWeight: '600' }}
                      />
                      <Bar 
                        dataKey={queryResult.columns[1] || queryResult.columns[0]} 
                        fill="#00A896" 
                        radius={[6, 6, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                    Diagramma yaratish uchun ma'lumot yetarli emas
                  </div>
                )}
              </div>
            )}

            {/* View Mode: Table */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto max-h-80 border border-mist rounded-xl">
                <table className="w-full text-left text-xs font-mono text-slate-700">
                  <thead className="bg-slate-100 text-navy-700 uppercase text-[10px] tracking-wider border-b border-mist sticky top-0 font-bold">
                    <tr>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-3 font-semibold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist">
                    {queryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5">{val !== null ? String(val) : ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
