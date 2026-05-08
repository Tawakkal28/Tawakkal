import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Zap, 
  Droplets, 
  Car,
  Wifi,
  Calendar,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

const loadData = [
  { day: 'Mon', power: 85, water: 64, transport: 45 },
  { day: 'Tue', power: 78, water: 62, transport: 52 },
  { day: 'Wed', power: 92, water: 75, transport: 84 },
  { day: 'Thu', power: 88, water: 68, transport: 72 },
  { day: 'Fri', power: 75, water: 82, transport: 91 },
  { day: 'Sat', power: 64, water: 55, transport: 32 },
  { day: 'Sun', power: 61, water: 50, transport: 28 },
];

const riskDistribution = [
  { name: 'Critical', value: 3, color: '#DC2626' },
  { name: 'High', value: 8, color: '#D97706' },
  { name: 'Medium', value: 24, color: '#3b82f6' },
  { name: 'Low', value: 65, color: '#059669' },
];

export default function Analytics() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl font-bold tracking-tight">Predictive Analytics</h1>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              ML_INSTANCE_77 // STATUS: OPTIMIZING
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export Intelligence Report
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricBox label="Reliability Index" value="94.2" trend="+0.4%" isPositive={true} />
            <MetricBox label="Failure Detection Rate" value="98.1%" trend="+1.2%" isPositive={true} />
            <MetricBox label="Avg Recovery Velocity" value="4h 12m" trend="-15m" isPositive={true} />
            <MetricBox label="Anomaly Propensity" value="1.24" trend="+0.05" isPositive={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Multi-System Load Trend */}
            <div className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold">Intersystem Load Analysis</h2>
                  <p className="text-xs text-slate-500 font-medium">Weekly comparative vertical utilization</p>
                </div>
                <div className="flex gap-4">
                  <LegendItem label="Power" color="bg-blue-500" />
                  <LegendItem label="Water" color="bg-cyan-500" />
                  <LegendItem label="Transport" color="bg-purple-500" />
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={loadData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                    />
                    <Line type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: 'white'}} />
                    <Line type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: 'white'}} />
                    <Line type="monotone" dataKey="transport" stroke="#a855f7" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: 'white'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="glass-card p-6 flex flex-col items-center">
              <h2 className="text-lg font-bold self-start mb-2">Node Risk Distribution</h2>
              <p className="text-xs text-slate-500 font-medium self-start mb-8">Asset health segmentation</p>
              
              <div className="flex-1 w-full relative min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold">100</div>
                  <div className="text-[8px] uppercase font-bold text-slate-400">Total Nodes</div>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mt-4">
                {riskDistribution.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Predictive Failure Map (Mini-version/Heatmap) */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  Cascading Failure Probabilities
                </h2>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next 24 Hours</div>
              </div>
              
              <div className="space-y-4">
                <RiskItem label="Sector A (Central)" probability={12} />
                <RiskItem label="Sector B (Industrial)" probability={64} />
                <RiskItem label="Sector C (Port)" probability={8} />
                <RiskItem label="Sector D (Residential)" probability={32} />
              </div>
            </div>

            {/* Performance Benchmarking */}
            <div className="glass-card p-6 h-full min-h-[300px] flex flex-col">
              <h2 className="text-lg font-bold mb-8">Response Latency Benchmark</h2>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Fire/EMS', cur: 8, target: 6 },
                    { name: 'Electrical', cur: 45, target: 30 },
                    { name: 'Water', cur: 120, target: 90 },
                    { name: 'Telecom', cur: 12, target: 10 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                    />
                    <Tooltip />
                    <Bar dataKey="cur" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricBox({ label, value, trend, isPositive }: { label: string, value: string, trend: string, isPositive: boolean }) {
  return (
    <div className="glass-card p-6 hover:translate-y-[-2px] transition-all">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</div>
      <div className="text-2xl font-mono font-bold tracking-tighter mb-1">{value}</div>
      <div className={cn(
        "text-[10px] font-bold",
        isPositive ? "text-success-green" : "text-critical-red"
      )}>
        {isPositive ? '↑' : '↓'} {trend}
      </div>
    </div>
  );
}

function RiskItem({ label, probability }: { label: string, probability: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-slate-100">{label}</span>
        <span className={cn(
          probability > 50 ? "text-critical-red" : probability > 20 ? "text-warning-amber" : "text-slate-400"
        )}>
          {probability}% Risk
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            probability > 50 ? "bg-critical-red shadow-[0_0_10px_rgba(239,68,68,0.5)]" : probability > 20 ? "bg-warning-amber" : "bg-blue-600"
          )}
          style={{ width: `${probability}%` }}
        ></div>
      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-2 h-2 rounded-full", color)}></div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}
