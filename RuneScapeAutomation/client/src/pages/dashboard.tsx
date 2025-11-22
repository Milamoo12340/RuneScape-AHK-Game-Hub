import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Cpu,
  HardDrive,
  Activity,
  TrendingUp,
  Clock,
  Zap,
  Trophy,
  Target,
  ArrowUp,
  ArrowDown,
  Play,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import heroImage from "@assets/generated_images/OSRS_Grand_Exchange_hero_banner_a82c4135.png";
import { useQuery } from "@tanstack/react-query";
import { Script } from "@shared/schema";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    gpu: 0,
    ram: 0,
    disk: 0,
  });
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [scriptCount, setScriptCount] = useState(128);
  const [activeTime, setActiveTime] = useState("2h 34m");
  const [xpGained, setXpGained] = useState("+45.2K");

  // Fetch real system stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/system-stats');
        if (res.ok) {
          const data = await res.json();
          setSystemStats({
            cpu: data.cpu,
            gpu: data.gpu,
            ram: data.ram,
            disk: data.disk,
          });
        }
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
      }
    };

    // Fetch immediately and then every 5 seconds
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch chart history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/system-stats/history');
        if (res.ok) {
          const data = await res.json();
          setPerformanceData(data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };

    fetchHistory();
  }, []);

  // Fetch scripts count
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const res = await fetch('/api/scripts');
        if (res.ok) {
          const scripts = await res.json();
          setScriptCount(scripts.length);
        }
      } catch (error) {
        console.error('Failed to fetch scripts:', error);
      }
    };

    fetchScripts();
  }, []);

  // Fallback data
  const xpData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    xp: Math.floor(Math.random() * 50000 + 20000),
  }));
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Game Banner */}
      <div className="relative h-[300px] overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
        
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-5xl font-gaming font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">
              OSRS GAMING HUB
            </h1>
            <p className="text-xl text-foreground/90 mb-6">
              Your Ultimate RuneScape Command Center
            </p>
            <div className="flex gap-4">
              <Link href="/launcher">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 group animate-pulse-glow"
                  data-testid="button-launch-game"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:animate-spin-slow" />
                  Launch Game
                </Button>
              </Link>
              <Link href="/ai-generator">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary/50 hover:bg-primary/10 backdrop-blur-sm"
                  data-testid="button-create-script"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Script
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Scripts
              </CardTitle>
              <Trophy className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{scriptCount}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-green-500" />
                +12 this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Time
              </CardTitle>
              <Clock className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{activeTime}</div>
              <p className="text-xs text-muted-foreground">
                Today's session
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                XP Gained
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-green-500">{xpGained}</div>
              <p className="text-xs text-muted-foreground">
                Across all skills
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                RAM Usage
              </CardTitle>
              <HardDrive className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{systemStats.ram}%</div>
              <Progress value={systemStats.ram} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Performance */}
          <Card className="lg:col-span-2 border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* CPU/GPU Bars */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Cpu className="w-4 h-4" />
                        CPU
                      </span>
                      <span className="text-sm font-mono text-primary">{systemStats.cpu}%</span>
                    </div>
                    <Progress value={systemStats.cpu} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <HardDrive className="w-4 h-4" />
                        GPU
                      </span>
                      <span className="text-sm font-mono text-secondary">{systemStats.gpu}%</span>
                    </div>
                    <Progress value={systemStats.gpu} className="h-2 [&>div]:bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        RAM
                      </span>
                      <span className="text-sm font-mono text-accent">6.2GB</span>
                    </div>
                    <Progress value={65} className="h-2 [&>div]:bg-accent" />
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cpu" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gpu" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="fps" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* FPS Counter */}
                <div className="flex items-center justify-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-gaming font-bold text-green-500">117</div>
                    <div className="text-sm text-muted-foreground">FPS</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </span>
                <Badge variant="secondary" className="text-xs">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {[
                    { time: "2m ago", action: "Executed", script: "Fishing Bot Pro", status: "success" },
                    { time: "15m ago", action: "Generated", script: "Magic Training v2", status: "ai" },
                    { time: "1h ago", action: "Modified", script: "Combat Helper", status: "warning" },
                    { time: "2h ago", action: "Uploaded", script: "Mining Assistant", status: "info" },
                    { time: "3h ago", action: "Executed", script: "Agility Runner", status: "success" },
                    { time: "4h ago", action: "Deleted", script: "Old Script v1", status: "danger" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`
                        w-2 h-2 rounded-full mt-2
                        ${item.status === 'success' ? 'bg-green-500' :
                          item.status === 'ai' ? 'bg-gradient-to-r from-primary to-secondary' :
                          item.status === 'warning' ? 'bg-yellow-500' :
                          item.status === 'danger' ? 'bg-red-500' :
                          'bg-blue-500'}
                      `} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{item.action}</p>
                          <span className="text-xs text-muted-foreground">{item.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.script}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* XP Tracking Chart */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Weekly XP Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpData}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#xpGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}