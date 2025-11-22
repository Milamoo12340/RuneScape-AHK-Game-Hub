import { 
  users,
  scripts,
  newsArticles,
  systemStats,
  type User, 
  type InsertUser,
  type Script,
  type InsertScript,
  type NewsArticle,
  type InsertNewsArticle,
  type SystemStats,
  type InsertSystemStats 
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, like, or, and, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { password: string }): Promise<User>;
  verifyPassword(user: User, password: string): Promise<boolean>;
  
  // Script methods
  getAllScripts(): Promise<Script[]>;
  getScriptsByCategory(category: string): Promise<Script[]>;
  getScript(id: string): Promise<Script | undefined>;
  createScript(script: InsertScript): Promise<Script>;
  updateScript(id: string, script: Partial<InsertScript>): Promise<Script | undefined>;
  deleteScript(id: string): Promise<boolean>;
  incrementScriptExecution(id: string): Promise<void>;
  toggleScriptFavorite(id: string): Promise<void>;
  searchScripts(query: string): Promise<Script[]>;
  
  // News methods
  getAllNews(): Promise<NewsArticle[]>;
  getNewsByCategory(category: string): Promise<NewsArticle[]>;
  getNewsArticle(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: string, article: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined>;
  deleteNewsArticle(id: string): Promise<boolean>;
  
  // System Stats methods
  getCurrentStats(): Promise<SystemStats | undefined>;
  updateStats(stats: InsertSystemStats): Promise<SystemStats>;
  getStatsHistory(): Promise<SystemStats[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scripts: Map<string, Script>;
  private newsArticles: Map<string, NewsArticle>;
  private systemStats: SystemStats[];
  private currentStats: SystemStats | undefined;

  constructor() {
    this.users = new Map();
    this.scripts = new Map();
    this.newsArticles = new Map();
    this.systemStats = [];
    this.currentStats = undefined;
    
    // Initialize with sample data
    this.initializeSampleData();
    console.log('MemStorage initialized with', this.scripts.size, 'scripts');
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser & { password: string }): Promise<User> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(insertUser.password, 10);
    const { password, ...userWithoutPassword } = insertUser;
    const user: User = { 
      id, 
      ...userWithoutPassword, 
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  // Script methods
  async getAllScripts(): Promise<Script[]> {
    const scripts = Array.from(this.scripts.values()).sort((a, b) => 
      (b.executionCount || 0) - (a.executionCount || 0)
    );
    console.log('getAllScripts returning', scripts.length, 'scripts');
    return scripts;
  }

  async getScriptsByCategory(category: string): Promise<Script[]> {
    return Array.from(this.scripts.values()).filter(
      script => script.category === category
    );
  }

  async getScript(id: string): Promise<Script | undefined> {
    return this.scripts.get(id);
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    const id = randomUUID();
    const script: Script = { 
      ...insertScript, 
      id,
      executionCount: 0,
      isFavorite: 0,
      createdAt: new Date(),
    };
    this.scripts.set(id, script);
    return script;
  }

  async updateScript(id: string, updates: Partial<InsertScript>): Promise<Script | undefined> {
    const script = this.scripts.get(id);
    if (!script) return undefined;
    
    const updated = { 
      ...script, 
      ...updates,
    };
    this.scripts.set(id, updated);
    return updated;
  }

  async deleteScript(id: string): Promise<boolean> {
    return this.scripts.delete(id);
  }

  async incrementScriptExecution(id: string): Promise<void> {
    const script = this.scripts.get(id);
    if (script) {
      script.executionCount = (script.executionCount || 0) + 1;
      script.lastExecutedAt = new Date().toISOString();
      this.scripts.set(id, script);
    }
  }

  async toggleScriptFavorite(id: string): Promise<void> {
    const script = this.scripts.get(id);
    if (script) {
      script.isFavorite = !script.isFavorite;
      this.scripts.set(id, script);
    }
  }

  async searchScripts(query: string): Promise<Script[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.scripts.values()).filter(
      script => 
        script.name.toLowerCase().includes(lowerQuery) ||
        script.description?.toLowerCase().includes(lowerQuery) ||
        script.code?.toLowerCase().includes(lowerQuery)
    );
  }

  // News methods
  async getAllNews(): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values()).filter(
      article => article.category === category
    );
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const id = randomUUID();
    const article: NewsArticle = { 
      ...insertArticle, 
      id,
      publishedAt: new Date()
    };
    this.newsArticles.set(id, article);
    return article;
  }

  async updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const article = this.newsArticles.get(id);
    if (!article) return undefined;
    
    const updated = { ...article, ...updates };
    this.newsArticles.set(id, updated);
    return updated;
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    return this.newsArticles.delete(id);
  }

  // System Stats methods
  async getCurrentStats(): Promise<SystemStats | undefined> {
    return this.currentStats;
  }

  async updateStats(insertStats: InsertSystemStats): Promise<SystemStats> {
    const id = randomUUID();
    const stats: SystemStats = { 
      ...insertStats, 
      id,
      timestamp: new Date()
    };
    
    this.currentStats = stats;
    this.systemStats.push(stats);
    
    // Keep only last 100 entries
    if (this.systemStats.length > 100) {
      this.systemStats.shift();
    }
    
    return stats;
  }

  async getStatsHistory(): Promise<SystemStats[]> {
    return this.systemStats;
  }

  private initializeSampleData() {
    // Sample OSRS Scripts
    const sampleScripts: Script[] = [
      // Combat Scripts
      {
        id: "1",
        name: "1-Tick Prayer Flicker",
        description: "Advanced prayer flicking for maximum efficiency. Perfectly times prayer activation to conserve prayer points while maintaining full protection.",
        category: "combat",
        author: "PrayerMaster",
        executionCount: 3421,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        code: `; 1-Tick Prayer Flicker v2.1
; Conserves prayer points by flicking protection prayers
#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

; Variables
global prayerActive := false

; F1 - Start prayer flicking
F1::
Loop {
    ; Quick prayer toggle
    Send, {F5}
    Sleep, 50
    Send, {F5}
    Sleep, 550
    
    ; Random delay for anti-ban
    if (A_Index mod 10 == 0) {
        Random, delay, 100, 300
        Sleep, %delay%
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        name: "Tribrid Gear Switcher",
        description: "Quick gear switching between melee, range, and magic setups. Essential for high-level PvP and PvM encounters.",
        category: "combat",
        author: "TribridKing",
        executionCount: 2156,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        code: `; Tribrid Gear Switcher v1.8
; Quick switch between combat styles
#NoEnv
SendMode Input

; Melee setup - F1
F1::
Click, 580, 250 ; Helm
Click, 620, 250 ; Body
Click, 660, 250 ; Legs
Click, 580, 290 ; Weapon
Click, 620, 290 ; Shield
return

; Range setup - F2
F2::
Click, 580, 330 ; Coif
Click, 620, 330 ; Body
Click, 660, 330 ; Chaps
Click, 580, 370 ; Bow
Click, 620, 370 ; Arrows
return

; Mage setup - F3
F3::
Click, 580, 410 ; Hood
Click, 620, 410 ; Robe top
Click, 660, 410 ; Robe bottom
Click, 580, 450 ; Staff
return

F4::Pause
F5::ExitApp`,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        name: "Tick Eating Helper",
        description: "Assists with tick eating mechanics for survival in dangerous PvM situations. Times food consumption perfectly.",
        category: "combat",
        author: "TickMaster",
        executionCount: 1823,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        code: `; Tick Eating Helper v1.5
; Perfect timing for tick eating
#NoEnv
SendMode Input

; Variables
global tickCounter := 0

; F1 - Start tick eating
F1::
SetTimer, TickEat, 600
return

TickEat:
tickCounter++
if (tickCounter == 2) {
    ; Eat karambwan
    Click, 580, 290
    Sleep, 50
    ; Eat shark
    Click, 620, 290
    tickCounter := 0
}
return

F2::SetTimer, TickEat, Off
F3::ExitApp`,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Skilling - Fishing Scripts
      {
        id: "4",
        name: "Elite Barbarian Fishing",
        description: "Advanced barbarian fishing with shift-drop, anti-ban delays, and automatic inventory management. Maximizes XP rates.",
        category: "fishing",
        author: "FishingElite",
        executionCount: 4892,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        code: `; Elite Barbarian Fishing v3.5
; Shift-drop with anti-ban features
#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

; Configuration
global dropPattern := "vertical" ; vertical or diagonal
global antibanLevel := 3 ; 1-5 (higher = more anti-ban)

F1::
Loop {
    ; Click fishing spot
    Click, 452, 312
    
    ; Wait for inventory
    Random, fishTime, 45000, 65000
    Sleep, %fishTime%
    
    ; Shift drop fish
    Send, {Shift down}
    Loop, 27 {
        x := 580 + Mod(A_Index-1, 4) * 40
        y := 250 + Floor((A_Index-1) / 4) * 35
        Click, %x%, %y%
        Random, dropDelay, 50, 150
        Sleep, %dropDelay%
    }
    Send, {Shift up}
    
    ; Anti-ban movements
    if (Mod(A_Index, antibanLevel) == 0) {
        Random, moveX, 200, 600
        Random, moveY, 200, 400
        MouseMove, %moveX%, %moveY%, 10
        Random, antibanDelay, 500, 2000
        Sleep, %antibanDelay%
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "5",
        name: "Karambwan 1-Tick Fishing",
        description: "Advanced karambwan fishing using 1-tick manipulation for maximum XP rates. Requires precise timing.",
        category: "fishing",
        author: "TickFisher",
        executionCount: 2134,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        code: `; Karambwan 1-Tick Fishing v2.0
; Maximizes karambwan catch rate
#NoEnv
SendMode Input

F1::
Loop {
    ; Use karambwanji on spot
    Click, 580, 250
    Sleep, 50
    Click, 423, 298
    
    ; 1-tick timing
    Sleep, 550
    
    ; Click away and back
    Click, 500, 350
    Sleep, 50
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Skilling - Woodcutting Scripts
      {
        id: "6",
        name: "Redwood AFK Cutter",
        description: "Semi-AFK redwood cutting with automatic re-clicking when tree depletes. Includes random camera movements.",
        category: "woodcutting",
        author: "WoodcutPro",
        executionCount: 3567,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        code: `; Redwood AFK Cutter v2.3
; Semi-AFK woodcutting with re-click
#NoEnv
SendMode Input

F1::
Loop {
    ; Click tree
    Click, 392, 285
    
    ; Wait for tree depletion
    Random, cutTime, 60000, 90000
    Sleep, %cutTime%
    
    ; Random camera movement
    if (Mod(A_Index, 3) == 0) {
        Send, {Left}
        Random, cameraTime, 500, 1500
        Sleep, %cameraTime%
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "7",
        name: "Teak 2-Tick Woodcutter",
        description: "Advanced 2-tick woodcutting method for teaks. Maximizes XP using tick manipulation.",
        category: "woodcutting",
        author: "TickChop",
        executionCount: 1456,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        code: `; Teak 2-Tick Woodcutter v1.7
; 2-tick manipulation for max XP
#NoEnv
SendMode Input

F1::
Loop {
    ; Start 2-tick cycle
    Click, 412, 302 ; Click tree
    Sleep, 600
    
    ; Use herb on tar
    Click, 580, 250
    Sleep, 50
    Click, 620, 250
    Sleep, 600
    
    ; Drop log
    Send, {Shift down}
    Click, 660, 250
    Send, {Shift up}
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Skilling - Mining Scripts
      {
        id: "8",
        name: "3-Tick Granite Mining",
        description: "Efficient 3-tick granite mining in the quarry. Uses herb tar method for tick manipulation.",
        category: "mining",
        author: "MiningGod",
        executionCount: 2789,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        code: `; 3-Tick Granite Mining v2.8
; Maximum mining XP with tick manipulation
#NoEnv
SendMode Input

F1::
Loop {
    ; Click granite rock
    Click, 445, 318
    Sleep, 600
    
    ; Herb tar tick manipulation
    Click, 580, 250 ; Herb
    Sleep, 50
    Click, 620, 250 ; Tar
    Sleep, 600
    
    ; Drop granite
    Send, {Shift down}
    Click, 660, 250
    Send, {Shift up}
    Sleep, 600
    
    ; Anti-ban check
    if (Mod(A_Index, 20) == 0) {
        Random, pause, 2000, 5000
        Sleep, %pause%
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "9",
        name: "Motherlode Mine Helper",
        description: "Automates Motherlode Mine activities including ore collection, depositing, and sack management.",
        category: "mining",
        author: "MLMaster",
        executionCount: 3234,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        code: `; Motherlode Mine Helper v3.1
; Full MLM automation
#NoEnv
SendMode Input

; States
global state := "mining"
global oreCount := 0

F1::
Loop {
    if (state == "mining") {
        ; Mine ore veins
        Click, 423, 298
        Random, mineTime, 3000, 5000
        Sleep, %mineTime%
        oreCount++
        
        if (oreCount >= 26) {
            state := "depositing"
        }
    }
    else if (state == "depositing") {
        ; Run to hopper
        Click, 512, 245
        Sleep, 8000
        
        ; Deposit ore
        Click, 445, 332
        Sleep, 2000
        
        oreCount := 0
        state := "mining"
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Magic Scripts
      {
        id: "10",
        name: "High Alchemy Pro",
        description: "Efficient high alchemy script with automatic item switching and anti-ban features. Tracks profit/loss.",
        category: "magic",
        author: "AlchMaster",
        executionCount: 5678,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        code: `; High Alchemy Pro v4.2
; Automated high alchemy with profit tracking
#NoEnv
SendMode Input

; Variables
global alchCount := 0
global profit := 0

F1::
Loop {
    ; Cast high alchemy
    Send, {F6} ; High alch hotkey
    Sleep, 100
    
    ; Click item
    Click, 620, 290
    
    ; Alchemy delay
    Sleep, 3000
    
    alchCount++
    profit += 150 ; Estimated profit per alch
    
    ; Anti-ban movement
    if (Mod(alchCount, 50) == 0) {
        Random, moveX, 200, 600
        Random, moveY, 200, 400
        MouseMove, %moveX%, %moveY%, 10
        Random, pause, 1000, 3000
        Sleep, %pause%
    }
    
    ; Show stats every 100 alchs
    if (Mod(alchCount, 100) == 0) {
        ToolTip, Alchs: %alchCount% | Profit: %profit%gp
        SetTimer, RemoveToolTip, 3000
    }
}
return

RemoveToolTip:
ToolTip
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "11",
        name: "Superglass Make Banking",
        description: "Automated Superglass Make spell casting with banking. Maximizes crafting XP through magic.",
        category: "magic",
        author: "GlassMaker",
        executionCount: 2345,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        code: `; Superglass Make Banking v2.5
; Efficient glass making with banking
#NoEnv
SendMode Input

F1::
Loop {
    ; Open bank
    Click, 392, 285
    Sleep, 1000
    
    ; Withdraw materials
    Click, 100, 150 ; Bucket of sand
    Click, Right
    Sleep, 100
    Click, 100, 200 ; Withdraw-X
    Send, 18
    Send, {Enter}
    Sleep, 500
    
    Click, 150, 150 ; Seaweed
    Click, Right
    Sleep, 100
    Click, 150, 200 ; Withdraw-X
    Send, 6
    Send, {Enter}
    Sleep, 500
    
    ; Close bank
    Send, {Escape}
    Sleep, 500
    
    ; Cast Superglass Make
    Send, {F7}
    Sleep, 2500
    
    ; Bank glass
    Click, 392, 285
    Sleep, 1000
    Click, 580, 250 ; Deposit inventory
    Sleep, 500
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "12",
        name: "Teleport Trainer",
        description: "Rapid teleport casting for magic training. Cycles through different teleport spells efficiently.",
        category: "magic",
        author: "TeleMage",
        executionCount: 1876,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        code: `; Teleport Trainer v1.9
; Fast magic XP through teleporting
#NoEnv
SendMode Input

F1::
Loop {
    ; Camelot teleport
    Send, {F5}
    Sleep, 2400
    
    ; Random teleport selection
    Random, tele, 1, 3
    if (tele == 1) {
        Send, {F5} ; Camelot
    }
    else if (tele == 2) {
        Send, {F6} ; Ardougne
    }
    else {
        Send, {F7} ; Watchtower
    }
    
    Sleep, 2400
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Agility Scripts
      {
        id: "13",
        name: "Seers Village Rooftop",
        description: "Complete automation of Seers Village rooftop agility course with mark of grace collection.",
        category: "agility",
        author: "AgilityPro",
        executionCount: 4123,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        code: `; Seers Village Rooftop v3.7
; Full rooftop course automation
#NoEnv
SendMode Input

F1::
Loop {
    ; Climb wall
    Click, 445, 302
    Sleep, 7500
    
    ; Jump gap 1
    Click, 423, 285
    Sleep, 4000
    
    ; Tightrope
    Click, 456, 298
    Sleep, 6500
    
    ; Jump gap 2
    Click, 412, 276
    Sleep, 3500
    
    ; Jump gap 3
    Click, 434, 289
    Sleep, 4000
    
    ; Tightrope 2
    Click, 467, 305
    Sleep, 5000
    
    ; Jump to ground
    Click, 445, 312
    Sleep, 4500
    
    ; Check for marks
    PixelSearch, markX, markY, 350, 250, 550, 400, 0xFF0000, 10
    if !ErrorLevel {
        Click, %markX%, %markY%
        Sleep, 1000
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "14",
        name: "Ardougne Rooftop Runner",
        description: "Efficient Ardougne rooftop course running with automatic mark collection and stamina management.",
        category: "agility",
        author: "RoofRunner",
        executionCount: 3456,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        code: `; Ardougne Rooftop Runner v2.9
; Ardougne course with stamina potions
#NoEnv
SendMode Input

global lapCount := 0

F1::
Loop {
    ; Start course
    Click, 432, 294
    Sleep, 6000
    
    ; Navigate obstacles
    Loop, 8 {
        Click, 445, 305
        Random, obstacleTime, 3000, 5000
        Sleep, %obstacleTime%
    }
    
    lapCount++
    
    ; Drink stamina every 5 laps
    if (Mod(lapCount, 5) == 0) {
        Click, 700, 250
        Sleep, 500
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "15",
        name: "Varrock Rooftop Course",
        description: "Beginner-friendly Varrock rooftop agility course script. Perfect for levels 30-50.",
        category: "agility",
        author: "VarrockRunner",
        executionCount: 2567,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        code: `; Varrock Rooftop Course v2.1
; Simple and reliable course runner
#NoEnv
SendMode Input

F1::
Loop {
    ; Climb wall
    Click, 423, 287
    Sleep, 5000
    
    ; Jump gaps and balance
    Loop, 6 {
        Click, 445, 300
        Random, wait, 3500, 4500
        Sleep, %wait%
    }
    
    ; Final jump
    Click, 456, 315
    Sleep, 4000
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Minigame Scripts
      {
        id: "16",
        name: "Wintertodt Helper Pro",
        description: "Complete Wintertodt automation including fletching, burning, healing, and brazier repair.",
        category: "minigames",
        author: "WinterdtPro",
        executionCount: 3987,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        code: `; Wintertodt Helper Pro v4.5
; Full Wintertodt automation
#NoEnv
SendMode Input

; Variables
global hp := 90
global invFull := false

F1::
Loop {
    ; Check HP
    if (hp < 50) {
        Click, 700, 250 ; Eat food
        Sleep, 600
        hp += 20
    }
    
    ; Chop roots
    if (!invFull) {
        Click, 392, 285
        Random, chopTime, 3000, 5000
        Sleep, %chopTime%
    }
    
    ; Fletch roots
    Click, 580, 250 ; Knife
    Sleep, 50
    Click, 620, 250 ; Roots
    Sleep, 1200
    
    ; Burn at brazier
    Click, 445, 312
    Random, burnTime, 2000, 3000
    Sleep, %burnTime%
    
    ; Random HP loss
    Random, damage, 0, 10
    hp -= damage
    
    ; Fix brazier if needed
    Random, fixChance, 1, 10
    if (fixChance == 1) {
        Click, 445, 312
        Sleep, 5000
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "17",
        name: "Pest Control Points",
        description: "Automated Pest Control participation for void points. Attacks portals and NPCs efficiently.",
        category: "minigames",
        author: "VoidHunter",
        executionCount: 2876,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        code: `; Pest Control Points v3.2
; Automated void point farming
#NoEnv
SendMode Input

F1::
Loop {
    ; Attack portal
    Click, 445, 302
    Sleep, 3000
    
    ; Attack spinners
    Loop, 5 {
        Click, 423, 285
        Sleep, 2400
    }
    
    ; Move to next portal
    Random, portal, 1, 4
    if (portal == 1) {
        Click, 350, 250 ; West
    }
    else if (portal == 2) {
        Click, 550, 250 ; East
    }
    else if (portal == 3) {
        Click, 450, 200 ; North
    }
    else {
        Click, 450, 350 ; South
    }
    
    Sleep, 5000
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "18",
        name: "Guardians of the Rift",
        description: "Automated runecrafting at Guardians of the Rift minigame. Mines fragments and charges cells.",
        category: "minigames",
        author: "RiftGuardian",
        executionCount: 2134,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        code: `; Guardians of the Rift v2.8
; GOTR automation script
#NoEnv
SendMode Input

F1::
Loop {
    ; Mine fragments
    Click, 412, 298
    Random, mineTime, 8000, 12000
    Sleep, %mineTime%
    
    ; Craft essence
    Click, 580, 250
    Sleep, 50
    Click, 445, 320
    Sleep, 3000
    
    ; Enter portal
    Click, 490, 285
    Sleep, 3000
    
    ; Craft runes
    Click, 445, 302
    Sleep, 2000
    
    ; Exit portal
    Click, 445, 350
    Sleep, 3000
    
    ; Charge cell
    Click, 423, 276
    Sleep, 2000
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "19",
        name: "Tempoross Fisher",
        description: "Automated Tempoross fishing boss. Handles all mechanics including dousing fires and tethering.",
        category: "minigames",
        author: "TempoBoss",
        executionCount: 1789,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        code: `; Tempoross Fisher v2.3
; Full Tempoross automation
#NoEnv
SendMode Input

F1::
Loop {
    ; Fish harpoonfish
    Click, 423, 298
    Random, fishTime, 5000, 8000
    Sleep, %fishTime%
    
    ; Cook fish
    Click, 490, 312
    Sleep, 5000
    
    ; Load cannon
    Click, 445, 285
    Sleep, 1000
    
    ; Douse fires
    Click, 412, 276
    Sleep, 2000
    
    ; Tether to totem
    Click, 467, 302
    Sleep, 3000
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
      },

      // PvP Scripts
      {
        id: "20",
        name: "NH Tribrid Switcher",
        description: "No-honor tribrid switching for deep wilderness PKing. Includes freeze timers and veng timing.",
        category: "pvp",
        author: "DeepWildsPK",
        executionCount: 2456,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
        code: `; NH Tribrid Switcher v3.9
; Deep wildy tribrid PKing
#NoEnv
SendMode Input

; Freeze timer
global freezeTimer := 0

F1::  ; Mage switch + freeze
Click, 580, 250 ; Ahrim top
Click, 620, 250 ; Ahrim bottom
Click, 660, 250 ; Staff
Click, 700, 250 ; Occult
Send, {F2} ; Ice barrage
freezeTimer := 20
return

F2::  ; Range switch
Click, 580, 290 ; Black dhide body
Click, 620, 290 ; Black dhide legs
Click, 660, 290 ; Ballista
Click, 700, 290 ; Anguish
return

F3::  ; Melee spec
Click, 580, 330 ; Fighter torso
Click, 620, 330 ; Rune legs
Click, 660, 330 ; AGS
Send, {F1} ; Spec bar
Click, 445, 302 ; Target
return

F4::  ; Veng combo
Send, {F5} ; Vengeance
Sleep, 100
Click, 660, 370 ; Gmaul
Send, {F1} ; Spec
Click, 445, 302
Send, {F1}
Click, 445, 302
return

F5::Pause
F6::ExitApp`,
        createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "21",
        name: "LMS Quick Prayers",
        description: "Last Man Standing prayer switching and gear swaps. Essential for competitive LMS.",
        category: "pvp",
        author: "LMSChamp",
        executionCount: 3123,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        code: `; LMS Quick Prayers v2.7
; Fast prayer switching for LMS
#NoEnv
SendMode Input

F1::  ; Offensive prayers
Send, {F5} ; Quick prayers
Click, 580, 420 ; Piety
Click, 620, 420 ; Rigour
return

F2::  ; Defensive prayers
Click, 580, 380 ; Protect melee
return

F3::
Click, 620, 380 ; Protect range
return

F4::
Click, 660, 380 ; Protect mage
return

F5::  ; Smite combo
Click, 700, 380 ; Smite
Sleep, 50
Click, 660, 330 ; DDS
Send, {F1}
Click, 445, 302
Send, {F1}
Click, 445, 302
return

F6::Pause
F7::ExitApp`,
        createdAt: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "22",
        name: "Edge PKing Helper",
        description: "Edgeville PKing assistant with veng timing, spec combos, and safe eating.",
        category: "pvp",
        author: "EdgeLord",
        executionCount: 1987,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        code: `; Edge PKing Helper v2.1
; Edgeville 1v1 PKing
#NoEnv
SendMode Input

F1::  ; AGS to gmaul
Click, 660, 290 ; AGS
Send, {F1}
Click, 445, 302
Sleep, 50
Click, 660, 330 ; Gmaul
Send, {F1}
Click, 445, 302
Send, {F1}
Click, 445, 302
return

F2::  ; Triple eat
Click, 580, 250 ; Shark
Click, 620, 250 ; Karambwan
Click, 660, 250 ; Brew
return

F3::  ; Veng timer
Send, {F5}
SetTimer, VengReady, 30000
return

VengReady:
ToolTip, VENG READY
SetTimer, RemoveTooltip, 2000
return

RemoveTooltip:
ToolTip
return

F4::Pause
F5::ExitApp`,
        createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Construction Scripts
      {
        id: "23",
        name: "Construction Butler Pro",
        description: "Advanced construction training with butler management. Supports all furniture types.",
        category: "construction",
        author: "BuildMaster",
        executionCount: 2678,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
        code: `; Construction Butler Pro v3.6
; Efficient construction training
#NoEnv
SendMode Input

; Variables
global butlerTimer := 0
global plankCount := 26

F1::
Loop {
    ; Build furniture
    Loop, 6 {
        Click, Right, 445, 302
        Sleep, 100
        Click, 445, 330 ; Build
        Sleep, 100
        Send, 1 ; Oak larder
        Sleep, 1200
        
        Click, Right, 445, 302
        Sleep, 100
        Click, 445, 350 ; Remove
        Sleep, 100
        Send, 1 ; Confirm
        Sleep, 800
        
        plankCount -= 8
    }
    
    ; Call butler
    Click, 380, 285 ; Butler
    Sleep, 500
    Send, 1 ; Fetch planks
    Sleep, 3000
    plankCount := 26
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "24",
        name: "Mahogany Tables",
        description: "Optimized mahogany table construction for maximum XP rates. Includes demon butler timing.",
        category: "construction",
        author: "TableMaker",
        executionCount: 1543,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        code: `; Mahogany Tables v2.4
; Max construction XP/hr
#NoEnv
SendMode Input

F1::
Loop {
    ; Build and remove tables
    Loop, 4 {
        Click, Right, 445, 302
        Sleep, 50
        Click, 445, 330
        Send, 6 ; Mahogany table
        Sleep, 1000
        
        Click, Right, 445, 302
        Sleep, 50
        Click, 445, 350
        Send, 1
        Sleep, 600
    }
    
    ; Demon butler
    Send, {Space} ; Call butler
    Sleep, 2500
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Farming Scripts
      {
        id: "25",
        name: "Herb Run Master",
        description: "Complete herb farming run covering all patches. Includes disease protection and composting.",
        category: "farming",
        author: "HerbFarmer",
        executionCount: 3456,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        code: `; Herb Run Master v4.1
; Efficient herb farming runs
#NoEnv
SendMode Input

F1::
    ; Teleport to Falador
    Send, {F4}
    Sleep, 3000
    
    ; Run to patch
    Click, 523, 245
    Sleep, 5000
    
    ; Harvest herbs
    Click, 445, 302
    Sleep, 3000
    
    ; Note herbs
    Click, 580, 250 ; Herbs
    Sleep, 50
    Click, 380, 290 ; Tool leprechaun
    Sleep, 1000
    
    ; Plant new seed
    Click, 620, 250 ; Seed
    Sleep, 50
    Click, 445, 302 ; Patch
    Sleep, 1000
    
    ; Compost
    Click, 660, 250 ; Ultracompost
    Sleep, 50
    Click, 445, 302
    Sleep, 1000
    
    ; Continue to next patch...
    ToolTip, Moving to Ardougne patch
    Send, {F5} ; Ardougne teleport
    Sleep, 3000
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "26",
        name: "Tree Run Optimizer",
        description: "Automated tree farming runs for all tree and fruit tree patches. Maximizes farming XP.",
        category: "farming",
        author: "TreeGrower",
        executionCount: 2123,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        code: `; Tree Run Optimizer v2.9
; Tree and fruit tree runs
#NoEnv
SendMode Input

F1::
Loop, 5 {  ; 5 tree patches
    ; Teleport to patch
    Send, {F%A_Index%}
    Sleep, 3000
    
    ; Check tree health
    Click, 445, 302
    Sleep, 2000
    
    ; Pay farmer
    Click, 380, 290
    Sleep, 500
    Send, 2 ; Pay for protection
    Sleep, 1000
    
    ; Clear and replant
    Click, 445, 302
    Sleep, 2000
    Click, 580, 250 ; Spade
    Click, 445, 302
    Sleep, 2000
    Click, 620, 250 ; Sapling
    Click, 445, 302
    Sleep, 1000
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "27",
        name: "Birdhouse Runner",
        description: "Quick birdhouse run script for passive hunter XP. Covers all birdhouse locations.",
        category: "farming",
        author: "BirdKeeper",
        executionCount: 2876,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        code: `; Birdhouse Runner v2.2
; Efficient birdhouse runs
#NoEnv
SendMode Input

F1::
    ; Digsite pendant
    Send, {F8}
    Sleep, 3000
    
    ; Mushroom trees
    Loop, 4 {
        ; Run to birdhouse
        Click, 445 + A_Index*20, 302
        Sleep, 3000
        
        ; Empty and replace
        Click, 445, 302
        Sleep, 1500
        Click, 580, 250 ; Birdhouse
        Click, 445, 302
        Sleep, 1000
        Click, 620, 250 ; Seeds
        Click, 445, 302
        Sleep, 500
    }
    
    ToolTip, Birdhouse run complete!
    SetTimer, RemoveTooltip, 3000
return

RemoveTooltip:
ToolTip
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 63 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Crafting Scripts  
      {
        id: "28",
        name: "Glass Blowing Pro",
        description: "Efficient glass blowing for crafting XP. Supports all glass items with banking.",
        category: "crafting",
        author: "GlassExpert",
        executionCount: 2345,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
        code: `; Glass Blowing Pro v2.6
; Fast crafting XP through glass
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Molten glass
    Sleep, 500
    Send, {Escape}
    
    ; Craft glass
    Click, 580, 250 ; Pipe
    Click, 620, 250 ; Glass
    Send, 3 ; Lantern lens
    Sleep, 50000 ; Craft all
    
    ; Bank products
    Click, 392, 285
    Sleep, 1000
    Click, 445, 450 ; Deposit all
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "29",
        name: "D'hide Body Crafter",
        description: "Creates dragonhide bodies for profit and XP. Includes thread management.",
        category: "crafting",
        author: "HideWorker",
        executionCount: 1876,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        code: `; D'hide Body Crafter v1.8
; Profitable crafting training
#NoEnv
SendMode Input

F1::
Loop {
    ; Withdraw materials
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Dragon leather
    Sleep, 500
    Send, {Escape}
    
    ; Craft bodies
    Click, 580, 250 ; Needle
    Click, 620, 250 ; Leather
    Send, 1 ; Black d'hide body
    Sleep, 18000
    
    ; Bank bodies
    Click, 392, 285
    Sleep, 1000
    Click, 580, 250
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Smithing Scripts
      {
        id: "30",
        name: "Blast Furnace Gold",
        description: "Efficient gold bar smelting at Blast Furnace. Includes coffer management and stamina potions.",
        category: "smithing",
        author: "BlastMaster",
        executionCount: 3789,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        code: `; Blast Furnace Gold v3.8
; Maximum smithing XP with gold
#NoEnv
SendMode Input

global cofferGold := 10000

F1::
Loop {
    ; Check coffer
    if (cofferGold < 1000) {
        Click, 380, 260 ; Coffer
        Sleep, 500
        Send, 10000
        Send, {Enter}
        cofferGold += 10000
    }
    
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Gold ore
    Sleep, 500
    
    ; Stamina dose
    if (Mod(A_Index, 10) == 0) {
        Click, 200, 150
        Sleep, 500
    }
    
    Send, {Escape}
    
    ; Put ore on belt
    Click, 445, 320
    Sleep, 2000
    
    ; Collect bars
    Click, 490, 330
    Sleep, 1000
    
    ; Ice gloves
    Click, 700, 250
    Sleep, 50
    Click, 490, 330
    Sleep, 1000
    
    cofferGold -= 72
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 96 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "31",
        name: "Cannonball Maker",
        description: "AFK cannonball smithing for profit. Automatically handles furnace and banking.",
        category: "smithing",
        author: "CannonProfit",
        executionCount: 2567,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
        code: `; Cannonball Maker v2.3
; AFK profit with cannonballs
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Steel bars
    Sleep, 500
    Send, {Escape}
    
    ; Make cannonballs
    Click, 445, 320 ; Furnace
    Sleep, 1000
    Send, {Space} ; Make all
    Sleep, 163000 ; Wait for completion
    
    ; Bank cannonballs
    Click, 392, 285
    Sleep, 1000
    Click, 445, 450
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Fletching Scripts
      {
        id: "32",
        name: "Dart Fletcher Pro",
        description: "High-speed dart fletching for quick fletching XP. Supports all dart types.",
        category: "fletching",
        author: "DartMaster",
        executionCount: 2987,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
        code: `; Dart Fletcher Pro v2.7
; Fast fletching XP with darts
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Dart tips
    Click, 150, 150 ; Feathers
    Sleep, 500
    Send, {Escape}
    
    ; Fletch darts
    Click, 580, 250
    Click, 620, 250
    Send, {Space}
    Sleep, 2400
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "33",
        name: "Yew Longbow Stringer",
        description: "Strings yew longbows for profit and fletching XP. Efficient banking included.",
        category: "fletching",
        author: "BowStringer",
        executionCount: 2234,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        code: `; Yew Longbow Stringer v2.1
; Profitable fletching method
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Yew longbow (u)
    Click, 150, 150 ; Bow string
    Sleep, 500
    Send, {Escape}
    
    ; String bows
    Click, 580, 250
    Click, 620, 250
    Send, {Space}
    Sleep, 17000
    
    ; Bank strung bows
    Click, 392, 285
    Sleep, 1000
    Click, 580, 250
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 51 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Herblore Scripts
      {
        id: "34",
        name: "Prayer Potion Maker",
        description: "Creates prayer potions efficiently with banking. Great for ironman accounts.",
        category: "herblore",
        author: "PotionBrewer",
        executionCount: 2456,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        code: `; Prayer Potion Maker v2.4
; Efficient prayer potion creation
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Ranarr potion (unf)
    Click, 150, 150 ; Snape grass
    Sleep, 500
    Send, {Escape}
    
    ; Make potions
    Click, 580, 250
    Click, 620, 250
    Send, {Space}
    Sleep, 17000
    
    ; Bank potions
    Click, 392, 285
    Sleep, 1000
    Click, 580, 250
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "35",
        name: "Herb Cleaner Ultra",
        description: "Fast herb cleaning with banking. Processes hundreds of herbs per hour.",
        category: "herblore",
        author: "HerbCleaner",
        executionCount: 1987,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        code: `; Herb Cleaner Ultra v3.1
; Quick herb cleaning for profit
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Grimy herbs
    Sleep, 500
    Send, {Escape}
    
    ; Clean herbs
    Loop, 28 {
        x := 580 + Mod(A_Index-1, 4) * 40
        y := 250 + Floor((A_Index-1) / 4) * 35
        Click, %x%, %y%
        Sleep, 50
    }
    
    ; Bank clean herbs
    Click, 392, 285
    Sleep, 1000
    Click, 445, 450
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Cooking Scripts
      {
        id: "36",
        name: "Wine Maker Pro",
        description: "Fast cooking XP through wine making. Handles jug of water and grapes efficiently.",
        category: "cooking",
        author: "WineMaker",
        executionCount: 2678,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        code: `; Wine Maker Pro v2.5
; Fastest cooking XP method
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Jug of water
    Click, 150, 150 ; Grapes
    Sleep, 500
    Send, {Escape}
    
    ; Make wine
    Click, 580, 250
    Click, 620, 250
    Send, {Space}
    Sleep, 2000
    
    ; Bank jugs
    Click, 392, 285
    Sleep, 1000
    Click, 580, 250
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "37",
        name: "Karambwan Cooker",
        description: "1-tick karambwan cooking at Myth's guild or Hosidius range. Maximum cooking XP.",
        category: "cooking",
        author: "CookMaster",
        executionCount: 2123,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
        code: `; Karambwan Cooker v3.2
; 1-tick cooking method
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Raw karambwan
    Sleep, 500
    Send, {Escape}
    
    ; 1-tick cook
    Loop, 28 {
        Click, 580, 250 ; Karambwan
        Click, 445, 320 ; Range
        Send, {Space}
        Sleep, 600
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Utility Scripts
      {
        id: "38",
        name: "Universal Drop All",
        description: "Drops entire inventory with customizable patterns. Essential for power skilling.",
        category: "utility",
        author: "DropMaster",
        executionCount: 5432,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        code: `; Universal Drop All v4.0
; Customizable inventory dropping
#NoEnv
SendMode Input

; Drop patterns
global dropPattern := "vertical" ; vertical, horizontal, diagonal, snake

F1::
Send, {Shift down}
if (dropPattern == "vertical") {
    Loop, 7 {
        col := A_Index - 1
        Loop, 4 {
            x := 580 + col * 40
            y := 250 + (A_Index - 1) * 35
            Click, %x%, %y%
            Sleep, 50
        }
    }
}
else if (dropPattern == "horizontal") {
    Loop, 28 {
        x := 580 + Mod(A_Index-1, 4) * 40
        y := 250 + Floor((A_Index-1) / 4) * 35
        Click, %x%, %y%
        Sleep, 50
    }
}
Send, {Shift up}
return

F2::
dropPattern := dropPattern == "vertical" ? "horizontal" : "vertical"
ToolTip, Pattern: %dropPattern%
SetTimer, RemoveTooltip, 2000
return

RemoveTooltip:
ToolTip
return

F3::Pause
F4::ExitApp`,
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "39",
        name: "Bank Standing Helper",
        description: "Automates repetitive bank standing skills. Customizable for any bankable skill.",
        category: "utility",
        author: "BankStander",
        executionCount: 3876,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        code: `; Bank Standing Helper v3.3
; Universal bank skill automation
#NoEnv
SendMode Input

F1::
Loop {
    ; Open bank
    Click, 392, 285
    Sleep, 1000
    
    ; Withdraw preset
    Send, 1 ; Preset 1
    Sleep, 500
    
    ; Process items
    Click, 580, 250 ; Tool/Item 1
    Click, 620, 250 ; Item 2
    Send, {Space} ; Make all
    
    ; Wait for completion
    Sleep, 20000
    
    ; Deposit all
    Click, 392, 285
    Sleep, 1000
    Click, 445, 450
    Sleep, 500
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "40",
        name: "Camera Rotation Tool",
        description: "Automatically rotates camera for better visibility. Useful for various activities.",
        category: "utility",
        author: "CameraMan",
        executionCount: 2345,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        code: `; Camera Rotation Tool v1.7
; Auto camera management
#NoEnv
SendMode Input

global cameraMode := "slow"

F1::
SetTimer, RotateCamera, 5000
return

RotateCamera:
if (cameraMode == "slow") {
    Send, {Left down}
    Sleep, 500
    Send, {Left up}
}
else if (cameraMode == "fast") {
    Send, {Left down}
    Sleep, 1500
    Send, {Left up}
}
return

F2::
SetTimer, RotateCamera, Off
return

F3::
cameraMode := cameraMode == "slow" ? "fast" : "slow"
ToolTip, Camera: %cameraMode%
SetTimer, RemoveTooltip, 2000
return

RemoveTooltip:
ToolTip
return

F4::ExitApp`,
        createdAt: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "41",
        name: "Window Quick Switch",
        description: "Quick switching between game client and other applications. Perfect for multi-logging.",
        category: "utility",
        author: "WindowPro",
        executionCount: 1765,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString(),
        code: `; Window Quick Switch v2.0
; Fast client switching
#NoEnv
SendMode Input

F1::
WinActivate, RuneLite
return

F2::
WinActivate, RuneLite - 2
return

F3::
WinActivate, Discord
return

F4::
WinActivate, Chrome
return

F5::ExitApp`,
        createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "42",
        name: "XP Tracker Logger",
        description: "Logs XP gains and calculates rates. Useful for tracking training efficiency.",
        category: "utility",
        author: "XPTracker",
        executionCount: 1543,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
        code: `; XP Tracker Logger v1.5
; Track XP gains over time
#NoEnv
SendMode Input

global startXP := 0
global startTime := 0
global currentXP := 0

F1::  ; Start tracking
startTime := A_TickCount
InputBox, startXP, XP Tracker, Enter current XP:
return

F2::  ; Check rate
InputBox, currentXP, XP Tracker, Enter current XP:
elapsed := (A_TickCount - startTime) / 3600000  ; Hours
xpGained := currentXP - startXP
xpPerHour := Round(xpGained / elapsed)
MsgBox, XP Gained: %xpGained%\nXP/Hour: %xpPerHour%
return

F3::ExitApp`,
        createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Banking Scripts
      {
        id: "43",
        name: "Quick Banking Pro",
        description: "Lightning fast banking with preset support. Reduces banking time significantly.",
        category: "banking",
        author: "BankingPro",
        executionCount: 4567,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        code: `; Quick Banking Pro v3.9
; Fastest banking methods
#NoEnv
SendMode Input

; Banking hotkeys
F1::  ; Deposit all
Click, 392, 285
Sleep, 300
Click, 445, 450
Send, {Escape}
return

F2::  ; Load preset 1
Click, 392, 285
Sleep, 300
Send, 1
Send, {Escape}
return

F3::  ; Load preset 2
Click, 392, 285
Sleep, 300
Send, 2
Send, {Escape}
return

F4::  ; Deposit worn items
Click, 392, 285
Sleep, 300
Click, 480, 450
Send, {Escape}
return

F5::  ; Quick withdraw (last item)
Click, 392, 285
Sleep, 300
Click, Right, 100, 150
Click, 100, 230  ; Withdraw all
Send, {Escape}
return

F6::ExitApp`,
        createdAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "44",
        name: "Inventory Organizer",
        description: "Automatically organizes inventory items. Perfect for activities requiring specific layouts.",
        category: "banking",
        author: "InvOrganizer",
        executionCount: 2789,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        code: `; Inventory Organizer v2.3
; Auto-organize inventory
#NoEnv
SendMode Input

F1::  ; Organize for combat
; Move food to top rows
Loop, 12 {
    fromX := 580 + Mod(A_Index+15, 4) * 40
    fromY := 250 + Floor((A_Index+15) / 4) * 35
    toX := 580 + Mod(A_Index-1, 4) * 40
    toY := 250 + Floor((A_Index-1) / 4) * 35
    
    Click, %fromX%, %fromY%
    Sleep, 50
    Click, %toX%, %toY%
    Sleep, 50
}
return

F2::  ; Organize for skilling
; Group similar items
ToolTip, Organizing inventory...
; Implementation for grouping
Sleep, 2000
ToolTip
return

F3::ExitApp`,
        createdAt: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "45",
        name: "Bank Tab Switcher",
        description: "Quick bank tab navigation with hotkeys. Speeds up finding items in organized banks.",
        category: "banking",
        author: "TabMaster",
        executionCount: 1987,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        code: `; Bank Tab Switcher v1.6
; Fast bank tab navigation
#NoEnv
SendMode Input

; Tab hotkeys (F1-F9 for tabs 1-9)
F1::
Click, 392, 285  ; Open bank
Sleep, 300
Click, 50, 50   ; Tab 1
return

F2::
Click, 392, 285
Sleep, 300
Click, 90, 50   ; Tab 2
return

F3::
Click, 392, 285
Sleep, 300
Click, 130, 50  ; Tab 3
return

F4::
Click, 392, 285
Sleep, 300
Click, 170, 50  ; Tab 4
return

F5::
Click, 392, 285
Sleep, 300
Click, 210, 50  ; Tab 5
return

Escape::ExitApp`,
        createdAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Boss Helper Scripts
      {
        id: "46",
        name: "Vorkath Helper Elite",
        description: "Advanced Vorkath boss helper with acid walk, prayer switches, and woox walk support.",
        category: "combat",
        author: "VorkathSlayer",
        executionCount: 3234,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        code: `; Vorkath Helper Elite v4.3
; Complete Vorkath automation
#NoEnv
SendMode Input

global acidPhase := false
global wooxWalk := true

F1::  ; Acid walk
acidPhase := true
Loop {
    if (!acidPhase)
        break
    
    ; Walk pattern
    Click, 400, 300
    Sleep, 1200
    Click, 500, 300
    Sleep, 1200
}
return

F2::  ; Woox walk
if (wooxWalk) {
    Click, 445, 302  ; Attack Vorkath
    Sleep, 1800
    Click, 400, 302  ; Step back
    Sleep, 600
}
return

F3::  ; Prayer switches
Click, 620, 380  ; Protect from magic
Sleep, 100
Click, 580, 420  ; Eagle eye/Rigour
return

F4::  ; Spawn phase
Click, 490, 320  ; Crumble undead
Sleep, 100
Click, 445, 330  ; Click spawn
Sleep, 2400
Click, 620, 380  ; Prayers back on
return

F5::
acidPhase := false
return

F6::ExitApp`,
        createdAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "47",
        name: "Zulrah Rotation Helper",
        description: "Helps with Zulrah rotations and prayer/gear switches. Supports all 4 rotations.",
        category: "combat",
        author: "ZulrahMaster",
        executionCount: 2876,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        code: `; Zulrah Rotation Helper v3.5
; Zulrah phase assistance
#NoEnv
SendMode Input

global rotation := 1
global phase := 1

F1::  ; Mage phase
; Mage gear
Click, 580, 250
Click, 620, 250
Click, 660, 250
; Protect from magic
Click, 660, 380
return

F2::  ; Range phase
; Range gear
Click, 580, 290
Click, 620, 290
Click, 660, 290
; Protect from missiles
Click, 620, 380
return

F3::  ; Melee phase (move)
; Run to safe spot
Click, 380, 280
Sleep, 2000
return

F4::  ; Reset rotation
rotation := 1
phase := 1
ToolTip, Rotation reset
SetTimer, RemoveTooltip, 2000
return

RemoveTooltip:
ToolTip
return

F5::ExitApp`,
        createdAt: new Date(Date.now() - 73 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "48",
        name: "Nightmare Zone AFK",
        description: "AFK Nightmare Zone with absorption and overload management. Maximum points per hour.",
        category: "combat",
        author: "NMZAfker",
        executionCount: 4123,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        code: `; Nightmare Zone AFK v3.8
; Optimal NMZ setup
#NoEnv
SendMode Input

global absorptionHP := 1000
global overloadTimer := 0

F1::
SetTimer, NMZLoop, 60000  ; Check every minute
return

NMZLoop:
; Drink overload
if (overloadTimer <= 0) {
    Click, 580, 250  ; Overload
    overloadTimer := 5
    Sleep, 500
}

; Drink absorptions
if (absorptionHP < 200) {
    Loop, 4 {
        Click, 620, 250  ; Absorption
        Sleep, 500
    }
    absorptionHP := 1000
}

; Rock cake to 1 HP
Click, 700, 250
Sleep, 100
Click, 700, 250

overloadTimer--
absorptionHP -= 50
return

F2::
SetTimer, NMZLoop, Off
return

F3::ExitApp`,
        createdAt: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "49",
        name: "Jad Prayer Switcher",
        description: "Perfect prayer switching for TzTok-Jad fight caves. Never miss a prayer flick.",
        category: "combat",
        author: "JadKiller",
        executionCount: 2567,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        code: `; Jad Prayer Switcher v2.9
; Fight caves prayer helper
#NoEnv
SendMode Input

; Sound detection setup
global lastPrayer := "none"

F1::  ; Mage prayer (high pitch sound)
if (lastPrayer != "mage") {
    Click, 660, 380  ; Protect from magic
    lastPrayer := "mage"
    ToolTip, MAGE
}
return

F2::  ; Range prayer (stomp sound)
if (lastPrayer != "range") {
    Click, 620, 380  ; Protect from missiles
    lastPrayer := "range"
    ToolTip, RANGE
}
return

F3::  ; Healers phase
Loop, 4 {
    ; Tag healers
    Click, 400 + A_Index * 30, 320
    Sleep, 1000
}
return

F4::
ToolTip
return

F5::ExitApp`,
        createdAt: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "50",
        name: "Corrupted Gauntlet Helper",
        description: "Advanced Corrupted Gauntlet assistance including boss prayer switches and tornado dodging.",
        category: "combat",
        author: "GauntletGod",
        executionCount: 1876,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        code: `; Corrupted Gauntlet Helper v2.7
; CG boss fight assistance
#NoEnv
SendMode Input

global attackCount := 0
global currentPrayer := "none"

F1::  ; Start boss fight
attackCount := 0
SetTimer, CountAttacks, 600
return

CountAttacks:
attackCount++
if (attackCount == 4) {
    ; Switch prayers
    if (currentPrayer == "mage") {
        Click, 620, 380  ; Range prayer
        currentPrayer := "range"
    }
    else {
        Click, 660, 380  ; Mage prayer
        currentPrayer := "mage"
    }
    attackCount := 0
}
return

F2::  ; Tornado dodge
; Quick movement pattern
Click, 400, 300
Sleep, 600
Click, 500, 300
Sleep, 600
return

F3::  ; 5:1 method
Loop, 5 {
    Click, 445, 302  ; Attack
    Sleep, 1800
}
Click, 400, 300  ; Move
Sleep, 600
return

F4::
SetTimer, CountAttacks, Off
return

F5::ExitApp`,
        createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Additional Unique Scripts
      {
        id: "51",
        name: "Runecraft ZMI Runner",
        description: "Efficient ZMI altar runecrafting with follow patterns and obstacle navigation.",
        category: "runecrafting",
        author: "RCMaster",
        executionCount: 2345,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        code: `; ZMI Runner v2.8
; Ourania altar runecrafting
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150  ; Pure essence
    Sleep, 500
    Send, {Escape}
    
    ; Follow runner
    Click, 445, 302
    Sleep, 12000
    
    ; Craft runes
    Click, 445, 320
    Sleep, 2000
    
    ; Teleport back
    Click, 700, 250  ; Ourania teleport
    Sleep, 3000
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "52",
        name: "Slayer Task Helper",
        description: "Assists with slayer tasks including cannon placement, prayer flicking, and loot management.",
        category: "combat",
        author: "SlayerPro",
        executionCount: 3678,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        code: `; Slayer Task Helper v3.4
; Complete slayer automation
#NoEnv
SendMode Input

global cannonBalls := 30

F1::  ; Place and load cannon
Click, 580, 250  ; Cannon base
Sleep, 500
Click, 445, 302  ; Place
Sleep, 1000
Click, 445, 302  ; Load
return

F2::  ; Reload cannon
if (cannonBalls <= 0) {
    Click, 620, 250  ; Cannonballs
    cannonBalls := 30
}
Click, 445, 302
cannonBalls -= 30
return

F3::  ; Loot valuable drops
; Alch rune items
Click, 700, 250  ; High alch
Click, 445, 320  ; Item on ground
Sleep, 3000
return

F4::Pause
F5::ExitApp`,
        createdAt: new Date(Date.now() - 87 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "53",
        name: "Thieving Ardougne Knights",
        description: "Automated pickpocketing of Ardougne Knights with coin pouch opening and food eating.",
        category: "thieving",
        author: "ThiefMaster",
        executionCount: 4231,
        isFavorite: 1,
        lastExecuted: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        code: `; Ardougne Knights Thieving v3.9
; AFK pickpocketing
#NoEnv
SendMode Input

global pouchCount := 0
global hp := 90

F1::
Loop {
    ; Pickpocket
    Click, 445, 302
    Sleep, 650
    pouchCount++
    
    ; Open pouches
    if (pouchCount >= 28) {
        Click, 580, 250
        pouchCount := 0
        Sleep, 500
    }
    
    ; Eat food
    Random, damage, 0, 5
    hp -= damage
    if (hp < 40) {
        Click, 700, 250  ; Food
        hp += 20
        Sleep, 500
    }
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "54",
        name: "Hunter Birdhouse Helper",
        description: "Complete birdhouse run automation with seed filling and nest collection.",
        category: "hunter",
        author: "BirdHunter",
        executionCount: 2134,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        code: `; Hunter Birdhouse Helper v2.1
; Efficient birdhouse runs
#NoEnv
SendMode Input

F1::
Loop, 4 {
    ; Build birdhouse
    Click, 580, 250  ; Logs
    Click, 620, 250  ; Clockwork
    Sleep, 1200
    
    ; Place on spot
    Click, 445, 302
    Sleep, 1000
    
    ; Add seeds
    Click, 660, 250  ; Seeds
    Click, 445, 302
    Sleep, 500
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "55",
        name: "Firemaking Wintertodt",
        description: "Specialized Wintertodt script focusing on firemaking XP with fletching disabled.",
        category: "firemaking",
        author: "PyroMaster",
        executionCount: 1987,
        isFavorite: 0,
        lastExecuted: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
        code: `; Firemaking Wintertodt v2.3
; Pure FM XP at WT
#NoEnv
SendMode Input

F1::
Loop {
    ; Chop roots
    Click, 392, 285
    Sleep, 5000
    
    ; Burn at brazier (no fletching)
    Click, 445, 312
    Sleep, 3000
    
    ; Heal if needed
    Click, 700, 250
    Sleep, 500
}
return

F2::Pause
F3::ExitApp`,
        createdAt: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Initialize scripts in MemStorage
    console.log('Adding', sampleScripts.length, 'sample scripts');
    sampleScripts.forEach(script => {
      this.scripts.set(script.id, script);
    });
    console.log('Scripts map now has', this.scripts.size, 'scripts');

    // Sample news articles
    const sampleNews: NewsArticle[] = [
      {
        id: "1",
        title: "Desert Treasure II - The Fallen Empire Released!",
        summary: "The highly anticipated grandmaster quest is now live",
        content: "Players can now embark on the epic Desert Treasure II quest...",
        category: "update",
        source: "Official",
        author: "Jagex",
        isHot: true,
        publishedAt: new Date()
      },
      {
        id: "2",
        title: "Christmas Event 2024 Now Live",
        summary: "Help save Christmas in Gielinor and earn exclusive holiday rewards!",
        content: "The annual Christmas event has arrived...",
        category: "event",
        source: "Wiki",
        isHot: true,
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ];

    sampleNews.forEach(article => this.newsArticles.set(article.id, article));

    // Sample system stats
    this.currentStats = {
      id: "1",
      cpuUsage: 42,
      gpuUsage: 58,
      ramUsage: 62, // Changed to integer percentage
      fps: 117,
      timestamp: new Date()
    };
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser & { password: string }): Promise<User> {
    const passwordHash = await bcrypt.hash(insertUser.password, 10);
    const { password, ...userWithoutPassword } = insertUser;
    const [user] = await db
      .insert(users)
      .values({ ...userWithoutPassword, passwordHash })
      .returning();
    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  // Script methods
  async getAllScripts(): Promise<Script[]> {
    const results = await db
      .select()
      .from(scripts)
      .orderBy(desc(scripts.executionCount));
    return results;
  }

  async getScriptsByCategory(category: string): Promise<Script[]> {
    const results = await db
      .select()
      .from(scripts)
      .where(eq(scripts.category, category));
    return results;
  }

  async getScript(id: string): Promise<Script | undefined> {
    const [script] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, id));
    return script || undefined;
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    const [script] = await db
      .insert(scripts)
      .values(insertScript)
      .returning();
    return script;
  }

  async updateScript(id: string, updates: Partial<InsertScript>): Promise<Script | undefined> {
    const [script] = await db
      .update(scripts)
      .set(updates)
      .where(eq(scripts.id, id))
      .returning();
    return script || undefined;
  }

  async deleteScript(id: string): Promise<boolean> {
    const result = await db
      .delete(scripts)
      .where(eq(scripts.id, id))
      .returning();
    return result.length > 0;
  }

  async incrementScriptExecution(id: string): Promise<void> {
    await db
      .update(scripts)
      .set({ 
        executionCount: sql`${scripts.executionCount} + 1`,
        lastExecuted: new Date()
      })
      .where(eq(scripts.id, id));
  }

  async toggleScriptFavorite(id: string): Promise<void> {
    const [script] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, id));
    
    if (script) {
      await db
        .update(scripts)
        .set({ isFavorite: script.isFavorite === 1 ? 0 : 1 })
        .where(eq(scripts.id, id));
    }
  }

  async searchScripts(query: string): Promise<Script[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const results = await db
      .select()
      .from(scripts)
      .where(
        or(
          like(sql`lower(${scripts.name})`, lowerQuery),
          like(sql`lower(${scripts.description})`, lowerQuery),
          like(sql`lower(${scripts.code})`, lowerQuery)
        )
      );
    return results;
  }

  // News methods
  async getAllNews(): Promise<NewsArticle[]> {
    const results = await db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt));
    return results;
  }

  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    const results = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.category, category));
    return results;
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    const [article] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, id));
    return article || undefined;
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const [article] = await db
      .insert(newsArticles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async updateNewsArticle(id: string, updates: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const [article] = await db
      .update(newsArticles)
      .set(updates)
      .where(eq(newsArticles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    const result = await db
      .delete(newsArticles)
      .where(eq(newsArticles.id, id))
      .returning();
    return result.length > 0;
  }

  // System Stats methods
  async getCurrentStats(): Promise<SystemStats | undefined> {
    const [stats] = await db
      .select()
      .from(systemStats)
      .orderBy(desc(systemStats.timestamp))
      .limit(1);
    return stats || undefined;
  }

  async updateStats(insertStats: InsertSystemStats): Promise<SystemStats> {
    const [stats] = await db
      .insert(systemStats)
      .values(insertStats)
      .returning();
    return stats;
  }

  async getStatsHistory(): Promise<SystemStats[]> {
    const results = await db
      .select()
      .from(systemStats)
      .orderBy(desc(systemStats.timestamp))
      .limit(100);
    return results;
  }
}
export function createStorage(useDb: boolean = false) {
  // Use MemStorage by default - Neon HTTP endpoint issues workaround
  // DatabaseStorage available for future use when Neon HTTP is enabled
  return new MemStorage();
}

export const storage = createStorage();

// Using MemStorage with sample data - fully functional for all features
