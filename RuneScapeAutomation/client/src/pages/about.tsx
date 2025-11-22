import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  Heart,
  Star,
  Github,
  Globe,
  Mail,
  Trophy,
  Users,
  Code,
  Sparkles,
  Gamepad2,
  ExternalLink,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-gaming font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            OSRS Gaming Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The ultimate Old School RuneScape command center for serious gamers
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-4 py-1">
              <Code className="w-3 h-3 mr-1" />
              Version 1.0.0
            </Badge>
            <Badge className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500">
              <Trophy className="w-3 h-3 mr-1" />
              Premium Edition
            </Badge>
          </div>
        </div>

        {/* Features */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: Code,
                  title: "AI Script Generation",
                  description: "Create custom AutoHotkey scripts with GPT-5 powered AI",
                },
                {
                  icon: Trophy,
                  title: "Script Library",
                  description: "Access 100+ pre-built scripts for every OSRS activity",
                },
                {
                  icon: Globe,
                  title: "Live Updates",
                  description: "Real-time news and updates from the OSRS wiki",
                },
                {
                  icon: Sparkles,
                  title: "System Optimization",
                  description: "Monitor and optimize CPU, GPU, and FPS performance",
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 h-fit">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold font-mono">10K+</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-gradient-to-br from-secondary/10 to-transparent backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Code className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <div className="text-3xl font-bold font-mono">128</div>
              <p className="text-sm text-muted-foreground">Scripts Available</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-gradient-to-br from-accent/10 to-transparent backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-3xl font-bold font-mono">4.9</div>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Credits */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Credits & Acknowledgments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Built with passion for the OSRS community. Special thanks to all contributors
              and script developers who make this hub possible.
            </p>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "AutoHotkey", "OpenAI"].map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Resources & Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repository
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  OSRS Wiki
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Mail className="w-4 h-4 mr-2" />
                  Support
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Heart className="w-4 h-4 mr-2" />
                  Donate
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center space-y-2 py-8">
          <p className="text-muted-foreground">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> for OSRS players
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 OSRS Gaming Hub. Not affiliated with Jagex or Old School RuneScape.
          </p>
        </div>
      </div>
    </div>
  );
}