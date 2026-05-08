import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  FileText, 
  Download, 
  Share2, 
  Filter, 
  Search, 
  ChevronRight, 
  Calendar,
  Layers,
  FileSpreadsheet,
  FileJson,
  Printer,
  ShieldCheck,
  Zap,
  Droplets,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

const mockReports = [
  { id: 'REP-771', title: 'District 4 Post-Surge Summary', type: 'impact', author: 'AI Core_V.04', date: '2026-05-08T08:00:00Z', size: '2.4 MB' },
  { id: 'REP-768', title: 'Weekly Infrastructure Health', type: 'health', author: 'Commander V.', date: '2026-05-07T12:00:00Z', size: '15.8 MB' },
  { id: 'REP-765', title: 'Sector B Recovery Sequence', type: 'recovery', author: 'Ops Team Delta', date: '2026-05-06T16:00:00Z', size: '1.2 MB' },
  { id: 'REP-760', title: 'Quarterly Resilience Audit', type: 'audit', author: 'Municipal Board', date: '2026-05-01T09:00:00Z', size: '42.1 MB' },
];

export default function Reports() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl font-bold tracking-tight">Intelligence Reports</h1>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="text-[10px] text-slate-400 font-mono">SECURE_ARCHIVE // 42 INDEXED</div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
              <Plus size={16} /> Generate AI Report
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Quick Templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <TemplateCard title="Incident Impact Analysis" icon={<ShieldCheck className="text-red-500" />} />
              <TemplateCard title="Resource Allocation Audit" icon={<Zap className="text-amber-500" />} />
              <TemplateCard title="Systemic Risk Forecast" icon={<Droplets className="text-blue-500" />} />
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by Report ID, Title, or Author..." 
                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors"><Filter size={18} /></button>
                  <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors"><Printer size={18} /></button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authored By</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <FileText size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 leading-tight">{report.title}</div>
                              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mt-1">{report.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">
                            {report.type}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium text-slate-600">{report.author}</td>
                        <td className="px-8 py-5 text-sm text-slate-400">{new Date(report.date).toLocaleDateString()}</td>
                        <td className="px-8 py-5 text-xs font-mono text-slate-400">{report.size}</td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Download size={16} /></button>
                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Share2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium italic">Showing 4 of 42 high-priority Intelligence Reports.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Previous</button>
                  <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TemplateCard({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 font-medium">Standard TEMPLATE_V.4</p>
    </div>
  );
}
