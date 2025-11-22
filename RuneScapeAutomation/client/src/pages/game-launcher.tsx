import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  Square,
  Settings,
  Download,
  Upload,
  Gamepad2,
  Globe,
  Users,
  Trophy,
  Clock,
  Zap,
  Shield,
  Sword,
  Map,
  Star,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import heroImage from "@assets/generated_images/OSRS_Grand_Exchange_hero_banner_a82c4135.png";

const gameWorlds = [
  { world: 302, type: "Trade", players: 1852, location: "United Kingdom", ping: 12, members: true },
  { world: 330, type: "House Party", players: 1234, location: "United States", ping: 45, members: true },
  { world: 301, type: "Free", players: 987, location: "United Kingdom", ping: 14, members: false },
  { world: 416, type: "LMS", players: 567, location: "Australia", ping: 120, members: true },
  { world: 373, type: "2200 Total", players: 432, location: "Germany", ping: 28, members: true },
];

const quickLaunchProfiles = [
  { name: "Main Account", combat: 126, total: 2277, icon: Sword, status: "ready" },
  { name: "Iron Man", combat: 105, total: 1876, icon: Shield, status: "ready" },
  { name: "Skiller", combat: 3, total: 1543, icon: Zap, status: "offline" },
  { name: "PKer", combat: 88, total: 1245, icon: Trophy, status: "ready" },
];

export default function GameLauncher() {
  const [selectedWorld, setSelectedWorld] = useState(302);
  const [isLaunching, setIsLaunching] = useState(false);
  const [gameStatus, setGameStatus] = useState<"offline" | "launching" | "running">("offline");

  const handleLaunch = () => {
    setIsLaunching(true);
    setGameStatus("launching");
    
    // Simulate launch process
    setTimeout(() => {
      setGameStatus("running");
      setIsLaunching(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
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
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/50 backdrop-blur-md border border-primary/30">
              {gameStatus === "running" ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-500 font-semibold">Game Running</span>
                </>
              ) : gameStatus === "launching" ? (
                <>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-yellow-500 font-semibold">Launching...</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-gray-500 rounded-full" />
                  <span className="text-gray-400 font-semibold">Game Offline</span>
                </>
              )}
            </div>
            
            <h1 className="text-6xl font-gaming font-bold text-white drop-shadow-2xl">
              OLD SCHOOL RUNESCAPE
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Adventure awaits in the world of Gielinor. Choose your path and become a legend.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                className="px-12 py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold animate-pulse-glow"
                onClick={handleLaunch}
                disabled={isLaunching || gameStatus === "running"}
                data-testid="button-launch-osrs"
              >
                {isLaunching ? (
                  <>
                    <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
                    Launching...
                  </>
                ) : gameStatus === "running" ? (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Game Running
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    Launch Game
                  </>
                )}
              </Button>
              {gameStatus === "running" && (
                <Button 
                  size="lg"
                  variant="destructive"
                  className="px-8 py-6 text-lg"
                  onClick={() => setGameStatus("offline")}
                >
                  <Square className="w-6 h-6 mr-2" />
                  Stop Game
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Quick Launch Profiles */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Quick Launch Profiles
            </CardTitle>
            <CardDescription>
              Select an account profile to launch with pre-configured settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLaunchProfiles.map((profile, i) => {
                const Icon = profile.icon;
                return (
                  <Card 
                    key={i}
                    className="border-border/50 bg-muted/30 hover-elevate cursor-pointer"
                    data-testid={`profile-${profile.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20`}>
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge 
                          variant={profile.status === "ready" ? "outline" : "secondary"}
                          className={profile.status === "ready" ? "border-green-500/50 text-green-500" : ""}
                        >
                          {profile.status === "ready" && (
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                          )}
                          {profile.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{profile.name}</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Combat:</span>
                          <span className="font-mono">{profile.combat}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-mono">{profile.total}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3" 
                        variant="outline"
                        disabled={profile.status === "offline"}
                      >
                        Launch
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* World Selector and Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* World Selector */}
          <Card className="lg:col-span-2 border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                World Selector
              </CardTitle>
              <CardDescription>
                Choose your preferred game world based on location and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recommended">
                <TabsList className="bg-muted/30">
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  <TabsTrigger value="all">All Worlds</TabsTrigger>
                  <TabsTrigger value="favorite">Favorites</TabsTrigger>
                </TabsList>
                <TabsContent value="recommended" className="space-y-2 mt-4">
                  {gameWorlds.map((world) => (
                    <div
                      key={world.world}
                      className={`
                        flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                        ${selectedWorld === world.world 
                          ? 'bg-primary/20 border border-primary/30' 
                          : 'bg-muted/30 hover:bg-muted/50'}
                      `}
                      onClick={() => setSelectedWorld(world.world)}
                      data-testid={`world-${world.world}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-gaming text-lg font-bold">W{world.world}</p>
                          <Badge variant="outline" className="text-xs">
                            {world.type}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Map className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{world.location}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {world.players}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {world.ping}ms
                            </span>
                            {world.members && (
                              <Badge variant="secondary" className="text-xs h-4">
                                <Star className="w-2 h-2 mr-1" />
                                Members
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedWorld === world.world && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Launch Settings */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-secondary" />
                Launch Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Graphics Mode</span>
                  <Badge variant="outline">GPU</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Draw Distance</span>
                  <Badge variant="outline">50</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">FPS Cap</span>
                  <Badge variant="outline">Unlimited</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Plugins</span>
                  <Badge variant="outline">117 HD</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <h4 className="text-sm font-semibold mb-3">Client Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Auto-login
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Remember world
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    Low detail mode
                  </label>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Statistics */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Session Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold font-mono">0:00</p>
                <p className="text-xs text-muted-foreground">Session Time</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Zap className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold font-mono">0</p>
                <p className="text-xs text-muted-foreground">XP Gained</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold font-mono">0</p>
                <p className="text-xs text-muted-foreground">Quests Done</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold font-mono">0</p>
                <p className="text-xs text-muted-foreground">Levels Gained</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}