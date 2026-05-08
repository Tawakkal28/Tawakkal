import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  AlertTriangle, 
  Bell, 
  Filter, 
  Search, 
  ChevronRight, 
  Activity, 
  Zap, 
  Droplets,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Alert } from '../types';

const mockAlerts: Alert[] = [
  { id: 'AL-902', title: 'District 4 Surge', description: 'Transformer T-14 recording 115% nominal load. Risk of hardware failure.', severity: 'critical', systemType: 'power', timestamp: '2026-05-08T08:42:00Z', status: 'active' },
  { id: 'AL-905', title: 'Sewer Overpressure', description: 'Main artery interceptor sensor reading high pressure in Lower Central.', severity: 'high', systemType: 'water', timestamp: '2026-05-08T08:31:00Z', status: 'active' },
  { id: 'AL-908', title: 'Service Interruption', description: 'Metro Line Red signal 012 failed to respond to handshake.', severity: 'medium', systemType: 'transport', timestamp: '2026-05-08T08:15:00Z', status: 'acknowledged' },
  { id: 'AL-899', title: 'Redundant Link Down', description: 'Secondary fiber loop 04 in South Sector is unresponsive.', severity: 'low', systemType: 'telecom', timestamp: '2026-05-08T07:55:00Z', status: 'resolved' },
];

export default function AlertCenter() {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display text-lg md:xl font-bold tracking-tight">Alert Center</h1>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-critical-red/10 text-critical-red rounded text-[10px] font-bold uppercase tracking-widest border border-critical-red/20">
              <div className="w-1 h-1 bg-critical-red rounded-full animate-ping"></div>
              Live Monitoring
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setFilter('all')}
                className={cn("px-3 py-1 text-xs font-bold rounded", filter === 'all' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={cn("px-3 py-1 text-xs font-bold rounded", filter === 'active' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter('resolved')}
                className={cn("px-3 py-1 text-xs font-bold rounded", filter === 'resolved' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                Resolved
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Alert List */}
            <div className="lg:col-span-2 space-y-4">
              {mockAlerts.filter(a => filter === 'all' || (filter === 'active' && a.status !== 'resolved') || (filter === 'resolved' && a.status === 'resolved')).map((alert) => (
                <div 
                  key={alert.id}
                  className={cn(
                    "glass-card p-6 border-l-4 transition-all group cursor-pointer hover:shadow-md",
                    alert.severity === 'critical' ? "border-critical-red" : alert.severity === 'high' ? "border-warning-amber" : "border-blue-500",
                    alert.status === 'resolved' && "opacity-60 saturate-50"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        alert.severity === 'critical' ? "bg-critical-red/10 text-critical-red" : "bg-slate-100 text-slate-500"
                      )}>
                        {alert.systemType === 'power' ? <Zap size={16} /> : <Droplets size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{alert.id}</span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">{alert.title}</h3>
                      </div>
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                      alert.status === 'active' ? "bg-critical-red/10 text-critical-red" : alert.status === 'acknowledged' ? "bg-warning-amber/10 text-warning-amber" : "bg-success-green/10 text-success-green"
                    )}>
                      {alert.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex gap-4">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <CheckCircle2 size={12} /> Acknowledge
                      </button>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <ShieldAlert size={12} /> Escalate
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                      See Nodes <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-6">Severity Overview</h2>
                <div className="space-y-4">
                  <SeverityBar label="Critical" count={2} color="bg-critical-red" total={mockAlerts.length} />
                  <SeverityBar label="High" count={1} color="bg-warning-amber" total={mockAlerts.length} />
                  <SeverityBar label="Medium" count={1} color="bg-blue-500" total={mockAlerts.length} />
                  <SeverityBar label="Low" count={0} color="bg-slate-300" total={mockAlerts.length} />
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500 font-medium">MTTR (Mean Time to Response)</span>
                    <span className="font-bold">12.4m</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Resolution Efficiency</span>
                    <span className="font-bold text-success-green">98.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Bell size={100} />
                </div>
                <h3 className="font-bold mb-3 flex items-center gap-2 relative z-10">
                  <Activity size={18} className="text-blue-400" />
                  Alert Automation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 relative z-10">
                  Smart filter is active. 14 benign noise alerts were auto-suppressed in the last 24 hours to prevent fatigue.
                </p>
                <button className="w-full py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors relative z-10">
                  Manage Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SeverityBar({ label, count, color, total }: { label: string, count: number, color: string, total: number }) {
  const percent = (count / total) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-900">{count}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
