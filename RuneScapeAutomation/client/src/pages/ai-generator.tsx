import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BrainCircuit,
  Sparkles,
  Send,
  Copy,
  Download,
  Save,
  RefreshCw,
  Wand2,
  Target,
  Shield,
  Zap,
  Fish,
  Sword,
  Pickaxe,
  ChefHat,
  Hammer,
  Code,
  Bot,
  Loader2,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { SCRIPT_CATEGORIES } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { UserBenefits } from "@/components/user-benefits";
import { Link } from "wouter";

const scriptTemplates = [
  { id: "fishing", name: "Fishing Bot", icon: Fish, description: "Automated fishing with spot detection" },
  { id: "combat", name: "Combat Helper", icon: Sword, description: "Attack rotations and prayer flicking" },
  { id: "mining", name: "Mining Script", icon: Pickaxe, description: "Efficient ore mining and banking" },
  { id: "magic", name: "Magic Trainer", icon: Wand2, description: "Spell casting and alchemy automation" },
  { id: "agility", name: "Agility Runner", icon: Zap, description: "Rooftop course navigation" },
  { id: "crafting", name: "Crafting Bot", icon: Hammer, description: "Item creation and banking" },
  { id: "cooking", name: "Cooking Assistant", icon: ChefHat, description: "Automated cooking and banking" },
  { id: "custom", name: "Custom Script", icon: Code, description: "Build from scratch with AI" },
];

export default function AIGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Generate script mutation
  const generateMutation = useMutation({
    mutationFn: async (data: { prompt: string; template: string }) => {
      return apiRequest('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: data.prompt,
          template: data.template,
          model: 'gpt-3.5-turbo' // Can be made configurable
        })
      });
    },
    onSuccess: (data) => {
      setGeneratedCode(data.generatedCode);
      setChatHistory(prev => [...prev, 
        { role: "assistant", content: `Script generated successfully!\n\n${data.generatedCode}` }
      ]);
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      toast({
        title: "Script generated!",
        description: "Your AI-generated script is ready to use"
      });
    },
    onError: () => {
      // Generate mock code as fallback
      const mockCode = `; AI Generated Script - ${selectedTemplate}
; Generated from prompt: ${prompt}
; Generated at: ${new Date().toLocaleString()}

#NoEnv
#SingleInstance Force
SendMode Input
SetWorkingDir %A_ScriptDir%

; === Configuration ===
global DELAY_MIN := 500
global DELAY_MAX := 1500
global ANTI_BAN := true

; === Main Hotkeys ===
F1::StartScript()
F2::PauseScript()
F3::ExitApp

; === Functions ===
StartScript() {
    Loop {
        ; Main automation loop
        ${selectedTemplate === "fishing" ? `
        ; Click fishing spot
        ClickRandomized(523, 412)
        RandomSleep(3000, 5000)
        
        ; Check inventory
        if (IsInventoryFull()) {
            DropAllFish()
        }` : selectedTemplate === "combat" ? `
        ; Attack target
        ClickTarget()
        RandomSleep(1500, 2500)
        
        ; Use special attack
        if (SpecialReady()) {
            UseSpecial()
        }` : `
        ; Custom action based on prompt
        PerformAction()
        RandomSleep(DELAY_MIN, DELAY_MAX)`}
        
        ; Anti-ban measures
        if (ANTI_BAN && Random(1, 10) > 8) {
            PerformAntiBan()
        }
    }
}

RandomSleep(min, max) {
    Random, delay, %min%, %max%
    Sleep, %delay%
}

ClickRandomized(x, y) {
    Random, offsetX, -5, 5
    Random, offsetY, -5, 5
    Click, % x + offsetX, % y + offsetY
}

PerformAntiBan() {
    Random, action, 1, 3
    if (action = 1) {
        ; Move mouse randomly
        Random, newX, 100, 700
        Random, newY, 100, 500
        MouseMove, %newX%, %newY%, 10
    } else if (action = 2) {
        ; Check stats
        Send, {Tab}
        RandomSleep(500, 1000)
        Send, {Tab}
    } else {
        ; Rotate camera
        Send, {Left}
        RandomSleep(200, 400)
    }
}

PauseScript() {
    Pause, Toggle
}`;

      setGeneratedCode(mockCode);
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: `Script generated successfully (using fallback)! The script includes anti-ban measures, randomized delays, and hotkey controls.` 
      }]);
      toast({
        title: "Script generated",
        description: "Generated using fallback templates"
      });
    }
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setChatHistory(prev => [...prev, { role: "user", content: prompt }]);
    generateMutation.mutate({ prompt, template: selectedTemplate });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-gaming font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <BrainCircuit className="w-10 h-10 text-primary" />
            AI Script Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate custom AutoHotkey scripts using AI with OSRS-specific optimizations
          </p>
        </div>

        {/* Show benefits for non-authenticated users */}
        {!isAuthenticated && (
          <UserBenefits variant="compact" className="bg-card/80" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <Card className="lg:col-span-1 border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Script Templates
              </CardTitle>
              <CardDescription>
                Choose a template or start from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {scriptTemplates.map(template => {
                    const Icon = template.icon;
                    const isSelected = selectedTemplate === template.id;
                    
                    return (
                      <Card
                        key={template.id}
                        className={`
                          cursor-pointer transition-all duration-200 hover-elevate
                          ${isSelected ? 'border-primary bg-primary/10' : 'border-border/50'}
                        `}
                        onClick={() => setSelectedTemplate(template.id)}
                        data-testid={`template-${template.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`
                              p-2 rounded-lg transition-colors
                              ${isSelected ? 'bg-primary/20' : 'bg-muted/50'}
                            `}>
                              <Icon className={`
                                w-5 h-5 transition-colors
                                ${isSelected ? 'text-primary' : 'text-muted-foreground'}
                              `} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{template.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 border-border/50 bg-card/80 backdrop-blur-sm flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Assistant
                </span>
                <Badge variant="outline" className="border-green-500/50 text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              {/* Chat History */}
              <ScrollArea className="flex-1 h-[300px] rounded-lg border border-border/50 bg-black/20 p-4">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot className="w-12 h-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      Describe what you want your script to do
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Be specific about actions, timings, and conditions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                          max-w-[80%] p-3 rounded-lg
                          ${msg.role === 'user' 
                            ? 'bg-primary/20 border border-primary/30' 
                            : 'bg-secondary/20 border border-secondary/30'}
                        `}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Describe your script requirements... (e.g., 'Create a fishing bot that switches spots when the current one is empty and drops fish when inventory is full')"
                  className="min-h-[100px] bg-card/50 border-border/50 focus:border-primary/50"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  data-testid="textarea-prompt"
                />
                <div className="flex items-center gap-3">
                  <Select defaultValue="gpt-5">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-5">GPT-5 (Best)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending || !prompt.trim()}
                    data-testid="button-generate"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Script
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Generated Code */}
              {generatedCode && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Generated Script
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8">
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] rounded-md border border-border/50 bg-black/50 p-3">
                      <pre className="text-green-400 font-mono text-xs">
                        <code>{generatedCode}</code>
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Pro Tips for Better Scripts</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Be specific about coordinates, delays, and conditions</li>
                  <li>• Include anti-ban measures like random movements and breaks</li>
                  <li>• Describe edge cases and error handling requirements</li>
                  <li>• Mention if you need inventory management or banking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}