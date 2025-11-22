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
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Generate mock data
const generateTimeSeriesData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.floor(Math.random() * 40 + 30),
    gpu: Math.floor(Math.random() * 60 + 20),
    ram: Math.floor(Math.random() * 30 + 40),
    temp: Math.floor(Math.random() * 20 + 60),
    fps: Math.floor(Math.random() * 30 + 90),
    network: Math.floor(Math.random() * 100 + 50),
  }));
};

const processData = [
  { name: "OSRS Client", cpu: 32, ram: 2.4, status: "active" },
  { name: "AutoHotkey", cpu: 8, ram: 0.3, status: "active" },
  { name: "Chrome", cpu: 15, ram: 3.1, status: "idle" },
  { name: "Discord", cpu: 5, ram: 0.8, status: "idle" },
  { name: "System", cpu: 12, ram: 1.2, status: "active" },
];

const pieData = [
  { name: "CPU", value: 42, color: "hsl(var(--primary))" },
  { name: "GPU", value: 58, color: "hsl(var(--secondary))" },
  { name: "RAM", value: 65, color: "hsl(var(--accent))" },
  { name: "Disk", value: 35, color: "hsl(var(--chart-4))" },
];

export default function SystemMonitor() {
  const [data, setData] = useState(generateTimeSeriesData(20));
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setData(generateTimeSeriesData(20));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

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
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
              Auto Refresh
            </Button>
            <Button variant="outline">
              <Maximize2 className="w-4 h-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <CardHeader className="relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  CPU Usage
                </span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-mono text-primary">42%</div>
              <Progress value={42} className="h-2 mt-3" />
              <p className="text-xs text-muted-foreground mt-2">
                Intel Core i7-9700K @ 3.6GHz
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
            <CardHeader className="relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  GPU Usage
                </span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-mono text-secondary">58%</div>
              <Progress value={58} className="h-2 mt-3 [&>div]:bg-secondary" />
              <p className="text-xs text-muted-foreground mt-2">
                NVIDIA RTX 3070 Ti
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
            <CardHeader className="relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  RAM Usage
                </span>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-mono text-accent">6.2GB</div>
              <Progress value={65} className="h-2 mt-3 [&>div]:bg-accent" />
              <p className="text-xs text-muted-foreground mt-2">
                9.5 GB / 16 GB Used
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            <CardHeader className="relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  FPS Counter
                </span>
                <Badge variant="outline" className="text-green-500 border-green-500/50">
                  Excellent
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-mono text-green-500">117</div>
              <div className="flex items-center gap-2 mt-3">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">+12% from average</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Monitoring Tabs */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="processes">Processes</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Real-time Performance Chart */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Real-time Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
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
                          dataKey="ram" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Distribution */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-secondary" />
                    Resource Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm font-mono text-muted-foreground ml-auto">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FPS History */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-500" />
                  FPS History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="fpsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
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
                      <Area 
                        type="monotone" 
                        dataKey="fps" 
                        stroke="rgb(34, 197, 94)" 
                        fill="url(#fpsGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processes" className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Active Processes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {processData.map((process, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${process.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="font-medium">{process.name}</p>
                          <p className="text-xs text-muted-foreground">PID: {Math.floor(Math.random() * 10000)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-mono">{process.cpu}%</p>
                          <p className="text-xs text-muted-foreground">CPU</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono">{process.ram} GB</p>
                          <p className="text-xs text-muted-foreground">RAM</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="temperature" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    CPU Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">68°C</div>
                  <Progress value={68} className="h-2 mt-3" />
                  <Badge variant="outline" className="mt-2 text-green-500 border-green-500/50">
                    Normal
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    GPU Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">72°C</div>
                  <Progress value={72} className="h-2 mt-3 [&>div]:bg-yellow-500" />
                  <Badge variant="outline" className="mt-2 text-yellow-500 border-yellow-500/50">
                    Warm
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    System Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">45°C</div>
                  <Progress value={45} className="h-2 mt-3 [&>div]:bg-green-500" />
                  <Badge variant="outline" className="mt-2 text-green-500 border-green-500/50">
                    Cool
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-primary" />
                  Network Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Download</p>
                    <p className="text-2xl font-bold font-mono flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-green-500" />
                      125 Mbps
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upload</p>
                    <p className="text-2xl font-bold font-mono flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      45 Mbps
                    </p>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
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
                      <Area 
                        type="monotone" 
                        dataKey="network" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#networkGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}