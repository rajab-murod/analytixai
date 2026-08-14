import React from 'react';
import { History, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const LogsPage = () => {
  const logs = [
    {
      id: 101,
      question: "Eng ko'p sotilgan 5 ta mahsulotni ko'rsat",
      status: "success",
      sql: "SELECT p.product_name, SUM(o.quantity) AS total_sold FROM orders o JOIN products p...",
      tokens: 18,
      time_ms: 12,
      date: "2026-08-14 18:05"
    },
    {
      id: 102,
      question: "Oylik tushum va foyda ko'rsatkichlari",
      status: "success",
      sql: "SELECT year, month, total_revenue, profit_margin FROM monthly_revenue...",
      tokens: 14,
      time_ms: 8,
      date: "2026-08-14 17:50"
    },
    {
      id: 103,
      question: "DELETE FROM products WHERE id=1",
      status: "blocked",
      sql: "Xavfsizlik qoidasi: DELETE operatsiyasi bloklandi (SQL Guard)",
      tokens: 6,
      time_ms: 2,
      date: "2026-08-14 16:30"
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-semibold text-2xl text-navy-700">Audit Logs & So'rovlar Tarixi</h1>
        <p className="text-xs text-slate-500 mt-1">
          Barcha foydalanuvchilar tomonidan berilgan so'rovlar, generatsiya qilingan SQL va xavfsizlik audit jurnali
        </p>
      </div>

      <div className="bg-white border border-mist rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-700">
            <thead className="bg-slate-100 text-navy-700 uppercase text-[10px] tracking-wider border-b border-mist">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Savol / So'rov</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Vaqt</th>
                <th className="px-4 py-3 font-semibold">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400">#{log.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-sans font-semibold text-navy-700">{log.question}</p>
                    <p className="text-[11px] text-teal truncate max-w-lg mt-0.5">{log.sql}</p>
                  </td>
                  <td className="px-4 py-3">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Muvaffaqiyatli</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Bloklandi</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{log.time_ms}ms</td>
                  <td className="px-4 py-3 text-slate-500">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
