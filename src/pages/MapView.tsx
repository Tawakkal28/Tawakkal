import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Sidebar from '../components/layout/Sidebar';
import { 
  Plus, 
  Minus, 
  Layers, 
  Maximize2, 
  MapPin,
  Activity,
  Zap,
  Droplets,
  ShieldAlert,
  Train,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { InfrastructureNode } from '../types';

// Fix for default leaflet markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const mockNodes: InfrastructureNode[] = [
  { id: '1', name: 'Mumbai Central Substation', type: 'power', status: 'operational', healthScore: 98, location: { lat: 18.9696, lng: 72.8193 }, dependencies: [], lastChecked: '2026-05-08T08:00:00Z', riskProbability: 0.05 },
  { id: '2', name: 'Delhi Power Hub', type: 'power', status: 'degraded', healthScore: 45, location: { lat: 28.6139, lng: 77.2090 }, dependencies: ['1'], lastChecked: '2026-05-08T08:30:00Z', riskProbability: 0.15 },
  { id: '3', name: 'Bangalore Water Distribution', type: 'water', status: 'offline', healthScore: 12, location: { lat: 12.9716, lng: 77.5946 }, dependencies: ['1'], lastChecked: '2026-05-08T08:45:00Z', riskProbability: 0.85 },
  { id: '4', name: 'Chennai Desalination', type: 'water', status: 'operational', healthScore: 100, location: { lat: 13.0827, lng: 80.2707 }, dependencies: ['1'], lastChecked: '2026-05-08T08:50:00Z', riskProbability: 0.02 },
];

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView() {
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>(['power', 'water', 'transport', 'telecom', 'emergency']);
  const [mapType, setMapType] = useState<'vector' | 'satellite'>('vector');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const getMarkerIcon = (type: string, status: string) => {
    const color = status === 'operational' ? '#3b82f6' : status === 'degraded' ? '#F59E0B' : '#EF4444';
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Map Header */}
        <header className="absolute top-0 left-0 right-0 h-16 bg-slate-900/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-[1000]">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-400 hover:bg-white/10 rounded-md"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <MapPin size={16} className="text-blue-400" />
              <span className="text-xs md:text-sm font-bold tracking-tight text-white">Geo-Spatial Interface</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white">
            <div className="flex bg-slate-800/80 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setMapType('vector')}
                className={cn("px-3 py-1.5 text-xs font-bold rounded transition-all", mapType === 'vector' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white")}
              >
                Vector
              </button>
              <button 
                onClick={() => setMapType('satellite')}
                className={cn("px-3 py-1.5 text-xs font-bold rounded transition-all", mapType === 'satellite' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white")}
              >
                Satellite
              </button>
            </div>
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <button className="p-2 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700 transition-colors">
              <Maximize2 size={18} />
            </button>
          </div>
        </header>

        {/* Leaflet Map */}
        <div className="flex-1 relative z-0">
          <MapContainer 
            center={[20.5937, 78.9629]} // India Center
            zoom={5} 
            className="w-full h-full"
            zoomControl={false}
          >
            {mapType === 'vector' ? (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            ) : (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
              />
            )}

            {mockNodes.filter(node => activeLayers.includes(node.type)).map(node => (
              <Marker 
                key={node.id} 
                position={[node.location.lat, node.location.lng]}
                icon={getMarkerIcon(node.type, node.status)}
                eventHandlers={{
                  click: () => setSelectedNode(node),
                }}
              >
                <Popup>
                  <div className="text-slate-900 p-1">
                    <div className="font-bold text-xs mb-1">{node.name}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">{node.type} • {node.status}</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            <MapController center={selectedNode ? [selectedNode.location.lat, selectedNode.location.lng] : [20.5937, 78.9629]} />
          </MapContainer>

          {/* Controls */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            <button className="p-3 bg-slate-800 border border-white/10 rounded-xl hover:bg-slate-700 transition-colors shadow-2xl">
              <Plus size={20} />
            </button>
            <button className="p-3 bg-slate-800 border border-white/10 rounded-xl hover:bg-slate-700 transition-colors shadow-2xl">
              <Minus size={20} />
            </button>
          </div>

          <div className="absolute left-8 bottom-8 z-20 max-w-xs flex flex-col gap-4">
            {/* Layers Panel */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={16} className="text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Infrastructure Layers</span>
              </div>
              <div className="space-y-2">
                {[
                  { id: 'power', icon: <Zap size={14} />, label: 'Power Grid', color: 'text-yellow-400' },
                  { id: 'water', icon: <Droplets size={14} />, label: 'Water Systems', color: 'text-blue-400' },
                  { id: 'transport', icon: <Train size={14} />, label: 'Transport Core', color: 'text-purple-400' },
                  { id: 'emergency', icon: <ShieldAlert size={14} />, label: 'Emergency', color: 'text-red-400' },
                ].map(layer => (
                  <label key={layer.id} className="flex items-center justify-between cursor-pointer group">
                    <div className={cn("flex items-center gap-3 text-sm transition-colors", activeLayers.includes(layer.id) ? "text-white" : "text-slate-500")}>
                      <span className={cn("transition-colors", activeLayers.includes(layer.id) ? layer.color : "text-slate-600")}>{layer.icon}</span>
                      {layer.label}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={activeLayers.includes(layer.id)} 
                      onChange={() => toggleLayer(layer.id)} 
                    />
                    <div className={cn(
                      "w-4 h-4 rounded border transition-all",
                      activeLayers.includes(layer.id) ? "bg-blue-600 border-blue-500" : "border-slate-600"
                    )}>
                      {activeLayers.includes(layer.id) && <div className="w-full h-full flex items-center justify-center text-[8px]">✓</div>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Node Detail Sidebar (Overlays the map on the right) */}
          {selectedNode && (
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              className="absolute top-20 right-8 bottom-8 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-30 flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    selectedNode.status === 'operational' ? "bg-success-green/10 text-success-green" : "bg-critical-red/10 text-critical-red"
                  )}>
                    {selectedNode.type === 'power' ? <Zap size={20} /> : <Droplets size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{selectedNode.name}</h3>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">NODE_ID: {selectedNode.id}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white transition-colors">
                  <Minus size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3">Live Health Score</div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-mono font-bold tracking-tighter">{selectedNode.healthScore}%</div>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full", selectedNode.healthScore > 80 ? "bg-success-green" : selectedNode.healthScore > 50 ? "bg-warning-amber" : "bg-critical-red")}
                        style={{ width: `${selectedNode.healthScore}%` }}
                      ></div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Specifications</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-500 mb-1">Risk Prob.</div>
                      <div className="text-sm font-mono font-bold">{(selectedNode.riskProbability * 100).toFixed(1)}%</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-500 mb-1">Dependencies</div>
                      <div className="text-sm font-mono font-bold">{selectedNode.dependencies.length} Nodes</div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3">Interdependency Graph</div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center aspect-square text-slate-600">
                    <Activity size={48} className="opacity-20 animate-pulse" />
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-white/5">
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                  <ShieldAlert size={16} /> Mark for Recovery
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
