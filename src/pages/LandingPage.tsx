import { motion } from 'motion/react';
import { Shield, Zap, Truck, MessageSquare, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-bottom border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-slate-900 border-b-2 border-primary-blue">UrbanSync</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-blue transition-colors">Features</a>
          <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary-blue transition-colors">About</a>
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-blue transition-colors">Login</Link>
          <Link to="/dashboard" className="bg-primary-blue text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-primary-blue/20">
            Access Dashboard
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary-blue border border-blue-100 mb-8"
            >
              <Shield size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Next-Gen Urban recovery</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 mb-6 leading-[0.95]"
            >
              Intelligent Infrastructure <br />
              <span className="text-primary-blue italic">Recovery Platform</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed"
            >
              Coordinate, predict, and recover. UrbanSync maps complex infrastructure interdependencies 
              to minimize downtime and synchronize city-wide restoration efforts during crisis.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/dashboard" className="bg-primary-blue text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-primary-blue/30 flex items-center gap-2">
                Launch Mission Control <ArrowRight size={20} />
              </Link>
              <Link to="/simulation" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                Watch Simulation
              </Link>
            </motion.div>
          </div>
          
          {/* Background Grid Accent */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </section>

        {/* Status Indicators */}
        <section className="bg-slate-900 py-12 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-1 border-l border-slate-700 pl-6">
              <span className="text-primary-blue font-mono text-3xl font-bold tracking-tighter">99.8%</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Grid Uptime Target</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-slate-700 pl-6">
              <span className="text-success-green font-mono text-3xl font-bold tracking-tighter">&lt; 15min</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Response Latency</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-slate-700 pl-6">
              <span className="text-warning-amber font-mono text-3xl font-bold tracking-tighter">AI-Enabled</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Predictive Recovery</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-slate-700 pl-6">
              <span className="text-white font-mono text-3xl font-bold tracking-tighter">42+ Cities</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Active Shielding</span>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                Designed for Mission <br />
                Critical Coordination
              </h2>
              <div className="w-20 h-1.5 bg-primary-blue"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Zap />, title: "Infrastructure Monitoring", desc: "Live health scores and status tracking across power, water, and telecom grids." },
                { icon: <Shield />, title: "Predictive Analytics", desc: "AI models anticipate cascading failures before they paralyze the entire urban network." },
                { icon: <Activity />, title: "Interactive Mapping", desc: "Visualize physical interdependencies with high-fidelity geospatial overlays." },
                { icon: <Truck />, title: "Resource Logistics", desc: "Optimized allocation of recovery teams and equipment based on critical path analysis." },
                { icon: <MessageSquare />, title: "Emergency Comms", desc: "Built-in coordination channels for multi-agency response synchronization." },
                { icon: <Zap />, title: "Simulation Engine", desc: "Run 'What-if' disaster scenarios to stress-test your city's recovery protocols." },
              ].map((feature, i) => (
                <div key={i} className="p-8 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-6 group-hover:bg-primary-blue group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Activity size={20} />
            <span className="font-display font-bold">UrbanSync</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 UrbanSync Infrastructure Protection. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
