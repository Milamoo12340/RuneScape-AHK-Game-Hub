import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Newspaper,
  Bell,
  TrendingUp,
  Calendar,
  ExternalLink,
  Clock,
  AlertCircle,
  Sparkles,
  Gamepad2,
  Trophy,
  Users,
  MessageSquare,
  RefreshCw,
  Filter,
} from "lucide-react";
import combatImage from "@assets/generated_images/OSRS_combat_news_thumbnail_8257b14b.png";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Mock news data
const mockNews = [
  {
    id: "1",
    title: "Desert Treasure II - The Fallen Empire Released!",
    summary: "The highly anticipated grandmaster quest is now live, featuring four new bosses and best-in-slot magic gear.",
    content: "Players can now embark on the epic Desert Treasure II quest...",
    category: "update",
    source: "Official",
    imageUrl: combatImage,
    publishedAt: "2 hours ago",
    isHot: true,
    comments: 342,
  },
  {
    id: "2",
    title: "Christmas Event 2024 Now Live",
    summary: "Help save Christmas in Gielinor and earn exclusive holiday rewards!",
    content: "The annual Christmas event has arrived...",
    category: "event",
    source: "Wiki",
    publishedAt: "5 hours ago",
    isHot: true,
    comments: 128,
  },
  {
    id: "3",
    title: "New Raid Leaked: The Forsaken Citadel",
    summary: "Data miners discover references to a potential new raid coming Q1 2025.",
    content: "Recent game files suggest a new raid is in development...",
    category: "leak",
    source: "Community",
    publishedAt: "1 day ago",
    isHot: false,
    comments: 567,
  },
  {
    id: "4",
    title: "PvP Arena Changes & Rewards",
    summary: "Major updates to PvP Arena mechanics and new cosmetic rewards added.",
    content: "The PvP Arena has received significant updates...",
    category: "patch",
    source: "Official",
    publishedAt: "2 days ago",
    isHot: false,
    comments: 89,
  },
  {
    id: "5",
    title: "Economy Report: Bond Prices Surge",
    summary: "Analysis of recent bond price increases and their impact on the game economy.",
    content: "Bond prices have reached an all-time high...",
    category: "analysis",
    source: "Wiki",
    publishedAt: "3 days ago",
    isHot: false,
    comments: 234,
  },
];

const categoryColors: Record<string, string> = {
  update: "bg-gradient-to-r from-blue-500 to-cyan-500",
  event: "bg-gradient-to-r from-green-500 to-emerald-500",
  leak: "bg-gradient-to-r from-purple-500 to-pink-500",
  patch: "bg-gradient-to-r from-orange-500 to-red-500",
  analysis: "bg-gradient-to-r from-gray-500 to-slate-600",
};

const categoryIcons: Record<string, any> = {
  update: TrendingUp,
  event: Calendar,
  leak: AlertCircle,
  patch: Gamepad2,
  analysis: Trophy,
};

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Fetch news from backend
  const { data: newsData = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/news']
  });

  // Format time ago helper
  const formatTimeAgo = (date: string) => {
    const published = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return published.toLocaleDateString();
  };

  const filteredNews = selectedCategory === "all" 
    ? newsData 
    : newsData.filter((article: any) => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-gaming font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              News & Updates
            </h1>
            <p className="text-muted-foreground mt-1">
              Latest OSRS news, updates, events, and community discoveries
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="border-border/50"
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="button-refresh-news"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary"
              data-testid="button-notifications"
            >
              <Bell className="w-4 h-4 mr-2" />
              Enable Alerts
            </Button>
          </div>
        </div>

        {/* Live Ticker */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 animate-[slide_20s_linear_infinite]">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    🔥 Desert Treasure II is now live! • 🎄 Christmas Event active until Jan 5th • 
                    ⚔️ PvP Arena tournament this weekend • 📈 Bond prices at all-time high • 
                    🏆 New speedrun record for Theatre of Blood
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="update">Updates</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="leak">Leaks</TabsTrigger>
            <TabsTrigger value="patch">Patches</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main News Feed */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <div className="flex gap-4">
                    <Skeleton className="w-[200px] h-[120px] rounded-lg" />
                    <div className="flex-1">
                      <CardHeader>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </CardHeader>
                    </div>
                  </div>
                </Card>
              ))
            ) : filteredNews.length === 0 ? (
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Newspaper className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold">No news articles found</p>
                  <p className="text-sm text-muted-foreground">
                    Check back later for updates
                  </p>
                </CardContent>
              </Card>
            ) : (
            filteredNews.map((article: any, index: number) => {
              const Icon = categoryIcons[article.category];
              const isFeature = index === 0 && selectedCategory === "all";
              
              return (
                <Card 
                  key={article.id}
                  className={`
                    border-border/50 bg-card/80 backdrop-blur-sm hover-elevate cursor-pointer
                    ${isFeature ? 'lg:col-span-2' : ''}
                  `}
                  onClick={() => setSelectedArticle(article)}
                  data-testid={`article-${article.id}`}
                >
                  <div className={isFeature ? '' : 'flex gap-4'}>
                    {article.imageUrl && (
                      <div className={`
                        ${isFeature ? 'h-[250px]' : 'w-[200px] h-[120px]'}
                        overflow-hidden rounded-t-lg ${!isFeature && 'rounded-l-lg rounded-tr-none'}
                      `}>
                        <img 
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="secondary"
                                className={`${categoryColors[article.category]} text-white border-0`}
                              >
                                <Icon className="w-3 h-3 mr-1" />
                                {article.category}
                              </Badge>
                              {article.isHot && (
                                <Badge variant="destructive" className="animate-pulse">
                                  HOT
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {article.source}
                              </span>
                            </div>
                            <CardTitle className={`${isFeature ? 'text-2xl' : 'text-lg'} line-clamp-2`}>
                              {article.title}
                            </CardTitle>
                          </div>
                        </div>
                        <CardDescription className={`${isFeature ? '' : 'line-clamp-2'} mt-2`}>
                          {article.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(article.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {article.comments || Math.floor(Math.random() * 500)}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7">
                            Read More
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Trending Topics */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tag: "#DesertTreasure2", count: "12.4K" },
                    { tag: "#ChristmasEvent", count: "8.2K" },
                    { tag: "#PvPArena", count: "5.7K" },
                    { tag: "#NewRaid", count: "4.1K" },
                    { tag: "#BondPrices", count: "3.8K" },
                  ].map((topic, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                        {topic.tag}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Poll */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Community Poll
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    What's your favorite update this year?
                  </p>
                  <div className="space-y-2">
                    {[
                      { option: "Desert Treasure II", percent: 45 },
                      { option: "PvP Arena", percent: 28 },
                      { option: "Forestry", percent: 18 },
                      { option: "Other", percent: 9 },
                    ].map((poll, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{poll.option}</span>
                          <span className="text-muted-foreground">{poll.percent}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: `${poll.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="w-full" variant="outline">
                    Vote Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "Dec 25", event: "Christmas Day Bonus XP" },
                    { date: "Dec 28", event: "PvP Tournament Finals" },
                    { date: "Jan 1", event: "New Year Fireworks" },
                    { date: "Jan 5", event: "Winter Event Ends" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Badge variant="outline" className="font-mono">
                        {item.date}
                      </Badge>
                      <span className="text-muted-foreground">{item.event}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}