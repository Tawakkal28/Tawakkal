import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { 
  PlayCircle, 
  Settings2, 
  Save, 
  History, 
  Zap, 
  Wind, 
  Droplets, 
  ShieldAlert,
  Flame,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const scenarios = [
  { id: 'S1', name: 'Monsoon Flash Flood', type: 'flood', icon: <Droplets />, desc: 'Simulates 300mm rainfall in 24 hours over Mumbai metropolitan area.', impact: 'Critical inundation of low-lying pumping stations.' },
  { id: 'S2', name: 'Cyclone Vardah Re-run', type: 'weather', icon: <Wind />, desc: 'Category 4 cyclone impact on Chennai coastal infrastructure.', impact: 'Telecom and Grid network destruction estimate 65%.' },
  { id: 'S3', name: 'Peak Summer Grid Stress', type: 'power', icon: <Flame />, desc: 'Simulates Northern Grid performance at 49°C ambient temperature.', impact: 'Thermal trip hazard for 400kV transformers.' },
  { id: 'S4', name: 'Cyber-Grid Ransomware', type: 'security', icon: <ShieldAlert />, desc: 'Simulated malware injection into SCADA systems of the National Load Despatch Centre.', impact: 'Total regional blackout risk.' },
];

export default function Simulation() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | any>(null);

  const startSimulation = () => {
    if (!selectedScenario) return;
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setResult({
            affectedNodes: 24,
            estimatedDowntime: '18.4 Hours',
            cascadingConfidence: '92%',
            bottleneck: 'District 4 Main Transformer'
          });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl font-bold tracking-tight">Disaster Simulation Engine</h1>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              CORE_ALLOCATION // 84% AVAILABLE
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <History size={16} /> Archive
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Save size={16} /> Save Template
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scenario Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Incursion Scenarios</h2>
                <button className="p-1 hover:bg-slate-200 rounded-lg transition-colors"><Settings2 size={16} /></button>
              </div>
              
              <div className="space-y-3">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenario(s.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all group",
                      selectedScenario === s.id 
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        selectedScenario === s.id ? "bg-white/10" : "bg-slate-50"
                      )}>
                        {s.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold truncate">{s.name}</div>
                        <div className={cn("text-[10px] uppercase font-bold tracking-widest opacity-60", selectedScenario === s.id ? "text-slate-300" : "text-slate-400")}>{s.type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-primary-blue mb-2">
                  <Info size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Engine Note</span>
                </div>
                <p className="text-xs text-blue-800/70 leading-relaxed">
                  Scenarios are generated using probabilistic graph models based on current infrastructure health scores.
                </p>
              </div>
            </div>

            {/* Config & Execution */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-8 flex flex-col h-full min-h-[500px]">
                {selectedScenario ? (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-display font-bold">{scenarios.find(s => s.id === selectedScenario)?.name}</h2>
                          <p className="text-slate-500 max-w-md mt-2">{scenarios.find(s => s.id === selectedScenario)?.desc}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Impact Level</div>
                          <div className="text-critical-red font-bold text-xl uppercase tracking-tighter">Severe</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-12">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Affected Assets (Est)</div>
                          <div className="text-2xl font-mono font-bold tracking-tighter">84 Nodes</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Confidence Interval</div>
                          <div className="text-2xl font-mono font-bold tracking-tighter">78-92%</div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isRunning && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6 py-8 border-t border-slate-100"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Loader2 className="animate-spin text-blue-600" size={20} />
                                <span className="text-sm font-bold tracking-tight">Processing Cascading Failure Model...</span>
                              </div>
                              <span className="text-sm font-mono font-bold">{progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-600"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </motion.div>
                        )}

                        {result && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                              <CheckCircle2 size={120} />
                            </div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                              <CheckCircle2 size={24} className="text-success-green" />
                              Simulation Complete
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-8 relative z-10">
                              <div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Max Downtime</div>
                                <div className="text-2xl font-mono font-bold tracking-tighter text-blue-400">{result.estimatedDowntime}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Primary Bottleneck</div>
                                <div className="text-sm font-bold text-slate-100">{result.bottleneck}</div>
                              </div>
                            </div>

                            <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                              Generate Recovery Strategy <ArrowRight size={16} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {!isRunning && !result && (
                      <button 
                        onClick={startSimulation}
                        className="w-full py-4 bg-primary-blue text-white rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                      >
                        <PlayCircle size={24} /> Run Neural Incursion Simulation
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                      <PlayCircle size={48} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-400 italic">Select S_SCENARIO</h3>
                    <p className="text-slate-400 text-sm max-w-xs">Please select a simulation template from the left panel to begin infrastructure stress-testing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
