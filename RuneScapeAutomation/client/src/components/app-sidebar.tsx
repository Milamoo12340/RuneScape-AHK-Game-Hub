import {
  Home,
  Library,
  BrainCircuit,
  Newspaper,
  Activity,
  Gamepad2,
  Settings,
  Heart,
  Info,
  ChevronDown,
  Sparkles,
  LogIn,
  LogOut,
  UserPlus,
  User,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import backgroundTexture from "@assets/generated_images/Dark_gaming_background_texture_13551bb2.png";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null,
    glow: "group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]",
  },
  {
    title: "Script Library",
    url: "/scripts",
    icon: Library,
    badge: "128",
    glow: "group-hover:text-secondary group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
  },
  {
    title: "AI Generator",
    url: "/ai-generator",
    icon: BrainCircuit,
    badge: "AI",
    glow: "group-hover:text-accent group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]",
  },
  {
    title: "News & Updates",
    url: "/news",
    icon: Newspaper,
    badge: "3 new",
    glow: "group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]",
  },
  {
    title: "System Monitor",
    url: "/monitor",
    icon: Activity,
    badge: null,
    glow: "group-hover:text-green-500 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]",
  },
  {
    title: "Game Launcher",
    url: "/launcher",
    icon: Gamepad2,
    badge: "Running",
    glow: "group-hover:text-green-500 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]",
  },
];

const bottomItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <Sidebar className="border-r border-border/40">
      {/* Background texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <SidebarHeader className="relative z-10 p-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-md opacity-70 animate-pulse-glow" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-gaming font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OSRS HUB
            </h1>
            <span className="text-xs text-muted-foreground">Gaming Command Center</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="relative z-10">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 px-4">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`
                        group relative transition-all duration-300
                        ${isActive ? 'bg-sidebar-accent/50' : ''}
                        hover:bg-sidebar-accent/30
                      `}
                    >
                      <Link href={item.url}>
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                        )}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <item.icon className={`
                              w-5 h-5 transition-all duration-300
                              ${isActive ? 'text-primary' : 'text-muted-foreground'}
                              ${item.glow}
                            `} />
                            <span className={`
                              font-medium transition-colors duration-300
                              ${isActive ? 'text-foreground' : 'text-foreground/80'}
                            `}>
                              {item.title}
                            </span>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "AI" ? "default" : 
                                item.badge === "Running" ? "outline" : 
                                "secondary"}
                              className={`
                                text-xs h-5
                                ${item.badge === "Running" ? 'border-green-500/50 text-green-500' : ''}
                                ${item.badge === "AI" ? 'bg-gradient-to-r from-primary to-secondary' : ''}
                              `}
                            >
                              {item.badge === "Running" && (
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
                              )}
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 px-4">
            Quick Stats
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4 pb-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Scripts Loaded</span>
                <span className="font-mono text-primary">128</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Time</span>
                <span className="font-mono text-green-500">2h 34m</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">XP Gained</span>
                <span className="font-mono text-accent">+45.2K</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative z-10 border-t border-border/40">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="hover:bg-sidebar-accent/30">
                <Link href={item.url}>
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-3 mt-2 border-t border-border/40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : isAuthenticated && user ? (
          <div className="p-3 mt-2 border-t border-border/40 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border/50">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border/50 hover:bg-destructive/10 hover:text-destructive"
              onClick={async () => {
                await logout();
                setLocation("/login");
              }}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="p-3 mt-2 border-t border-border/40 space-y-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                <Sparkles className="w-3 h-3 inline mr-1 text-primary animate-pulse-glow" />
                Sign in for more features
              </p>
            </div>
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                data-testid="button-sidebar-login"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-border/50"
                data-testid="button-sidebar-register"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}