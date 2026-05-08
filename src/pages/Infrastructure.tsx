import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  Zap, 
  Droplets, 
  Wifi, 
  Car, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { InfrastructureNode, InfrastructureType, StatusLevel } from '../types';

const mockNodes: InfrastructureNode[] = [
  { id: 'PWR-001', name: 'West Sector Substation', type: 'power', status: 'operational', healthScore: 94, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T08:00:00Z', riskProbability: 0.05 },
  { id: 'WTR-442', name: 'North Basin Pump', type: 'water', status: 'degraded', healthScore: 68, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T08:30:00Z', riskProbability: 0.22 },
  { id: 'TEL-012', name: '5G Core Node 7', type: 'telecom', status: 'operational', healthScore: 99, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T08:45:00Z', riskProbability: 0.01 },
  { id: 'TRN-881', name: 'Metro Line Red - Seg 4', type: 'transport', status: 'critical', healthScore: 24, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T08:50:00Z', riskProbability: 0.92 },
  { id: 'PWR-002', name: 'East Sector Station', type: 'power', status: 'operational', healthScore: 88, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T07:45:00Z', riskProbability: 0.08 },
  { id: 'WTR-443', name: 'River Treatment Plant', type: 'water', status: 'operational', healthScore: 91, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T08:15:00Z', riskProbability: 0.12 },
  { id: 'TEL-015', name: 'Fiber Hub Alpha', type: 'telecom', status: 'degraded', healthScore: 72, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T08:20:00Z', riskProbability: 0.35 },
  { id: 'TRN-882', name: 'Downtown Hub Terminal', type: 'transport', status: 'operational', healthScore: 96, location: { lat: 0, lng: 0 }, dependencies: [], lastChecked: '2026-05-08T08:55:00Z', riskProbability: 0.04 },
];

export default function Infrastructure() {
  const [filter, setFilter] = useState<InfrastructureType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredNodes = mockNodes.filter(node => 
    (filter === 'all' || node.type === filter) &&
    (node.name.toLowerCase().includes(search.toLowerCase()) || node.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl font-bold tracking-tight">Infrastructure Monitoring</h1>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tabular-nums">
              {mockNodes.length} Nodes Registered
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
              <ShieldAlert size={16} /> Deploy Team
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Node ID, Name, or Location..." 
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'power', 'water', 'transport', 'telecom', 'emergency'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border",
                    filter === type 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Monitoring Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Serial/ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Component Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Health_S</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Check</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNodes.map((node) => (
                  <tr key={node.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{node.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-slate-900">{node.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Zone_Central_A</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        {getTypeIcon(node.type)}
                        <span className="capitalize">{node.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "font-mono text-sm font-bold",
                          node.healthScore > 80 ? "text-success-green" : node.healthScore > 50 ? "text-warning-amber" : "text-critical-red"
                        )}>
                          {node.healthScore}%
                        </span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", node.healthScore > 80 ? "bg-success-green" : node.healthScore > 50 ? "bg-warning-amber" : "bg-critical-red")}
                            style={{ width: `${node.healthScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={node.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500">{new Date(node.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusLevel }) {
  const styles = {
    operational: "bg-success-green/10 text-success-green border-success-green/20",
    degraded: "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
    critical: "bg-critical-red/10 text-critical-red border-critical-red/20",
    offline: "bg-slate-200 text-slate-500 border-slate-300",
  };

  const icons = {
    operational: <CheckCircle2 size={12} />,
    degraded: <AlertTriangle size={12} />,
    critical: <XCircle size={12} />,
    offline: <Activity size={12} />,
  };

  return (
    <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border inline-flex", styles[status])}>
      {icons[status]}
      {status}
    </div>
  );
}

function getTypeIcon(type: InfrastructureType) {
  switch (type) {
    case 'power': return <Zap size={14} className="text-yellow-500" />;
    case 'water': return <Droplets size={14} className="text-blue-500" />;
    case 'telecom': return <Wifi size={14} className="text-purple-500" />;
    case 'transport': return <Car size={14} className="text-slate-600" />;
    case 'emergency': return <ShieldAlert size={14} className="text-red-500" />;
  }
}
