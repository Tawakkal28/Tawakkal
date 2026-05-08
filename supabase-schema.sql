-- UrbanSync Supabase Schema

-- Infrastructure Nodes
CREATE TABLE infrastructure_nodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('power', 'water', 'transport', 'telecom', 'emergency')),
    status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'critical', 'offline')),
    health_score INTEGER NOT NULL DEFAULT 100,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    dependencies TEXT[] DEFAULT '{}',
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    risk_probability DOUBLE PRECISION DEFAULT 0.0
);

-- Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    system_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('active', 'acknowledged', 'resolved'))
);

-- Recovery Operations
CREATE TABLE recovery_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed')),
    progress INTEGER DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_completion TIMESTAMP WITH TIME ZONE,
    assigned_teams TEXT[] DEFAULT '{}',
    affected_infrastructure TEXT[] DEFAULT '{}'
);

-- Profiles (for RBAC)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    role TEXT CHECK (role IN ('admin', 'coordinator', 'manager', 'analyst')) DEFAULT 'coordinator',
    avatar_url TEXT
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE infrastructure_nodes;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE recovery_operations;
