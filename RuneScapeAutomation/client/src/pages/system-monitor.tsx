import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cpu,
  HardDrive,
  Activity,
  Zap,
  Thermometer,
  Wifi,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Maximize2,
  Loader2,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";

export default function SystemMonitor() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  // Fetch real system stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['/api/system-stats'],
    queryFn: async () => {
      const res = await fetch("/api/system-stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 3000,
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // Fetch stats history for charts
  const { data: statsHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['/api/system-stats/history'],
    queryFn: async () => {
      const res = await fetch("/api/system-stats/history");
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const StatCard = ({ title, value, icon: Icon, color = "text-primary", unit = "%" }: any) => (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
      <CardHeader className="relative">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            {title}
          </span>
          <span className={`text-xl font-bold ${color}`}>{value}{unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Progress value={Math.min(value, 100)} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {value >= 80 ? "High usage" : value >= 50 ? "Moderate usage" : "Low usage"}
        </p>
      </CardContent>
    </Card>
  );

  const pieData = stats ? [
    { name: "CPU", value: stats.cpu, color: "hsl(var(--primary))" },
    { name: "RAM", value: stats.ram, color: "hsl(var(--accent))" },
  ] : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-gaming font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              System Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time system performance and resource monitoring
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-green-500 hover:bg-green-600" : ""}
              data-testid="button-auto-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
            <Button variant="outline" onClick={() => refetchStats()}>
              <Maximize2 className="w-4 h-4 mr-2" />
              Refresh Now
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-border/50 bg-card/80">
                <CardContent className="pt-6 h-24" />
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="CPU" value={Math.round(stats.cpu)} icon={Cpu} color={stats.cpu > 80 ? "text-red-500" : "text-primary"} />
            <StatCard title="RAM" value={stats.ram} icon={HardDrive} color={stats.ram > 80 ? "text-red-500" : "text-primary"} />
            <StatCard title="GPU" value={stats.gpu} icon={Zap} color={stats.gpu > 80 ? "text-red-500" : "text-primary"} />
            <StatCard title="Disk" value={stats.disk} icon={Database} color={stats.disk > 80 ? "text-red-500" : "text-primary"} />
          </div>
        ) : null}

        {/* Charts */}
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            {historyLoading ? (
              <Card className="border-border/50 bg-card/80">
                <CardContent className="pt-6 h-80 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      CPU Usage Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={statsHistory}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                        />
                        <Area type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCpu)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-accent" />
                      RAM Usage Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={statsHistory}>
                        <defs>
                          <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                        />
                        <Area type="monotone" dataKey="ram" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRam)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            {stats ? (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Resource Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {stats ? (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    System Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-mono">{Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Platform</p>
                      <p className="text-lg font-mono">{stats.platform}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Node Version</p>
                      <p className="text-lg font-mono">{stats.nodeVersion}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-lg font-mono">{new Date(stats.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
