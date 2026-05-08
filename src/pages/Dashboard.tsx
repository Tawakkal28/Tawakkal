import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Sidebar from '../components/layout/Sidebar';
import { 
  Bell, 
  Search, 
  User, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Zap, 
  Droplets, 
  Wifi, 
  Car,
  ShieldCheck,
  Activity,
  ChevronRight,
  RefreshCw,
  ArrowRight,
  Menu
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { InfrastructureNode, Alert, RecoveryOperation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
const SYSTEM_INSTRUCTION = `
You are the UrbanSync AI Core (India Region). Your goal is to analyze urban infrastructure data across Indian metropolitan areas and predict cascading failures.
Be technical, precise, and authoritative. Return insights in a structured format.
`;

const chartData = [
  { name: '00:00', value: 85 },
  { name: '04:00', value: 82 },
  { name: '08:00', value: 92 },
  { name: '12:00', value: 88 },
  { name: '16:00', value: 75 },
  { name: '20:00', value: 81 },
  { name: '23:59', value: 84 },
];

export default function Dashboard() {
  const [nodes, setNodes] = useState<InfrastructureNode[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ops, setOps] = useState<RecoveryOperation[]>([]);
  const [aiInsight, setAiInsight] = useState<{ summary: string; actions: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function registerSW() {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW Registered');
        } catch (err) {
          console.error('SW Registration failing:', err);
        }
      }
    }
    registerSW();

    async function fetchData() {
      try {
        const [nodesRes, alertsRes, opsRes] = await Promise.all([
          fetch('/api/infrastructure'),
          fetch('/api/alerts'),
          fetch('/api/recovery')
        ]);
        
        const currentNodes = await nodesRes.json();
        const currentAlerts = await alertsRes.json();
        
        setNodes(currentNodes);
        setAlerts(currentAlerts);
        setOps(await opsRes.json());
        setLoading(false);

        // Fetch AI insight in background without blocking UI
        fetchAiInsight(currentNodes, currentAlerts);
      } catch (error) {
        console.error("Failed to sync with API Core:", error);
        setLoading(false);
      }
    }

    async function fetchAiInsight(currentNodes: any[], currentAlerts: any[]) {
      try {
        const response = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodes: currentNodes,
            alerts: currentAlerts
          })
        });

        const data = await response.json();
        
        const isQuotaError = response.status === 429 || 
                            data.error?.includes('429') || 
                            data.error?.toLowerCase().includes('quota') || 
                            data.code === 'insufficient_quota';

        // Fallback to Gemini if OpenAI hits quota
        if (!response.ok && isQuotaError) {
          console.warn("OpenAI Quota Exceeded for Insights. Falling back to Gemini...");
          try {
            const prompt = `Analyze: Nodes: ${JSON.stringify(currentNodes)}. Alerts: ${JSON.stringify(currentAlerts)}. Provide a 1-sentence summary and 2 actions as JSON: { "summary": "...", "actions": ["...", "..."] }`;
            
            const result = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json"
              }
            });
            
            setAiInsight(JSON.parse(result.text || "{}"));
            return;
          } catch (geminiError: any) {
            console.error("Gemini Insight Fallback Error:", geminiError);
            throw new Error("AI core unavailable");
          }
        }

        if (!response.ok) throw new Error(data.error || 'AI insight fetch failed');
        setAiInsight(data);
      } catch (aiErr: any) {
        console.error("Frontend AI Error:", aiErr);
        setAiInsight({
          summary: `Intelligence Core Error: ${aiErr.message || 'Connection failed'}.`,
          actions: ["Check API Key", "Retry Sync"]
        });
      }
    }

    /// NDMA Alerts Fetcher
    async function fetchNdmaAlerts() {
      try {
        const res = await fetch('/api/alerts/ndma');
        const data = await res.json();
        // We can append these to the main alerts or show separately
        // For now let's just log them or if we have a separate state
        setNdmaAlerts(data);
      } catch (err) {
        console.error("NDMA Sync Failed:", err);
      }
    }

    fetchData();
    fetchNdmaAlerts();
  }, []);

  const [ndmaAlerts, setNdmaAlerts] = useState<any[]>([]);

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BJKzscUBwTCmbCQ4QeI4kgCxj5ctcAdRPcIAkwqMDOQrmnr1NDfo2CuxB_2PmtlnKr7eK0v8W9kcm2rjNoPElhw'
      });

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
      alert('Subscribed to infrastructure alerts!');
    } catch (err) {
      console.error('Subscription failed:', err);
    }
  };

  const testNotification = () => fetch('/api/notifications/test', { method: 'POST' });

  const overallHealth = nodes.length > 0 
    ? Math.round(nodes.reduce((acc, n) => acc + n.healthScore, 0) / nodes.length)
    : 84;

  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display text-lg md:xl font-bold tracking-tight">Mission Control</h1>
            <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              India Regional Core
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={subscribeToNotifications}
              className="hidden sm:inline-block text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              Enable Alerts
            </button>
            <button 
              onClick={testNotification}
              className="hidden md:inline-block px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-200"
            >
              Test Signal
            </button>
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-32 xl:w-64"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
              <Bell size={20} />
              {activeAlerts > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-critical-red rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-slate-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold group-hover:text-blue-600 transition-colors">Commander V.</div>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 border border-slate-300">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Overall City Health" 
              value={overallHealth.toString()} 
              trend="+2.4%" 
              trendUp={true} 
              icon={<ShieldCheck className="text-blue-500" size={24} />} 
              suffix="/100"
              path="/infrastructure"
            />
            <StatCard 
              label="Active Anomalies" 
              value={activeAlerts.toString()} 
              trend={`+${activeAlerts}`} 
              trendUp={false} 
              icon={<AlertCircle className="text-critical-red" size={24} />} 
              path="/alerts"
            />
            <StatCard 
              label="Recovery Operations" 
              value={ops.length.toString().padStart(2, '0')} 
              trend="On Track" 
              trendUp={true} 
              icon={<RefreshCw className="text-success-green" size={24} />} 
              path="/recovery"
            />
            <StatCard 
              label="Risk Multiplier" 
              value="1.2" 
              trend="-0.1" 
              trendUp={true} 
              icon={<TrendingDown className="text-slate-400" size={24} />} 
              suffix="x"
              path="/simulation"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Status Table */}
            <div className="lg:col-span-2 glass-card p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold">Infrastructure Verticals</h2>
                  <p className="text-sm text-slate-500">Real-time subsystem health metrics</p>
                </div>
                <button 
                  onClick={() => navigate('/infrastructure')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All Systems
                </button>
              </div>
              
              <div className="space-y-4">
                {nodes.length > 0 ? nodes.map(node => (
                  <VerticalRow 
                    key={node.id}
                    icon={node.type === 'power' ? <Zap /> : <Droplets />} 
                    name={node.name} 
                    status={node.status} 
                    health={node.healthScore} 
                    load={node.riskProbability > 0.4 ? 'Critical' : 'Nominal'} 
                    onClick={() => navigate('/infrastructure')}
                  />
                )) : (
                  <div className="py-8 text-center text-slate-400 italic">No node data available</div>
                )}
              </div>
            </div>

            {/* AI Insight Panel */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={120} />
              </div>
              
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Activity size={18} className="text-blue-400" />
                AI Strategy Insight
              </h2>
              <p className="text-slate-400 text-xs mb-6 font-mono">MODEL_GEN_V.4.2</p>
              
              <div className="space-y-6 relative z-10">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm leading-relaxed text-slate-200 italic">
                    {loading ? "Decrypting signals..." : aiInsight?.summary || "No immediate cascading risks detected. System stable."}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Suggested Actions</div>
                  {aiInsight?.actions?.map((action, i) => (
                    <button key={i} className="w-full text-left p-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-bold flex items-center justify-between group/action">
                      <span className="truncate">{action}</span>
                      <ArrowRight size={14} className="shrink-0 group-hover/action:translate-x-1 transition-transform" />
                    </button>
                  )) || (
                    <div className="text-xs text-slate-500 font-medium italic">Monitoring for recommended interventions...</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Load Chart */}
            <div className="glass-card p-6 h-80 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Aggregate System Load</h2>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Load Trend</span>
                </div>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8'}}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alerts Feed */}
            <div className="space-y-6">
              {/* NDMA Integrated Feed */}
              <div className="glass-card p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-orange-500" size={18} />
                    <h2 className="text-sm font-bold uppercase tracking-wider">NDMA National Feed</h2>
                  </div>
                  <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">Verified</span>
                </div>
                <div className="space-y-3">
                  {ndmaAlerts.length > 0 ? ndmaAlerts.map(alert => (
                    <div key={alert.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 group cursor-help">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                          alert.severity === 'orange' ? "bg-orange-500 text-white" : 
                          alert.severity === 'yellow' ? "bg-amber-400 text-white" : "bg-green-500 text-white"
                        )}>
                          {alert.title}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">{alert.region}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{alert.description}</p>
                    </div>
                  )) : (
                    <div className="text-xs text-slate-400 italic">Scanning national disaster signals...</div>
                  )}
                </div>
              </div>

              {/* Critical Alert Feed */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Critical System Feed</h2>
                  <span className="bg-critical-red/10 text-critical-red text-[10px] font-bold px-2 py-0.5 rounded uppercase">Live</span>
                </div>
                
                <div className="space-y-3">
                  {alerts.length > 0 ? alerts.map(alert => (
                    <AlertItem 
                      key={alert.id}
                      severity={alert.severity} 
                      time={`${Math.floor((Date.now() - new Date(alert.timestamp).getTime()) / 60000)}m ago`} 
                      title={alert.title} 
                      location={alert.description.split('.')[0]} 
                      onClick={() => navigate('/alerts')}
                    />
                  )) : (
                    <div className="py-8 text-center text-slate-400 italic">All systems clear</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, trendUp, icon, suffix = "", path }: { label: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode, suffix?: string, path?: string }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => path && navigate(path)}
      className={cn(
        "glass-card p-6 hover:shadow-lg transition-shadow transition-transform hover:-translate-y-1",
        path ? "cursor-pointer" : ""
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          {icon}
        </div>
        <div className={cn(
          "text-xs font-bold px-2 py-1 rounded-full",
          trendUp ? "bg-success-green/10 text-success-green" : "bg-critical-red/10 text-critical-red"
        )}>
          {trend}
        </div>
      </div>
      <div>
        <div className="text-3xl font-display font-bold tracking-tight">
          {value}<span className="text-lg text-slate-400 font-normal">{suffix}</span>
        </div>
        <div className="data-label mt-1">{label}</div>
      </div>
    </div>
  );
}

function VerticalRow({ icon, name, status, health, load, onClick }: { icon: React.ReactNode, name: string, status: string, health: number, load: string, onClick?: () => void }) {
  const statusColors: Record<string, string> = {
    operational: "bg-success-green/10 text-success-green",
    nominal: "bg-success-green/10 text-success-green",
    degraded: "bg-warning-amber/10 text-warning-amber",
    critical: "bg-critical-red/10 text-critical-red",
    offline: "bg-slate-900/10 text-slate-900",
  };
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-6 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100",
        onClick ? "cursor-pointer" : ""
      )}
    >
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{name}</div>
        <div className="flex items-center gap-2">
          <span className={cn("status-pill", statusColors[status] || statusColors.nominal)}>
            {status}
          </span>
          <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Load: {load}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-mono font-bold">{health}%</div>
        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
          <div 
            className={cn(
              "h-full rounded-full",
              health > 80 ? "bg-success-green" : health > 50 ? "bg-warning-amber" : "bg-critical-red"
            )}
            style={{ width: `${health}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ severity, time, title, location, onClick }: { severity: 'low' | 'medium' | 'high' | 'critical', time: string, title: string, location: string, onClick?: () => void }) {
  const sevStyles = {
    critical: "border-critical-red bg-critical-red/5",
    high: "border-warning-amber bg-warning-amber/5",
    medium: "border-blue-500 bg-blue-500/5",
    low: "border-slate-300 bg-slate-50",
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 border-l-4 rounded-r-xl flex items-center justify-between group cursor-pointer hover:shadow-sm transition-all hover:bg-slate-50/80",
        sevStyles[severity]
      )}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{time}</span>
          <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{location}</span>
        </div>
        <div className="text-sm font-bold group-hover:text-blue-600 transition-colors truncate">{title}</div>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
    </div>
  );
}

