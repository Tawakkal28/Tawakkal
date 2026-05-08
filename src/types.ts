export type InfrastructureType = 'power' | 'water' | 'transport' | 'telecom' | 'emergency';
export type StatusLevel = 'operational' | 'degraded' | 'critical' | 'offline';

export interface InfrastructureNode {
  id: string;
  name: string;
  type: InfrastructureType;
  status: StatusLevel;
  healthScore: number;
  location: {
    lat: number;
    lng: number;
  };
  dependencies: string[]; // IDs of other nodes it depends on
  lastChecked: string;
  riskProbability: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  systemType: InfrastructureType;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface RecoveryOperation {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  assignedTeams: string[];
  affectedInfrastructure: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'manager' | 'analyst';
  avatar?: string;
}
