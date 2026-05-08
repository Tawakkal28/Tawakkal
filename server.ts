import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
import OpenAI from "openai";
import webpush from "web-push";
import { InfrastructureNode, Alert, RecoveryOperation } from "./src/types";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI Setup
let openai: OpenAI | null = null;
function getOpenAI() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing from environment variables.");
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

// WebPush Setup
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || 'BJKzscUBwTCmbCQ4QeI4kgCxj5ctcAdRPcIAkwqMDOQrmnr1NDfo2CuxB_2PmtlnKr7eK0v8W9kcm2rjNoPElhw';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || 'Q_fDCNxDN_A5uGc2nOZhYxAFMoDR0FzO_tmR3pF0F5U';

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:admin@urbansync.ai',
    publicVapidKey,
    privateVapidKey
  );
}

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) ? createClient(supabaseUrl, supabaseKey) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data (Fallback) - Localized for India (Mumbai/Delhi/Bangalore)
  let mockNodes: InfrastructureNode[] = [
    { 
      id: 'N-1', name: 'Mumbai Central Grid Substation', type: 'power', status: 'operational', healthScore: 92, 
      location: { lat: 18.9696, lng: 72.8193 }, dependencies: [], lastChecked: new Date().toISOString(), riskProbability: 0.05 
    },
    { 
      id: 'N-2', name: 'Delhi NCR Power Hub', type: 'power', status: 'degraded', healthScore: 64, 
      location: { lat: 28.6139, lng: 77.2090 }, dependencies: ['N-1'], lastChecked: new Date().toISOString(), riskProbability: 0.45 
    },
    { 
      id: 'N-3', name: 'Bangalore Water Distribution Unit 4', type: 'water', status: 'operational', healthScore: 88, 
      location: { lat: 12.9716, lng: 77.5946 }, dependencies: ['N-2'], lastChecked: new Date().toISOString(), riskProbability: 0.12 
    },
    { 
      id: 'N-4', name: 'Chennai Desalination Plant', type: 'water', status: 'operational', healthScore: 95, 
      location: { lat: 13.0827, lng: 80.2707 }, dependencies: [], lastChecked: new Date().toISOString(), riskProbability: 0.02 
    }
  ];

  let mockAlerts: Alert[] = [
    { id: 'AL-902', title: 'South Mumbai Grid Overload', description: 'Transformer at Central Station B recording 115% nominal load due to festive surge.', severity: 'critical', systemType: 'power', timestamp: new Date().toISOString(), status: 'active' }
  ];

  async function fetchRealWorldDisasters() {
    try {
      // Fetch specifically for Indian Subcontinent region (Bounding Box: 8.4N, 68.7E to 37.6N, 97.25E)
      const indiaQuery = 'format=geojson&minlatitude=8.4&maxlatitude=37.6&minlongitude=68.7&maxlongitude=97.25&minmagnitude=2.0';
      const response = await fetch(`https://earthquakes.usgs.gov/fdsnws/event/1/query?${indiaQuery}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(30000) // 30s timeout
      });

      if (!response.ok) {
        console.warn(`Real-world data source returned status: ${response.status}`);
        return [];
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`Real-world data source returned non-JSON content: ${contentType}`);
        return [];
      }

      const data: any = await response.json();
      
      if (!data || !data.features) return [];

      const realAlerts: Alert[] = data.features.slice(0, 5).map((f: any) => ({
        id: `USGS-${f.id}`,
        title: `Seismic Event: Mag ${f.properties.mag}`,
        description: f.properties.place,
        severity: f.properties.mag > 4 ? 'high' : 'medium',
        systemType: 'emergency',
        timestamp: new Date(f.properties.time).toISOString(),
        status: 'active'
      }));

      return realAlerts;
    } catch (err) {
      console.error("Failed to fetch real-world data:", err instanceof Error ? err.message : err);
      return [];
    }
  }

  async function fetchIndianNews() {
    try {
      // Use Google News RSS for localized Indian disaster news
      const response = await fetch('https://news.google.com/rss/search?q=disaster+alert+infrastructure+india&hl=en-IN&gl=IN&ceid=IN:en', {
        signal: AbortSignal.timeout(30000)
      });
      const xml = await response.text();
      
      // Basic XML parsing for RSS (Regex is safer than full parser for simple needs)
      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      const newsAlerts: Alert[] = items.slice(0, 5).map((item, idx) => {
        const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || 'News Alert';
        const description = (item.match(/<description>(.*?)<\/description>/) || [])[1] || '';
        const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || new Date().toISOString();
        
        return {
          id: `NEWS-IN-${idx}`,
          title: title.split(' - ')[0], // Remove source from title
          description: description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
          severity: title.toLowerCase().includes('critical') || title.toLowerCase().includes('death') ? 'critical' : 'medium',
          systemType: 'emergency',
          timestamp: new Date(pubDate).toISOString(),
          status: 'active'
        };
      });

      return newsAlerts;
    } catch (err) {
      console.error("Failed to fetch Indian news:", err);
      return [];
    }
  }

  let mockOperations: RecoveryOperation[] = [
    { id: 'OP-401', title: 'Mumbai Grid Balancing', status: 'in-progress', progress: 35, startTime: new Date().toISOString(), estimatedCompletion: new Date(Date.now() + 14400000).toISOString(), assignedTeams: ['Western-Force-1'], affectedInfrastructure: ['N-1'] }
  ];

  // API Routes
  app.get("/api/infrastructure", async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('infrastructure_nodes').select('*');
      if (!error && data && data.length > 0) {
        // Map DB Lat/Lng to Location object
        return res.json(data.map(n => ({
          ...n,
          location: { lat: n.location_lat, lng: n.location_lng }
        })));
      }
    }
    res.json(mockNodes);
  });

  app.get("/api/alerts", async (req, res) => {
    let combinedAlerts = [...mockAlerts];
    
    // Add real-world data (Earthquakes in India + National News)
    const [realAlerts, indianNews] = await Promise.all([
      fetchRealWorldDisasters(),
      fetchIndianNews()
    ]);
    combinedAlerts = [...indianNews, ...realAlerts, ...combinedAlerts];

    if (supabase) {
      const { data, error } = await supabase.from('alerts').select('*').order('timestamp', { ascending: false });
      if (!error && data && data.length > 0) return res.json([...combinedAlerts, ...data]);
    }
    res.json(combinedAlerts);
  });

  app.get("/api/recovery", async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('recovery_operations').select('*');
      if (!error && data && data.length > 0) return res.json(data);
    }
    res.json(mockOperations);
  });

  // LLM Chat endpoint using OpenAI
  app.post("/api/ai/chat", async (req, res) => {
    const { messages } = req.body;
    try {
      const client = getOpenAI();
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are the UrbanSync AI Core (India Region). Help with urban infrastructure recovery in Indian metropolitan cities. Be technical and precise. Provide actionable insights for disaster management teams." },
          ...messages
        ],
      });
      res.json({ text: completion.choices[0].message.content });
    } catch (error: any) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ error: "Intelligence core failure: " + (error.message || "Unknown error") });
    }
  });

  // LLM Insights endpoint
  app.post("/api/ai/insights", async (req, res) => {
    const { nodes, alerts } = req.body;
    try {
      const client = getOpenAI();
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are the UrbanSync AI Core (India Region). Analyze infrastructure data and provide short, strategic summaries." },
          { role: "user", content: `Analyze: Nodes: ${JSON.stringify(nodes)}. Alerts: ${JSON.stringify(alerts)}. Provide a 1-sentence summary and 2 actions as JSON: { "summary": "...", "actions": ["...", "..."] }` }
        ],
        response_format: { type: "json_object" }
      });
      res.json(JSON.parse(completion.choices[0].message.content || "{}"));
    } catch (error: any) {
      console.error("OpenAI Insights Error:", error);
      res.status(500).json({ error: "Failed to generate strategic insights: " + (error.message || "Unknown error") });
    }
  });

  // WebPush Subscription
  let subscriptions: any[] = [];
  app.post("/api/notifications/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
  });

  app.post("/api/notifications/test", (req, res) => {
    const payload = JSON.stringify({ title: "Infrastructure Alert", body: "Critical failure detected in Mumbai Central Grid." });
    Promise.all(subscriptions.map(sub => 
      webpush.sendNotification(sub, payload).catch(err => console.error("Push error:", err))
    ));
    res.status(200).json({ message: "Test notification sent." });
  });

  app.post("/api/recovery/start", async (req, res) => {
    const { title, nodes: affectedNodes } = req.body;
    
    const newOp = {
      title: title || 'Emergency Recovery',
      status: 'pending',
      progress: 0,
      start_time: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 7200000).toISOString(),
      assigned_teams: ['Quick-Response'],
      affected_infrastructure: affectedNodes || []
    };

    if (supabase) {
      const { data, error } = await supabase.from('recovery_operations').insert([newOp]).select();
      if (!error && data) return res.status(201).json(data[0]);
    }

    // Dynamic Mock Fallback
    const mockOp: RecoveryOperation = {
      ...newOp,
      id: `OP-${Math.floor(Math.random() * 1000)}`,
      startTime: newOp.start_time,
      estimatedCompletion: newOp.estimated_completion,
      assignedTeams: newOp.assigned_teams,
      affectedInfrastructure: newOp.affected_infrastructure
    } as any;
    mockOperations.push(mockOp);
    res.status(201).json(mockOp);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Manually serve index.html for SPA in middleware mode
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UrbanSync Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
