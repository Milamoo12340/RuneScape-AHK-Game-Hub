import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AppSidebar } from "@/components/app-sidebar";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Dashboard from "@/pages/dashboard";
import ScriptLibrary from "@/pages/script-library";
import AIGenerator from "@/pages/ai-generator";
import News from "@/pages/news";
import SystemMonitor from "@/pages/system-monitor";
import GameLauncher from "@/pages/game-launcher";
import Settings from "@/pages/settings";
import About from "@/pages/about";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";


function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      size="icon" 
      variant="outline" 
      onClick={toggleTheme}
      className="border-border/50"
      data-testid="button-theme-toggle-header"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const isAuthPage = location === "/login" || location === "/register";
  
  // Custom sidebar width for gaming hub
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  // If on auth pages, render without sidebar
  if (isAuthPage) {
    return (
      <Switch>
        <Route path="/login">
          {isAuthenticated ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/register">
          {isAuthenticated ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="h-6 w-[1px] bg-border/50" />
              <span className="text-sm text-muted-foreground font-medium">
                Your Ultimate RuneScape Command Center
              </span>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/login">
                {isAuthenticated ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route path="/register">
                {isAuthenticated ? <Redirect to="/" /> : <Register />}
              </Route>
              <Route path="/scripts" component={ScriptLibrary} />
              <Route path="/ai-generator" component={AIGenerator} />
              <Route path="/news" component={News} />
              <Route path="/monitor" component={SystemMonitor} />
              <Route path="/launcher" component={GameLauncher} />
              <Route path="/settings" component={Settings} />
              <Route path="/about" component={About} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
