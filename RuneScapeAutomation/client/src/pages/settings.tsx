import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Zap,
  Database,
  Key,
  Globe,
  Volume2,
  Monitor,
  Save,
  RotateCcw,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-gaming font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your gaming hub preferences and optimization settings
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic application preferences and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-launch">Auto-launch on startup</Label>
                      <p className="text-xs text-muted-foreground">Start the hub when Windows boots</p>
                    </div>
                    <Switch id="auto-launch" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="minimize-tray">Minimize to system tray</Label>
                      <p className="text-xs text-muted-foreground">Keep running in background when closed</p>
                    </div>
                    <Switch id="minimize-tray" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-update">Auto-update scripts</Label>
                      <p className="text-xs text-muted-foreground">Check for script updates automatically</p>
                    </div>
                    <Switch id="auto-update" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Default script category</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Scripts</SelectItem>
                        <SelectItem value="combat">Combat</SelectItem>
                        <SelectItem value="fishing">Fishing</SelectItem>
                        <SelectItem value="mining">Mining</SelectItem>
                        <SelectItem value="magic">Magic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your gaming hub
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="theme-toggle">Theme</Label>
                      <p className="text-xs text-muted-foreground">Toggle between light and dark mode</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleTheme}
                      className="w-24"
                      data-testid="button-theme-toggle"
                    >
                      {theme === "dark" ? (
                        <>
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </>
                      ) : (
                        <>
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>UI Scale</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">80%</span>
                      <Slider defaultValue={[100]} max={120} min={80} step={10} className="flex-1" />
                      <span className="text-xs text-muted-foreground">120%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="animations">Animations</Label>
                      <p className="text-xs text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="glass-effects">Glassmorphism effects</Label>
                      <p className="text-xs text-muted-foreground">Enable blur and transparency effects</p>
                    </div>
                    <Switch id="glass-effects" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Accent color</Label>
                    <div className="flex gap-2">
                      {["primary", "secondary", "accent"].map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors bg-${color}`}
                          style={{ backgroundColor: `hsl(var(--${color}))` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Performance
                </CardTitle>
                <CardDescription>
                  Optimize system resources and script execution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="hardware-accel">Hardware acceleration</Label>
                      <p className="text-xs text-muted-foreground">Use GPU for rendering</p>
                    </div>
                    <Switch id="hardware-accel" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Script execution priority</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="realtime">Realtime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max concurrent scripts</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">1</span>
                      <Slider defaultValue={[3]} max={10} min={1} className="flex-1" />
                      <span className="text-xs text-muted-foreground">10</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="cpu-limit">CPU usage limit</Label>
                      <p className="text-xs text-muted-foreground">Prevent excessive CPU usage</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="cpu-limit" defaultChecked />
                      <span className="text-sm font-mono">80%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="ram-optimize">RAM optimization</Label>
                      <p className="text-xs text-muted-foreground">Auto-clear unused memory</p>
                    </div>
                    <Switch id="ram-optimize" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure alerts and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="news-alerts">OSRS news alerts</Label>
                      <p className="text-xs text-muted-foreground">Get notified about updates and events</p>
                    </div>
                    <Switch id="news-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="script-complete">Script completion</Label>
                      <p className="text-xs text-muted-foreground">Alert when scripts finish executing</p>
                    </div>
                    <Switch id="script-complete" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="system-alerts">System warnings</Label>
                      <p className="text-xs text-muted-foreground">High CPU/RAM usage alerts</p>
                    </div>
                    <Switch id="system-alerts" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Notification sound</Label>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="default">
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="ding">Ding</SelectItem>
                          <SelectItem value="chime">Chime</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="outline">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>
                  Protect your scripts and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="script-sandbox">Script sandboxing</Label>
                      <p className="text-xs text-muted-foreground">Run scripts in isolated environment</p>
                    </div>
                    <Switch id="script-sandbox" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="encrypt-storage">Encrypt local storage</Label>
                      <p className="text-xs text-muted-foreground">Protect saved scripts and settings</p>
                    </div>
                    <Switch id="encrypt-storage" />
                  </div>

                  <div className="space-y-2">
                    <Label>Auto-lock after inactivity</Label>
                    <Select defaultValue="never">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <Button variant="outline" className="w-full">
                      <Key className="w-4 h-4 mr-2" />
                      Manage API Keys
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1" data-testid="button-save-settings">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}