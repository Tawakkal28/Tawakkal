import { useState } from 'react';
import { motion } from 'motion/react';
import Sidebar from '../components/layout/Sidebar';
import { 
  RefreshCw, 
  Clock, 
  Users, 
  Package, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RecoveryOperation } from '../types';

const mockOps: RecoveryOperation[] = [
  { id: 'REC-102', title: 'District 4 Grid Restoration', status: 'in-progress', progress: 65, startTime: '2026-05-08T04:00:00Z', estimatedCompletion: '2026-05-08T12:00:00Z', assignedTeams: ['Electrical Squad A', 'Drone Unit 4'], affectedInfrastructure: ['PWR-001', 'PWR-002'] },
  { id: 'REC-105', title: 'Mainline Debris Clearance', status: 'in-progress', progress: 32, startTime: '2026-05-08T06:30:00Z', estimatedCompletion: '2026-05-08T18:00:00Z', assignedTeams: ['Heavy Logistic Team'], affectedInfrastructure: ['TRN-881'] },
  { id: 'REC-098', title: 'Satellite Bridge Resync', status: 'completed', progress: 100, startTime: '2026-05-08T02:00:00Z', estimatedCompletion: '2026-05-08T05:00:00Z', assignedTeams: ['Telecom Specialists'], affectedInfrastructure: ['TEL-012'] },
  { id: 'REC-110', title: 'Water Pressure Calibration', status: 'pending', progress: 0, startTime: '2026-05-08T10:00:00Z', estimatedCompletion: '2026-05-08T14:00:00Z', assignedTeams: ['Hydraulic Eng Unit'], affectedInfrastructure: ['WTR-442', 'WTR-443'] },
];

export default function Recovery() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl font-bold tracking-tight">Recovery Operations</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-success-green/10 text-success-green rounded-full border border-success-green/20">
              <RefreshCw size={14} className="animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sync Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
              <Plus size={16} /> New Deployment
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <SummaryCard label="Active Missions" value="03" sub="Across 4 Zones" color="text-blue-600" />
            <SummaryCard label="Resources Deployed" value="124" sub="Equipment + Teams" color="text-purple-600" />
            <SummaryCard label="Success Rate" value="94.2%" sub="+1.2% this week" color="text-success-green" />
            <SummaryCard label="Est. Recovery Time" value="14.5" sub="Avg Hours" color="text-slate-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Operations List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">In-Progress Tasks</h2>
                <div className="flex gap-2">
                  <button className="text-xs font-bold text-slate-500 hover:text-slate-900 underline">All</button>
                  <button className="text-xs font-bold text-slate-500 hover:text-slate-900">Priority</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {mockOps.map((op) => (
                  <OpCard key={op.id} op={op} />
                ))}
              </div>
            </div>

            {/* Resources Panel */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Resource Allocation</h2>
              <div className="glass-card p-6 space-y-6">
                <ResourceItem label="Field Technicians" current={42} total={50} color="bg-blue-500" />
                <ResourceItem label="Maintenance Drones" current={8} total={12} color="bg-purple-500" />
                <ResourceItem label="Heavy Logistics" current={3} total={5} color="bg-amber-500" />
                <ResourceItem label="Medical Units" current={15} total={20} color="bg-red-500" />
                
                <div className="pt-6 border-t border-slate-100">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4">Available Teams</div>
                  <div className="space-y-3">
                    <TeamItem name="Rapid Response Unit 4" status="idle" />
                    <TeamItem name="Geo Engineering B" status="standby" />
                    <TeamItem name="Telecom Repair Alpha" status="returning" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <RefreshCw size={100} />
                </div>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <RefreshCw size={18} className="text-blue-400" />
                  Optimization Tip
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Merging REC-102 and REC-110 could save 15% logistic time as both involve Zone_Central_A nodes.
                </p>
                <button className="mt-4 text-xs font-bold text-blue-400 hover:underline">Apply Recommendation</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
  return (
    <div className="glass-card p-6 border-l-4 border-l-slate-200">
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">{label}</div>
      <div className={cn("text-3xl font-mono font-bold tracking-tighter mb-1", color)}>{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}

function OpCard({ op }: { op: RecoveryOperation }) {
  const isDone = op.status === 'completed';
  
  return (
    <div className={cn(
      "glass-card p-6 border border-slate-200 hover:border-blue-300 transition-all group",
      isDone && "bg-slate-50/80"
    )}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded tracking-tight">{op.id}</span>
            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
            <div className={cn(
              "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
              op.status === 'in-progress' ? "text-blue-600" : isDone ? "text-success-green" : "text-slate-400"
            )}>
              {op.status === 'in-progress' && <Clock size={10} />}
              {op.status}
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-4">{op.title}</h3>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users size={14} /> {op.assignedTeams.join(', ')}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Layers size={14} /> Affected: {op.affectedInfrastructure.join(', ')}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Progress</span>
              <span>{op.progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${op.progress}%` }}
                className={cn("h-full", isDone ? "bg-success-green" : "bg-blue-600")}
              ></motion.div>
            </div>
          </div>
        </div>

        <div className="md:w-px md:bg-slate-100"></div>

        <div className="md:w-56 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Started</div>
              <div className="text-sm font-medium">{new Date(op.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">ETA</div>
              <div className="text-sm font-medium">{new Date(op.estimatedCompletion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 bg-slate-100 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
            Manage <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceItem({ label, current, total, color }: { label: string, current: number, total: number, color: string }) {
  const percent = (current / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold">{current}/{total}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

function TeamItem({ name, status }: { name: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
      <div className="text-xs font-bold truncate pr-2">{name}</div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === 'idle' ? "bg-success-green" : status === 'standby' ? "bg-amber-500" : "bg-blue-500"
        )}></div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">{status}</span>
      </div>
    </div>
  );
}
