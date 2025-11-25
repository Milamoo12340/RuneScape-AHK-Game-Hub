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
  Loader2,
} from "lucide-react";
import combatImage from "@assets/generated_images/OSRS_combat_news_thumbnail_8257b14b.png";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Fetch news from backend - REAL DATA
  const { data: newsData = [], isLoading, refetch, error } = useQuery({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredNews = selectedCategory === "all" 
    ? newsData 
    : newsData.filter((article: any) => article.category === selectedCategory);

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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-gaming font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OSRS News & Updates
            </h1>
            <p className="text-muted-foreground mt-1">
              Latest announcements, events, and community updates
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6">
              <p className="text-red-200">Failed to load news. Please try again later.</p>
            </CardContent>
          </Card>
        )}

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
          <TabsList className="bg-card/50 border border-border/50 w-full justify-start">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="update">Updates</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="patch">Patches</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-6">
            {isLoading ? (
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="pt-6">
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <Card className="border-border/50 bg-card/80">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No news articles in this category</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Main article */}
                <div className="lg:col-span-2 space-y-4">
                  {filteredNews.slice(0, 3).map((article: any) => {
                    const Icon = categoryIcons[article.category] || Gamepad2;
                    return (
                      <Card 
                        key={article.id}
                        className="border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`${categoryColors[article.category]} text-white border-0`}>
                                  <Icon className="w-3 h-3 mr-1" />
                                  {article.category}
                                </Badge>
                                {article.isHot && (
                                  <Badge variant="destructive">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Hot
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl line-clamp-2">
                                {article.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {article.summary}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {article.imageUrl && (
                            <img 
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeAgo(article.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {article.comments} comments
                            </span>
                            <span className="flex items-center gap-1">
                              <Badge variant="outline">{article.source}</Badge>
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Sidebar - Top articles */}
                <div className="space-y-4">
                  <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Trending
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-3 pr-4">
                          {newsData.slice(0, 5).map((article: any) => (
                            <button
                              key={article.id}
                              onClick={() => setSelectedArticle(article)}
                              className="w-full text-left p-2 rounded-lg hover:bg-primary/10 transition-colors text-sm"
                            >
                              <p className="font-medium line-clamp-2">{article.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTimeAgo(article.publishedAt)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Article Detail Modal */}
        {selectedArticle && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{selectedArticle.source}</Badge>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(selectedArticle.publishedAt)}</span>
                  </div>
                  <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedArticle.imageUrl && (
                <img 
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <p className="text-base leading-relaxed">{selectedArticle.content}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <span className="flex items-center gap-1 text-sm">
                  <MessageSquare className="w-4 h-4" />
                  {selectedArticle.comments} comments
                </span>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Full Article
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
