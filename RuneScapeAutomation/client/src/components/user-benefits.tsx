import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Save,
  Cloud,
  Heart,
  ChartBar,
  Lock,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "wouter";

interface UserBenefitsProps {
  variant?: "compact" | "detailed";
  className?: string;
}

export function UserBenefits({ variant = "compact", className = "" }: UserBenefitsProps) {
  const benefits = [
    { icon: Save, text: "Save your scripts permanently", color: "text-primary" },
    { icon: Cloud, text: "Sync across all devices", color: "text-secondary" },
    { icon: Heart, text: "Build your favorites collection", color: "text-red-500" },
    { icon: ChartBar, text: "Track execution stats", color: "text-accent" },
    { icon: Lock, text: "Create private scripts", color: "text-green-500" },
    { icon: Trophy, text: "Join the leaderboard", color: "text-purple-500" },
  ];

  if (variant === "compact") {
    return (
      <Card className={`border-border/50 bg-card/50 backdrop-blur ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary animate-pulse-glow" />
              <div>
                <p className="text-sm font-medium">Sign in for more features</p>
                <p className="text-xs text-muted-foreground">
                  Save scripts, track stats, sync across devices
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/login">
                <Button size="sm" variant="default" data-testid="button-benefits-login">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="outline" data-testid="button-benefits-register">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-md opacity-70" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Unlock Full Potential</h3>
            <p className="text-sm text-muted-foreground">
              Create a free account to access all features
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
              <span className="text-sm text-foreground/80">{benefit.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/register" className="flex-1">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" 
              size="sm"
              data-testid="button-benefits-signup"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sign Up Free
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-border/50" 
              size="sm"
              data-testid="button-benefits-signin"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Badge variant="secondary" className="text-xs">
            No credit card required
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}