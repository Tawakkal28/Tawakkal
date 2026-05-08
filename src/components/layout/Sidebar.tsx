import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Activity, 
  RefreshCw, 
  PlayCircle, 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <MapIcon size={20} />, label: 'City Map', path: '/map' },
  { icon: <Activity size={20} />, label: 'Infrastructure', path: '/infrastructure' },
  { icon: <RefreshCw size={20} />, label: 'Recovery', path: '/recovery' },
  { icon: <PlayCircle size={20} />, label: 'Simulation', path: '/simulation' },
  { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
  { icon: <AlertTriangle size={20} />, label: 'Alert Center', path: '/alerts' },
  { icon: <FileText size={20} />, label: 'Reports', path: '/reports' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0 transition-transform duration-300 lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Activity size={18} />
            </div>
            <span className="font-display font-bold tracking-tight text-lg text-white">UrbanSync</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 text-white">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-4">Operations</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn("transition-colors", "group-hover:text-blue-400")}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <NavLink to="/settings" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <Settings size={20} /> Settings
          </NavLink>
          <NavLink to="/help" onClick={onClose} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <HelpCircle size={20} /> Help Center
          </NavLink>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors mt-4"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
