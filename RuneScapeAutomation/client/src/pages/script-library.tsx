import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Upload,
  Download,
  Play,
  Heart,
  Code,
  Star,
  Clock,
  MoreVertical,
  Sword,
  Fish,
  Pickaxe,
  Wand2,
  Zap,
  Hammer,
  ChefHat,
  Axe,
  Settings,
  Plus,
  FileUp,
  Sparkles,
  Lock,
  LogIn,
  Edit,
  Trash,
  ArrowUp,
  Beaker,
  Flower,
  Home,
  Circle,
  Hand,
  Target,
  Flame,
  Trophy,
  Swords,
  Building,
} from "lucide-react";
import { SCRIPT_CATEGORIES } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { UserBenefits } from "@/components/user-benefits";
import { Link } from "wouter";

// Mock scripts data
const mockScripts = [
  {
    id: "1",
    name: "Elite Fishing Bot Pro",
    description: "Advanced fishing automation with anti-ban features and intelligent spot switching",
    category: "fishing",
    author: "OSRSMaster",
    executionCount: 1542,
    lastExecuted: "2 hours ago",
    isFavorite: true,
    rating: 4.8,
    code: `; Elite Fishing Bot Pro v3.2
; Features: Anti-ban, spot switching, break management

#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

; Main fishing loop
F1::
Loop {
    ; Click fishing spot
    Click, 523, 412
    Sleep, Random(2000, 3500)
    
    ; Check inventory
    Send, {Tab}
    Sleep, 500
    
    ; Anti-ban movements
    if (Random(1, 10) > 8) {
        MouseMove, Random(100, 700), Random(100, 500), 10
        Sleep, Random(1000, 2000)
    }
}
return

F2::Pause
F3::ExitApp`,
  },
  {
    id: "2",
    name: "Combat Trainer Ultimate",
    description: "Complete combat automation with prayer flicking and special attack management",
    category: "combat",
    author: "PvPKing",
    executionCount: 892,
    lastExecuted: "Yesterday",
    isFavorite: false,
    rating: 4.6,
    code: `; Combat script code here...`,
  },
  {
    id: "3",
    name: "Magic High Alch Bot",
    description: "Efficient high alchemy script with automatic item detection",
    category: "magic",
    author: "WizardPro",
    executionCount: 2103,
    lastExecuted: "5 hours ago",
    isFavorite: true,
    rating: 4.9,
    code: `; High alch script code...`,
  },
  {
    id: "4",
    name: "Mining Powerleveler",
    description: "Power mining with ore dropping and banking support",
    category: "mining",
    author: "MinerMax",
    executionCount: 567,
    lastExecuted: "1 day ago",
    isFavorite: false,
    rating: 4.3,
    code: `; Mining script code...`,
  },
  {
    id: "5",
    name: "Agility Course Runner",
    description: "Rooftop agility course automation with mark collection",
    category: "agility",
    author: "RuneFast",
    executionCount: 1876,
    lastExecuted: "3 hours ago",
    isFavorite: true,
    rating: 4.7,
    code: `; Agility script code...`,
  },
];

const categoryIcons: Record<string, any> = {
  combat: Sword,
  fishing: Fish,
  mining: Pickaxe,
  magic: Wand2,
  agility: Zap,
  crafting: Hammer,
  cooking: ChefHat,
  woodcutting: Axe,
  smithing: Hammer,
  fletching: ArrowUp,
  herblore: Beaker,
  farming: Flower,
  construction: Home,
  runecrafting: Circle,
  thieving: Hand,
  hunter: Target,
  firemaking: Flame,
  minigames: Trophy,
  pvp: Swords,
  banking: Building,
  utility: Settings,
};

export default function ScriptLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("public");
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Fetch scripts from backend
  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ['/api/scripts']
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (scriptId: string) => {
      return apiRequest(`/api/scripts/${scriptId}/favorite`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      toast({
        title: "Success",
        description: "Favorite status updated"
      });
    }
  });

  // Delete script mutation
  const deleteScriptMutation = useMutation({
    mutationFn: async (scriptId: string) => {
      return apiRequest(`/api/scripts/${scriptId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      toast({
        title: "Script deleted",
        description: "The script has been removed from your library"
      });
      setSelectedScript(null);
    }
  });

  // Execute script mutation
  const executeScriptMutation = useMutation({
    mutationFn: async (scriptId: string) => {
      return apiRequest(`/api/scripts/${scriptId}/execute`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      toast({
        title: "Script executed",
        description: "The script has been launched successfully"
      });
    }
  });

  const filteredScripts = scripts.filter((script: any) => {
    const matchesCategory = selectedCategory === "all" || script.category === selectedCategory;
    const matchesSearch = script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          script.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-gaming font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Script Library
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse, manage, and execute your AutoHotkey scripts
              </p>
            </div>
            {isAuthenticated ? (
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  data-testid="button-upload-script"
                >
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload Script
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary/50"
                  data-testid="button-new-script"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Script
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  data-testid="button-login-upload"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in to Upload
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search scripts..."
                className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-scripts"
              />
            </div>
            <Button variant="outline" className="border-border/50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Show benefits for non-authenticated users */}
          {!isAuthenticated && (
            <UserBenefits variant="compact" className="bg-card/80" />
          )}

          {/* Script Type Tabs (Public/My Scripts) */}
          {isAuthenticated && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card/50 border border-border/50">
                <TabsTrigger value="public">Public Scripts</TabsTrigger>
                <TabsTrigger value="my-scripts">My Scripts</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-card/50 border border-border/50">
              <TabsTrigger value="all">All Scripts</TabsTrigger>
              {SCRIPT_CATEGORIES.map(cat => {
                const Icon = categoryIcons[cat.id];
                return (
                  <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Scripts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </CardFooter>
              </Card>
            ))
          ) : filteredScripts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Code className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">No scripts found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? `No scripts match "${searchQuery}"` : "Start by uploading or creating a new script"}
              </p>
            </div>
          ) : (
            filteredScripts.map((script: any) => {
              const category = SCRIPT_CATEGORIES.find(c => c.id === script.category);
              const Icon = categoryIcons[script.category] || Settings;
              
              // Format last executed time
              const formatLastExecuted = (date: string | null) => {
                if (!date) return 'Never';
                const executed = new Date(date);
                const now = new Date();
                const diffMs = now.getTime() - executed.getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                
                if (diffHours < 1) return 'Just now';
                if (diffHours < 24) return `${diffHours} hours ago`;
                if (diffDays === 1) return 'Yesterday';
                if (diffDays < 30) return `${diffDays} days ago`;
                return executed.toLocaleDateString();
              };
              
              return (
                <Card 
                  key={script.id} 
                  className="border-border/50 bg-card/80 backdrop-blur-sm hover-elevate group cursor-pointer"
                  onClick={() => setSelectedScript(script)}
                  data-testid={`card-script-${script.id}`}
                >
                  <CardHeader className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${category?.color || 'from-gray-500 to-gray-600'} opacity-80`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {script.name}
                            {script.isFavorite && (
                              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            )}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">by {script.author}</p>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteMutation.mutate(script.id);
                        }}
                        disabled={toggleFavoriteMutation.isPending}
                      >
                        {script.isFavorite ? (
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        ) : (
                          <Heart className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {script.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span>{script.rating || 4.5}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        <span>{script.executionCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatLastExecuted(script.lastExecutedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        executeScriptMutation.mutate(script.id);
                      }}
                      disabled={executeScriptMutation.isPending}
                      data-testid={`button-run-${script.id}`}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {executeScriptMutation.isPending ? 'Running...' : 'Run'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-border/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScript(script);
                      }}
                    >
                      <Code className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        {/* Script Viewer Dialog */}
        <Dialog open={!!selectedScript} onOpenChange={() => setSelectedScript(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                {selectedScript?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedScript?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{selectedScript?.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  Author: {selectedScript?.author}
                </span>
                <span className="text-sm text-muted-foreground">
                  Runs: {selectedScript?.executionCount}
                </span>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border border-border/50 bg-black/50 p-4">
                <pre className="text-green-400 font-mono text-sm">
                  <code>{selectedScript?.code}</code>
                </pre>
              </ScrollArea>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <Play className="w-4 h-4 mr-2" />
                  Execute Script
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Script</DialogTitle>
              <DialogDescription>
                Upload your AutoHotkey script to the library
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop your .ahk file here or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  Choose File
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}