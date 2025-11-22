import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { scripts, newsArticles, systemStats } from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedDatabase() {
  console.log("Starting database seed...");

  // Sample OSRS Scripts
  const sampleScripts = [
    // Combat Scripts
    {
      id: "1",
      name: "Prayer Flicker Pro",
      description: "Advanced 1-tick prayer flicking for maximum efficiency. Supports offensive and defensive prayers with customizable hotkeys.",
      category: "combat",
      author: "PKMaster99",
      executionCount: 8234,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      code: `; Prayer Flicker Pro v3.2
; Advanced 1-tick prayer flicking
#NoEnv
SendMode Input

; Variables
global prayerActive := false
global flickTimer := 0

F1::
Loop {
    ; Quick prayer activation
    Send, {Space}
    Sleep, 50
    
    ; Deactivate for 1 tick
    Send, {Space}
    Sleep, 600
    
    ; Check if still in combat
    PixelGetColor, combatColor, 100, 100
    if (combatColor != 0xFF0000) {
        break
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      name: "Weapon Switch Master",
      description: "Instant weapon and gear switching for PvP and PvM. Includes special attack combos.",
      category: "combat",
      author: "SwitchGod",
      executionCount: 5672,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      code: `; Weapon Switch Master v2.8
; Fast gear switching for combat
#NoEnv
SendMode Input

; AGS to Gmaul combo
F1::
Click, 580, 250 ; AGS slot
Sleep, 50
Send, {F5} ; Special attack
Sleep, 100
Click, 620, 250 ; Gmaul slot
Send, {F5}
Send, {F5} ; Double spec
return

; Defensive switch
F2::
Click, 580, 290 ; Shield slot
Click, 620, 290 ; Defender slot
return

F3::Pause
F4::ExitApp`,
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },

    // Fishing Scripts
    {
      id: "3",
      name: "Barbarian Fishing Elite",
      description: "3-tick barbarian fishing with automatic dropping and anti-ban features. Maximizes XP rates at Otto's Grotto.",
      category: "fishing",
      author: "FishingPro",
      executionCount: 12453,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      code: `; Barbarian Fishing Elite v5.1
; 3-tick fishing with auto-drop
#NoEnv
SendMode Input

; Configuration
global dropPattern := "zigzag"
global antibanEnabled := true

F1::
Loop {
    ; Start fishing
    Click, 400, 300
    Sleep, 1800
    
    ; Check inventory
    PixelGetColor, invFull, 680, 400
    if (invFull = 0xFFFF00) {
        ; Drop fish
        Send, {Shift down}
        Loop, 28 {
            Click, % 580 + Mod(A_Index, 4) * 42, % 250 + (A_Index // 4) * 36
            Random, dropDelay, 80, 120
            Sleep, %dropDelay%
        }
        Send, {Shift up}
    }
    
    ; Anti-ban
    if (antibanEnabled && Mod(A_Index, 20) == 0) {
        Random, moveX, 100, 700
        Random, moveY, 100, 500
        MouseMove, %moveX%, %moveY%, 10
        Random, waitTime, 500, 2000
        Sleep, %waitTime%
    }
}
return

F2::antibanEnabled := !antibanEnabled
F3::Pause
F4::ExitApp`,
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: "4",
      name: "Karambwan 1-Tick Fisher",
      description: "Advanced 1-tick karambwan fishing for maximum efficiency. Includes banking support.",
      category: "fishing",
      author: "KaramKing",
      executionCount: 3421,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      code: `; Karambwan 1-Tick Fisher v2.3
; Maximum efficiency karambwan fishing
#NoEnv
SendMode Input

F1::
Loop {
    ; Use fairy ring
    Click, 650, 200
    Sleep, 1200
    
    ; Fish karambwan spot
    Loop, 28 {
        Click, 380, 290
        Sleep, 600
        Click, 620, 340 ; Inventory slot
        Sleep, 50
    }
    
    ; Bank trip
    Send, {F6} ; Teleport
    Sleep, 2000
    Click, 400, 250 ; Bank
    Sleep, 500
    Click, Right, 680, 380
    Sleep, 100
    Click, 680, 420 ; Deposit all
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },

    // Mining Scripts
    {
      id: "5",
      name: "3-Tick Granite Miner",
      description: "Efficient 3-tick granite mining at Quarry. Includes waterskin management and dropping.",
      category: "mining",
      author: "TickManipulator",
      executionCount: 7823,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      code: `; 3-Tick Granite Miner v4.0
; Advanced tick manipulation mining
#NoEnv
SendMode Input

; Variables
global tickCount := 0
global waterskinUses := 0

F1::
Loop {
    ; Start 3-tick cycle
    Click, 400, 280 ; Granite rock
    Sleep, 600
    
    ; Herb tar action
    Click, 580, 250
    Click, 620, 250
    Sleep, 600
    
    ; Continue mining
    Click, 400, 280
    Sleep, 600
    
    ; Drop granite
    Send, {Shift down}
    Click, 660, 360
    Send, {Shift up}
    
    tickCount++
    
    ; Drink waterskin every 50 ticks
    if (Mod(tickCount, 50) == 0) {
        Click, 700, 430
        waterskinUses++
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "6",
      name: "MLM Helper Advanced",
      description: "Motherlode Mine automation with intelligent vein detection and ore management.",
      category: "mining",
      author: "MLMExpert",
      executionCount: 4562,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      code: `; MLM Helper Advanced v3.7
; Motherlode Mine automation
#NoEnv
SendMode Input

; States
global state := "mining"
global oreCount := 0

F1::
Loop {
    if (state = "mining") {
        ; Find and click vein
        PixelSearch, veinX, veinY, 100, 100, 700, 500, 0x7F7F00
        if (!ErrorLevel) {
            Click, %veinX%, %veinY%
            Sleep, 3000
            oreCount++
        }
        
        ; Check if inventory full
        if (oreCount >= 28) {
            state := "depositing"
        }
    }
    else if (state = "depositing") {
        ; Walk to hopper
        Click, 450, 200
        Sleep, 5000
        
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
      createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
    },

    // Magic Scripts
    {
      id: "7",
      name: "High Alchemy Pro",
      description: "Efficient high alchemy script with automatic item switching and anti-ban features. Tracks profit/loss.",
      category: "magic",
      author: "AlchMaster",
      executionCount: 5678,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 30 * 60 * 1000),
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
      createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "8",
      name: "Superglass Make Banking",
      description: "Automated Superglass Make spell casting with banking. Maximizes crafting XP through magic.",
      category: "magic",
      author: "GlassMaker",
      executionCount: 2345,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
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
    Click, 100, 190 ; Withdraw-All
    Sleep, 200
    
    Click, 150, 150 ; Seaweed
    Click, Right
    Sleep, 100
    Click, 150, 175 ; Withdraw-18
    Sleep, 200
    
    Send, {Esc} ; Close bank
    Sleep, 200
    
    ; Cast Superglass Make
    Send, {F4}
    Sleep, 2500
    
    ; Bank glass
    Click, 392, 285
    Sleep, 1000
    Click, 620, 290
    Sleep, 200
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },

    // Agility Scripts
    {
      id: "9",
      name: "Seers Rooftop Runner",
      description: "Automated Seers Village rooftop agility course with mark of grace collection.",
      category: "agility",
      author: "AgilityKing",
      executionCount: 9876,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      code: `; Seers Rooftop Runner v3.5
; Seers Village agility course automation
#NoEnv
SendMode Input

F1::
Loop {
    ; Obstacle 1: Wall climb
    Click, 520, 380
    Sleep, 6200
    
    ; Obstacle 2: Rope
    Click, 485, 310
    Sleep, 5800
    
    ; Obstacle 3: Narrow wall
    Click, 510, 340
    Sleep, 4200
    
    ; Check for mark of grace
    PixelSearch, markX, markY, 200, 200, 600, 400, 0xFF0080
    if (!ErrorLevel) {
        Click, %markX%, %markY%
        Sleep, 1500
    }
    
    ; Obstacle 4: Jump gap
    Click, 490, 315
    Sleep, 3800
    
    ; Obstacle 5: Jump gap 2
    Click, 505, 330
    Sleep, 4500
    
    ; Obstacle 6: Tightrope
    Click, 495, 325
    Sleep, 5200
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: "10",
      name: "Ardougne Course Master",
      description: "Complete Ardougne rooftop agility course automation with optimal pathing.",
      category: "agility",
      author: "RooftopRunner",
      executionCount: 6234,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
      code: `; Ardougne Course Master v2.8
; Ardougne rooftop agility automation
#NoEnv
SendMode Input

F1::
Loop {
    ; Start: Wooden Beams
    Click, 515, 385
    Sleep, 5800
    
    ; Jump to opposite building
    Click, 480, 320
    Sleep, 4200
    
    ; Walk on tightrope
    Click, 505, 335
    Sleep, 7800
    
    ; Jump gap
    Click, 490, 315
    Sleep, 3500
    
    ; Jump to roof
    Click, 500, 325
    Sleep, 4000
    
    ; Balance across
    Click, 495, 330
    Sleep, 5500
    
    ; Jump down
    Click, 510, 340
    Sleep, 3800
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    },

    // Woodcutting Scripts
    {
      id: "11",
      name: "Redwood Chopper AFK",
      description: "Semi-AFK redwood tree cutting with automatic re-clicking and idle prevention.",
      category: "woodcutting",
      author: "WoodcutterPro",
      executionCount: 4567,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      code: `; Redwood Chopper AFK v3.0
; Semi-AFK redwood cutting
#NoEnv
SendMode Input

; Variables
global idleTimer := 0

F1::
Loop {
    ; Click redwood tree
    Click, 400, 300
    
    ; Wait for tree to deplete (random time)
    Random, cutTime, 45000, 75000
    Sleep, %cutTime%
    
    ; Prevent idle logout
    idleTimer++
    if (Mod(idleTimer, 10) == 0) {
        Send, {Space} ; Open stats
        Sleep, 500
        Send, {Escape}
    }
    
    ; Random camera movement
    if (Mod(idleTimer, 5) == 0) {
        Random, rotation, 1, 4
        Loop, %rotation% {
            Send, {Left}
            Sleep, 1000
        }
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: "12",
      name: "Teak Power Chopper",
      description: "2-tick teak woodcutting on Fossil Island with auto-dropping for maximum XP.",
      category: "woodcutting",
      author: "2TickMaster",
      executionCount: 3245,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      code: `; Teak Power Chopper v2.5
; 2-tick teak woodcutting
#NoEnv
SendMode Input

F1::
Loop {
    ; Start 2-tick cycle
    Click, 420, 310 ; Teak tree
    Sleep, 600
    
    ; Auto attack with birds
    Click, 380, 280 ; Attack bird
    Sleep, 600
    
    ; Continue chopping
    Click, 420, 310
    Sleep, 600
    
    ; Drop logs
    Send, {Shift down}
    Click, 620, 290
    Send, {Shift up}
    
    ; Repeat cycle
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
    },

    // More scripts for all categories...
    // Crafting
    {
      id: "13",
      name: "Glassblowing Pro",
      description: "Efficient glassblowing with automatic banking and interface navigation.",
      category: "crafting",
      author: "CraftingGuru",
      executionCount: 3456,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      code: `; Glassblowing Pro v2.1
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    Click, 100, 150 ; Molten glass
    Sleep, 500
    Send, {Esc}
    
    ; Make items
    Click, 620, 290 ; Pipe on glass
    Sleep, 1000
    Send, {Space} ; Make all
    Sleep, 48000 ; Wait for completion
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
    },
    
    // Cooking
    {
      id: "14",
      name: "Wine Maker Express",
      description: "Fast wine making with banking for cooking XP.",
      category: "cooking",
      author: "ChefOSRS",
      executionCount: 2789,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      code: `; Wine Maker Express v1.8
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    
    ; Withdraw grapes and water
    Click, 100, 150
    Click, 150, 150
    Send, {Esc}
    
    ; Make wines
    Click, 620, 290 ; Use jug on grapes
    Click, 660, 290
    Sleep, 500
    Send, {Space}
    Sleep, 2000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    },

    // Smithing
    {
      id: "15",
      name: "Blast Furnace Bot",
      description: "Automated blast furnace for efficient bar making with coal management.",
      category: "smithing",
      author: "SmithMaster",
      executionCount: 5123,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      code: `; Blast Furnace Bot v3.3
#NoEnv
SendMode Input

global coalCount := 0

F1::
Loop {
    ; Deposit coal
    if (coalCount < 254) {
        Click, 392, 285 ; Bank
        Sleep, 1000
        Click, 100, 150 ; Coal
        Send, {Esc}
        Click, 450, 320 ; Conveyor
        Sleep, 2000
        coalCount += 27
    }
    
    ; Deposit ore
    Click, 392, 285
    Sleep, 1000
    Click, 150, 150 ; Ore
    Send, {Esc}
    Click, 450, 320
    Sleep, 3000
    
    ; Collect bars
    Click, 480, 350 ; Bar dispenser
    Sleep, 2000
    coalCount -= 27
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },

    // Fletching
    {
      id: "16",
      name: "Dart Fletcher Ultra",
      description: "Lightning fast dart fletching with automatic feather attachment.",
      category: "fletching",
      author: "FletchKing",
      executionCount: 4892,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      code: `; Dart Fletcher Ultra v2.7
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 500
    
    ; Withdraw dart tips and feathers
    Click, 100, 150 ; Tips
    Click, 150, 150 ; Feathers  
    Send, {Esc}
    
    ; Make darts
    Click, 620, 290
    Click, 660, 290
    Sleep, 200
    Send, {Space}
    Sleep, 2400
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
    },

    // Herblore
    {
      id: "17",
      name: "Herb Cleaner Pro",
      description: "Fast herb cleaning with banking for herblore XP.",
      category: "herblore",
      author: "HerbMaster",
      executionCount: 3678,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      code: `; Herb Cleaner Pro v2.2
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    
    ; Withdraw grimy herbs
    Click, 100, 150
    Send, {Esc}
    
    ; Clean all herbs
    Loop, 28 {
        Click, % 580 + Mod(A_Index-1, 4) * 42, % 250 + ((A_Index-1) // 4) * 36
        Sleep, 50
    }
    Sleep, 500
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
    },

    // Farming
    {
      id: "18",
      name: "Farm Run Helper",
      description: "Complete herb and tree farm run automation with teleports.",
      category: "farming",
      author: "FarmingPro",
      executionCount: 2456,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      code: `; Farm Run Helper v3.1
#NoEnv
SendMode Input

F1::
; Herb run sequence
patches := ["Ardougne", "Catherby", "Falador", "Hosidius"]

for index, patch in patches {
    ; Teleport to patch
    Send, {F%index%}
    Sleep, 3000
    
    ; Harvest herbs
    Click, 400, 300
    Sleep, 2000
    
    ; Note herbs
    Click, 620, 290
    Click, 450, 350 ; Tool leprechaun
    Sleep, 1000
    
    ; Plant new seeds
    Click, 660, 330
    Click, 400, 300
    Sleep, 1500
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000)
    },

    // Construction  
    {
      id: "19",
      name: "Oak Larder Builder",
      description: "Fast oak larder building with butler automation for construction training.",
      category: "construction",
      author: "BuilderBob",
      executionCount: 3892,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
      code: `; Oak Larder Builder v2.9
#NoEnv
SendMode Input

global butlerTimer := 0

F1::
Loop {
    ; Build larder
    Click, Right, 400, 300
    Sleep, 200
    Click, 400, 340 ; Build option
    Sleep, 500
    Send, {2} ; Oak larder
    Sleep, 1200
    
    ; Remove larder
    Click, Right, 400, 300
    Sleep, 200
    Click, 400, 360 ; Remove option
    Sleep, 500
    Send, {1} ; Confirm
    Sleep, 600
    
    butlerTimer++
    
    ; Call butler every 8 larders
    if (Mod(butlerTimer, 8) == 0) {
        Send, {1} ; Call butler
        Sleep, 2000
        Send, {1} ; Fetch planks
        Sleep, 1000
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
    },

    // Runecrafting
    {
      id: "20",
      name: "ZMI Altar Runner",
      description: "Ourania Altar (ZMI) runecrafting with follow mode and essence management.",
      category: "runecrafting",
      author: "RuneCrafter",
      executionCount: 4123,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      code: `; ZMI Altar Runner v3.0
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank at ZMI
    Click, 392, 285
    Sleep, 1000
    
    ; Withdraw essence
    Click, Right, 100, 150
    Click, 100, 200 ; Fill
    Send, {Esc}
    
    ; Follow leader to altar
    Click, Right, 400, 250 ; Leader
    Click, 400, 280 ; Follow
    Sleep, 25000 ; Run time
    
    ; Craft runes
    Click, 450, 320 ; Altar
    Sleep, 2000
    
    ; Teleport back
    Click, 620, 430 ; Teleport
    Sleep, 3000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000)
    },

    // Thieving
    {
      id: "21",
      name: "Ardy Knight Pickpocket",
      description: "Ardougne Knight thieving with coin pouch opening and food eating.",
      category: "thieving",
      author: "ThiefMaster",
      executionCount: 8734,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      code: `; Ardy Knight Pickpocket v4.5
#NoEnv
SendMode Input

global pouchCount := 0

F1::
Loop {
    ; Pickpocket knight
    Click, 400, 300
    Sleep, 600
    pouchCount++
    
    ; Open coin pouches at 28
    if (pouchCount >= 28) {
        Click, 620, 430 ; Coin pouch
        Sleep, 500
        pouchCount := 0
    }
    
    ; Check HP and eat food
    PixelGetColor, hpColor, 560, 85
    if (hpColor = 0xFF0000) {
        Click, 660, 290 ; Food
        Sleep, 600
    }
}
return

F2::Pause  
F3::ExitApp`,
      createdAt: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },

    // Hunter
    {
      id: "22",
      name: "Red Chinchompa Hunter",
      description: "Efficient red chin hunting with box trap management.",
      category: "hunter",
      author: "HunterElite",
      executionCount: 3567,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      code: `; Red Chinchompa Hunter v2.8
#NoEnv
SendMode Input

F1::
Loop {
    ; Check and reset traps
    Loop, 5 {
        ; Check trap state
        PixelGetColor, trapColor, % 300 + A_Index*50, 300
        
        if (trapColor = 0xFF0000) {
            ; Trap has caught
            Click, % 300 + A_Index*50, 300
            Sleep, 1000
            
            ; Reset trap
            Click, 620, 290 ; Box trap from inv
            Click, % 300 + A_Index*50, 300
            Sleep, 600
        }
        else if (trapColor = 0x808080) {
            ; Trap has fallen
            Click, % 300 + A_Index*50, 300
            Sleep, 600
        }
    }
    Sleep, 3000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000)
    },

    // Firemaking
    {
      id: "23",
      name: "Wintertodt Helper",
      description: "Complete Wintertodt minigame automation with fletching and healing.",
      category: "firemaking",
      author: "PyroMancer",
      executionCount: 6789,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      code: `; Wintertodt Helper v3.9
#NoEnv
SendMode Input

global state := "chopping"

F1::
Loop {
    if (state = "chopping") {
        ; Chop bruma roots
        Click, 350, 280
        Sleep, 3000
        
        ; Check inventory
        PixelGetColor, invColor, 700, 400
        if (invColor = 0x00FF00) {
            state := "fletching"
        }
    }
    else if (state = "fletching") {
        ; Fletch roots
        Click, 620, 290 ; Knife
        Click, 660, 290 ; Root
        Sleep, 500
        Send, {Space}
        Sleep, 15000
        state := "burning"
    }
    else if (state = "burning") {
        ; Feed brazier
        Click, 450, 320
        Sleep, 2000
        
        ; Check HP
        PixelGetColor, hpColor, 560, 85
        if (hpColor = 0xFF0000) {
            Click, 700, 430 ; Food
            Sleep, 600
        }
        state := "chopping"
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 155 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
    },

    // Minigames
    {
      id: "24",
      name: "Pest Control AFK",
      description: "Semi-AFK Pest Control participation with portal targeting.",
      category: "minigames",
      author: "VoidKnight",
      executionCount: 4234,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      code: `; Pest Control AFK v2.5
#NoEnv
SendMode Input

F1::
Loop {
    ; Attack portal
    Click, 400, 300
    Sleep, 5000
    
    ; Move to stay active
    Random, moveX, 300, 500
    Random, moveY, 250, 350
    Click, %moveX%, %moveY%
    Sleep, 3000
    
    ; Attack spinners if visible
    PixelSearch, spinX, spinY, 200, 200, 600, 400, 0x00FF00
    if (!ErrorLevel) {
        Click, %spinX%, %spinY%
        Sleep, 4000
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: "25",
      name: "Guardians of the Rift",
      description: "Automated Guardians of the Rift minigame with essence mining and crafting.",
      category: "minigames",
      author: "RiftRunner",
      executionCount: 2890,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      code: `; Guardians of the Rift v2.3
#NoEnv
SendMode Input

global phase := "mining"

F1::
Loop {
    if (phase = "mining") {
        ; Mine guardian fragments
        Click, 380, 290
        Sleep, 5000
        
        ; Check inventory
        PixelGetColor, invFull, 700, 400
        if (invFull = 0xFFFF00) {
            phase := "crafting"
        }
    }
    else if (phase = "crafting") {
        ; Run to altar
        Click, 500, 250
        Sleep, 3000
        
        ; Craft essence
        Click, 450, 320
        Sleep, 2000
        
        ; Deposit runes
        Click, 400, 350
        Sleep, 1000
        
        phase := "mining"
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000)
    },

    // PvP
    {
      id: "26",
      name: "LMS Quick Prayers",
      description: "Last Man Standing quick prayer and gear switching for PvP.",
      category: "pvp",
      author: "PKGod",
      executionCount: 5432,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      code: `; LMS Quick Prayers v3.1
#NoEnv
SendMode Input

; Tribrid switch
F1::
Click, 580, 250 ; Mystic
Click, 620, 250
Click, 660, 250
Send, {F5} ; Augury
return

F2::
Click, 580, 290 ; Range
Click, 620, 290  
Click, 660, 290
Send, {F6} ; Rigour
return

F3::
Click, 580, 330 ; Melee
Click, 620, 330
Click, 660, 330
Send, {F7} ; Piety
return

; Spec weapons
F4::
Click, 700, 250 ; AGS
Send, {Ctrl} ; Spec
return

F5::ExitApp`,
      createdAt: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "27",
      name: "Vorkath Helper",
      description: "Vorkath boss helper with acid walk and prayer switching.",
      category: "pvp",
      author: "BossSlayer",
      executionCount: 3876,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      code: `; Vorkath Helper v2.7
#NoEnv
SendMode Input

; Acid phase walk
F1::
Loop, 6 {
    Click, 350, 300
    Sleep, 600
    Click, 450, 300
    Sleep, 600
}
return

; Prayer switches
F2::
Send, {F5} ; Protect from Magic
return

F3::
Send, {F6} ; Protect from Range
return

; Spawn killer
F4::
Click, 620, 290 ; Slayer staff
Sleep, 100
Click, 400, 320 ; Spawn
Sleep, 100
Click, 660, 290 ; Blowpipe back
return

F5::ExitApp`,
      createdAt: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000)
    },

    // Banking
    {
      id: "28",
      name: "Quick Banking Pro",
      description: "Lightning fast banking with preset withdrawals and deposits.",
      category: "banking",
      author: "BankStander",
      executionCount: 7654,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 30 * 60 * 1000),
      code: `; Quick Banking Pro v3.5
#NoEnv
SendMode Input

; Deposit all
F1::
Click, 450, 430
return

; Deposit inventory
F2::
Click, 420, 430
return

; Withdraw preset 1
F3::
Click, Right, 100, 100
Click, 100, 180 ; Load preset
return

; Quick deposit and withdraw
F4::
Click, 420, 430 ; Deposit inv
Sleep, 200
Click, 100, 150 ; Item 1
Click, 150, 150 ; Item 2
Send, {Esc}
return

F5::ExitApp`,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000)
    },

    // Utility
    {
      id: "29",
      name: "Drop All Items",
      description: "Quickly drop all items in inventory with customizable patterns.",
      category: "utility",
      author: "UtilityMaster",
      executionCount: 9876,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      code: `; Drop All Items v2.0
#NoEnv
SendMode Input

; Drop all
F1::
Send, {Shift down}
Loop, 28 {
    x := 580 + Mod(A_Index-1, 4) * 42
    y := 250 + ((A_Index-1) // 4) * 36
    Click, %x%, %y%
    Sleep, 50
}
Send, {Shift up}
return

; Drop pattern: Snake
F2::
Send, {Shift down}
pattern := [1,2,3,4,8,7,6,5,9,10,11,12,16,15,14,13,17,18,19,20,24,23,22,21,25,26,27,28]
for i, slot in pattern {
    x := 580 + Mod(slot-1, 4) * 42
    y := 250 + ((slot-1) // 4) * 36
    Click, %x%, %y%
    Sleep, 50
}
Send, {Shift up}
return

F3::ExitApp`,
      createdAt: new Date(Date.now() - 185 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000)
    },
    {
      id: "30",
      name: "Camera Rotation Helper",
      description: "Automatic camera rotation and positioning for optimal viewing angles.",
      category: "utility",
      author: "CameraMan",
      executionCount: 4321,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      code: `; Camera Rotation Helper v1.5
#NoEnv
SendMode Input

; Rotate camera 360
F1::
Loop, 8 {
    Send, {Left}
    Sleep, 500
}
return

; Top-down view
F2::
Send, {Up 5}
return

; Ground level view
F3::
Send, {Down 5}
return

; North orientation
F4::
Click, 550, 20 ; Compass
return

F5::ExitApp`,
      createdAt: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
    },

    // Additional specialized scripts
    {
      id: "31",
      name: "Nightmare Zone AFK",
      description: "AFK Nightmare Zone with absorption and overload management.",
      category: "combat",
      author: "NMZPro",
      executionCount: 6234,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      code: `; Nightmare Zone AFK v4.0
#NoEnv
SendMode Input

global absorptionTimer := 0
global overloadTimer := 0

F1::
Loop {
    ; Drink overload every 5 mins
    overloadTimer++
    if (overloadTimer >= 300) {
        Click, 620, 430 ; Overload
        overloadTimer := 0
    }
    
    ; Drink absorption
    absorptionTimer++
    if (absorptionTimer >= 60) {
        Loop, 3 {
            Click, 660, 430 ; Absorption
            Sleep, 500
        }
        absorptionTimer := 0
    }
    
    ; Flick rapid heal
    Send, {F8}
    Sleep, 50
    Send, {F8}
    
    Sleep, 55000 ; Wait ~1 minute
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 195 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "32",
      name: "Birdhouse Run Quick",
      description: "Complete birdhouse run with automatic teleports and seed collection.",
      category: "hunter",
      author: "BirdMan",
      executionCount: 2987,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      code: `; Birdhouse Run Quick v2.1
#NoEnv
SendMode Input

F1::
locations := ["Valley", "Meadow", "Grove", "Swamp"]

for i, loc in locations {
    ; Teleport to location
    Send, {F%i%}
    Sleep, 3000
    
    ; Empty birdhouse
    Click, 400, 300
    Sleep, 1500
    
    ; Pick up seeds
    Click, 420, 320
    Sleep, 500
    
    ; Build new house
    Click, 620, 290 ; Logs
    Click, 400, 300
    Sleep, 1000
    
    ; Add seeds
    Click, 660, 290
    Click, 400, 300
    Sleep, 500
}

; Return to bank
Send, {F9}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: "33",
      name: "Tempoross Fisher",
      description: "Tempoross minigame automation with cooking and repairing.",
      category: "minigames",
      author: "TempMaster",
      executionCount: 3456,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      code: `; Tempoross Fisher v2.5
#NoEnv
SendMode Input

global phase := "fishing"

F1::
Loop {
    if (phase = "fishing") {
        Click, 380, 300 ; Fishing spot
        Sleep, 5000
        
        PixelGetColor, invFull, 700, 400
        if (invFull = 0xFFFF00) {
            phase := "cooking"
        }
    }
    else if (phase = "cooking") {
        Click, 450, 280 ; Shrine
        Sleep, 3000
        phase := "loading"
    }
    else if (phase = "loading") {
        Click, 500, 320 ; Ammo crate
        Sleep, 2000
        
        Click, 420, 340 ; Cannon
        Sleep, 1000
        phase := "fishing"
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: "34",
      name: "Mahogany Homes Helper",
      description: "Mahogany Homes construction contracts with automatic navigation.",
      category: "construction",
      author: "HomesHelper",
      executionCount: 2345,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      code: `; Mahogany Homes Helper v1.8
#NoEnv
SendMode Input

F1::
Loop {
    ; Get contract
    Click, 400, 300 ; Amy
    Sleep, 1000
    Send, {1} ; Get contract
    Sleep, 1000
    
    ; Teleport to house
    Send, {F6}
    Sleep, 3000
    
    ; Fix furniture
    Loop, 5 {
        PixelSearch, furX, furY, 200, 200, 600, 400, 0xFF8800
        if (!ErrorLevel) {
            Click, %furX%, %furY%
            Sleep, 2000
            Send, {1} ; Repair
            Sleep, 1500
        }
    }
    
    ; Return for payment
    Send, {F7}
    Sleep, 3000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: "35",
      name: "Cannonball Maker",
      description: "AFK cannonball making at Edgeville furnace with banking.",
      category: "smithing",
      author: "CannonSmith",
      executionCount: 3789,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      code: `; Cannonball Maker v2.2
#NoEnv
SendMode Input

F1::
Loop {
    ; Bank
    Click, 392, 285
    Sleep, 1000
    
    ; Withdraw steel bars
    Click, 100, 150
    Send, {Esc}
    
    ; Use furnace
    Click, 450, 320
    Sleep, 1500
    
    ; Make cannonballs
    Send, {Space}
    
    ; Wait for completion (2.5 mins)
    Sleep, 150000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "36",
      name: "Tithe Farm Pro",
      description: "Tithe Farm minigame with 20x5 pattern and water management.",
      category: "farming",
      author: "TitheMaster",
      executionCount: 1876,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
      code: `; Tithe Farm Pro v2.0
#NoEnv
SendMode Input

F1::
; Plant seeds in 20x5 pattern
Loop, 5 {
    row := A_Index
    Loop, 20 {
        ; Plant seed
        Click, % 300 + A_Index*15, % 250 + row*15
        Sleep, 100
    }
    
    ; Water row
    Loop, 20 {
        Click, 620, 430 ; Watering can
        Click, % 300 + A_Index*15, % 250 + row*15
        Sleep, 100
    }
}

; Wait for growth and harvest
Sleep, 120000

Loop, 100 {
    Click, % 300 + Mod(A_Index, 20)*15, % 250 + (A_Index//20)*15
    Sleep, 200
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: "37",
      name: "Volcanic Mine Helper",
      description: "Volcanic Mine with boulder mining and vent fixing.",
      category: "mining",
      author: "VolcanicPro",
      executionCount: 2134,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
      code: `; Volcanic Mine Helper v1.9
#NoEnv
SendMode Input

F1::
Loop {
    ; Mine boulder
    Click, 400, 300
    Sleep, 8000
    
    ; Check for vents
    PixelSearch, ventX, ventY, 200, 200, 600, 400, 0xFF0000
    if (!ErrorLevel) {
        Click, %ventX%, %ventY%
        Sleep, 3000
    }
    
    ; Check stability
    PixelGetColor, stability, 100, 50
    if (stability < 0x808080) {
        ; Fix platform
        Click, 450, 350
        Sleep, 2000
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    },
    {
      id: "38",
      name: "Hallowed Sepulchre Runner",
      description: "Hallowed Sepulchre agility with trap dodging patterns.",
      category: "agility",
      author: "SepulchreKing",
      executionCount: 1543,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 13 * 60 * 60 * 1000),
      code: `; Hallowed Sepulchre Runner v1.6
#NoEnv
SendMode Input

F1::
Loop {
    ; Floor 1 pattern
    Click, 400, 300
    Sleep, 2000
    Click, 450, 280
    Sleep, 1800
    
    ; Dodge arrows
    Send, {Space}
    Sleep, 600
    
    ; Continue path
    Click, 500, 320
    Sleep, 2500
    
    ; Loot coffin
    Click, 420, 340
    Sleep, 1500
    
    ; Next floor
    Click, 480, 300
    Sleep, 3000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
    },
    {
      id: "39",
      name: "Zalcano Helper",
      description: "Zalcano boss fight with mining, smithing, and throwing.",
      category: "mining",
      author: "ZalcanoSlayer",
      executionCount: 2876,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      code: `; Zalcano Helper v2.3
#NoEnv
SendMode Input

global phase := "mining"

F1::
Loop {
    if (phase = "mining") {
        Click, 380, 290 ; Glowing rock
        Sleep, 5000
        
        if (A_Index >= 3) {
            phase := "refining"
        }
    }
    else if (phase = "refining") {
        Click, 450, 320 ; Furnace
        Sleep, 3000
        phase := "throwing"
    }
    else if (phase = "throwing") {
        Loop, 10 {
            Click, 400, 250 ; Zalcano
            Sleep, 600
        }
        phase := "mining"
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "40",
      name: "Slayer Task Helper",
      description: "General slayer task helper with prayer and potion management.",
      category: "combat",
      author: "SlayerMaster",
      executionCount: 4567,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      code: `; Slayer Task Helper v3.2
#NoEnv
SendMode Input

global potionTimer := 0

F1::
Loop {
    ; Attack monster
    Click, 400, 300
    Sleep, 2000
    
    ; Loot
    Loop, 3 {
        PixelSearch, lootX, lootY, 350, 250, 450, 350, 0xFFFF00
        if (!ErrorLevel) {
            Click, %lootX%, %lootY%
            Sleep, 600
        }
    }
    
    ; Drink potions
    potionTimer++
    if (potionTimer >= 60) {
        Click, 620, 430 ; Super combat
        potionTimer := 0
    }
    
    ; Prayer check
    PixelGetColor, prayerColor, 540, 100
    if (prayerColor < 0x404040) {
        Click, 660, 430 ; Prayer potion
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "41",
      name: "Barrows Helper",
      description: "Barrows minigame with tunnel navigation and prayer switching.",
      category: "combat",
      author: "BarrowsBro",
      executionCount: 3234,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      code: `; Barrows Helper v2.8
#NoEnv
SendMode Input

; Brother rotations
F1::Send, {F5}  ; Dharok - Protect Melee
F2::Send, {F6}  ; Ahrim - Protect Magic
F3::Send, {F7}  ; Karil - Protect Range

; Tunnel navigation
F4::
Loop {
    ; Search for door
    PixelSearch, doorX, doorY, 200, 200, 600, 400, 0x404040
    if (!ErrorLevel) {
        Click, %doorX%, %doorY%
        Sleep, 2000
    }
    
    ; Attack monsters
    Click, 400, 300
    Sleep, 3000
}
return

F5::Pause
F6::ExitApp`,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: "42",
      name: "Zulrah Rotation Helper",
      description: "Zulrah boss fight with phase indicators and positioning.",
      category: "combat",
      author: "SnakeSlayer",
      executionCount: 2987,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      code: `; Zulrah Rotation Helper v3.0
#NoEnv
SendMode Input

; Rotation 1
F1::
MsgBox, Green -> Red -> Blue -> Green
return

; Rotation 2
F2::
MsgBox, Green -> Blue -> Red -> Blue
return

; Phase switches
F3::
Click, 580, 250 ; Range gear
Send, {F6} ; Eagle Eye
return

F4::
Click, 620, 250 ; Mage gear
Send, {F7} ; Mystic Might
return

; Jad phase helper
F5::
Send, {F8} ; Start with Mage pray
Sleep, 2000
Send, {F9} ; Switch to Range
return

F6::ExitApp`,
      createdAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: "43",
      name: "Inferno Wave Helper",
      description: "Inferno wave management with prayer flicking and safespotting.",
      category: "combat",
      author: "InfernoCape",
      executionCount: 876,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      code: `; Inferno Wave Helper v1.5
#NoEnv
SendMode Input

; Prayer flicks
F1::
Loop {
    Send, {F5} ; Protect Range
    Sleep, 600
    Send, {F6} ; Protect Mage
    Sleep, 600
}
return

; Blob flicking
F2::
Loop, 3 {
    Send, {F7} ; Protect Melee
    Sleep, 1200
    Send, {F7} ; Off
    Sleep, 100
}
return

; Zuk prayer
F3::Send, {F8}  ; Protect Range for Zuk

; Healer tagging
F4::
positions := [[450,300], [470,320], [430,280], [490,340]]
for i, pos in positions {
    Click, pos[1], pos[2]
    Sleep, 800
}
return

F5::ExitApp`,
      createdAt: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
    },
    {
      id: "44",
      name: "Corrupted Gauntlet Helper",
      description: "Corrupted Gauntlet prep and boss fight assistance.",
      category: "minigames",
      author: "GauntletGod",
      executionCount: 1234,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      code: `; Corrupted Gauntlet Helper v2.0
#NoEnv
SendMode Input

; Resource gathering
F1::
Loop {
    ; Fish
    Click, 380, 300
    Sleep, 3000
    
    ; Mine
    Click, 420, 320
    Sleep, 3000
    
    ; Woodcut
    Click, 460, 340
    Sleep, 3000
}
return

; Boss prayers
F2::Send, {F5}  ; Protect Range
F3::Send, {F6}  ; Protect Mage
F4::Send, {F7}  ; Protect Melee

; Tornado dodge
F5::
Click, 500, 250
Sleep, 600
Click, 350, 350
return

F6::ExitApp`,
      createdAt: new Date(Date.now() - 66 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: "45",
      name: "Pyramid Plunder Runner",
      description: "Pyramid Plunder thieving with room clearing optimization.",
      category: "thieving",
      author: "PyramidKing",
      executionCount: 2345,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      code: `; Pyramid Plunder Runner v2.5
#NoEnv
SendMode Input

F1::
Loop {
    ; Search urns
    Loop, 8 {
        Click, % 350 + A_Index*20, 300
        Sleep, 800
    }
    
    ; Check sarcophagus
    Click, 450, 320
    Sleep, 2000
    
    ; Loot chest
    Click, 400, 350
    Sleep, 1500
    
    ; Next room
    Click, 500, 280
    Sleep, 2000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "46",
      name: "Aerial Fishing Pro",
      description: "Aerial fishing on Molch Island with bird catching.",
      category: "fishing",
      author: "AerialAce",
      executionCount: 1876,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
      code: `; Aerial Fishing Pro v1.7
#NoEnv
SendMode Input

F1::
Loop {
    ; Catch fish
    Click, 400, 300
    Sleep, 2000
    
    ; Cut fish
    Click, 620, 290 ; Knife
    Click, 660, 290 ; Fish
    Sleep, 1000
    
    ; Use on bird
    Click, 660, 330 ; Bait
    Click, 420, 280 ; Bird
    Sleep, 1500
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
    },
    {
      id: "47",
      name: "Soul Wars Helper",
      description: "Soul Wars minigame with fragment collection and avatar assistance.",
      category: "minigames",
      author: "SoulWarrior",
      executionCount: 2134,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
      code: `; Soul Wars Helper v2.1
#NoEnv
SendMode Input

F1::
Loop {
    ; Collect fragments
    Click, 380, 290
    Sleep, 3000
    
    ; Bank fragments
    Click, 450, 320
    Sleep, 1000
    
    ; Attack enemies
    Click, 400, 300
    Sleep, 4000
}
return

; Barricade placement
F2::
Click, 620, 430 ; Barricade
Click, 400, 320 ; Place
return

F3::Pause
F4::ExitApp`,
      createdAt: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    },
    {
      id: "48",
      name: "Giants Foundry Helper",
      description: "Giants Foundry smithing minigame with heat management.",
      category: "smithing",
      author: "FoundryForge",
      executionCount: 1567,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      code: `; Giants Foundry Helper v1.9
#NoEnv
SendMode Input

F1::
Loop {
    ; Heat metal
    Click, 380, 300 ; Lava
    Sleep, 3000
    
    ; Hammer
    Click, 420, 320 ; Anvil
    Sleep, 4000
    
    ; Cool
    Click, 460, 340 ; Waterfall
    Sleep, 2000
    
    ; Grind
    Click, 400, 360 ; Grindstone
    Sleep, 3500
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: "49",
      name: "Blood Runecrafting",
      description: "Blood runecrafting at Arceuus with essence mining.",
      category: "runecrafting",
      author: "BloodCrafter",
      executionCount: 3421,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      code: `; Blood Runecrafting v3.0
#NoEnv
SendMode Input

F1::
Loop {
    ; Mine essence
    Loop, 5 {
        Click, 380, 300
        Sleep, 8000
    }
    
    ; Run to altar
    Click, 500, 250
    Sleep, 15000
    
    ; Craft bloods
    Click, 450, 320
    Sleep, 2000
    
    ; Run back
    Click, 350, 400
    Sleep, 15000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 76 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "50",
      name: "Drift Net Fishing",
      description: "Underwater drift net fishing with stamina management.",
      category: "fishing",
      author: "DriftMaster",
      executionCount: 1234,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      code: `; Drift Net Fishing v2.0
#NoEnv
SendMode Input

F1::
Loop {
    ; Set net
    Click, 400, 300
    Sleep, 1000
    
    ; Chase fish
    Loop, 10 {
        Click, 450, 320
        Sleep, 500
    }
    
    ; Collect net
    Click, 400, 300
    Sleep, 1500
    
    ; Check stamina
    PixelGetColor, stamColor, 560, 120
    if (stamColor < 0x404040) {
        Click, 620, 430 ; Stamina pot
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000)
    },
    {
      id: "51",
      name: "Sacred Eel Fisher",
      description: "Sacred eel fishing with automatic cooking at Zul-Andra.",
      category: "fishing",
      author: "SacredFisher",
      executionCount: 2876,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      code: `; Sacred Eel Fisher v1.8
#NoEnv
SendMode Input

F1::
Loop {
    ; Fish eels
    Click, 400, 300
    Sleep, Random(2800, 3200)
    
    ; Check inventory
    PixelGetColor, invCheck, 700, 400
    if (invCheck = 0xFFFF00) {
        ; Use knife on eels
        Click, 620, 290
        Loop, 28 {
            Click, % 580 + Mod(A_Index-1, 4) * 42, % 250 + ((A_Index-1) // 4) * 36
            Sleep, 100
        }
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "52",
      name: "Minnow Fisher Ultra",
      description: "Minnow fishing with moving spot tracking on Fishing Platform.",
      category: "fishing",
      author: "MinnowMan",
      executionCount: 1987,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 13 * 60 * 60 * 1000),
      code: `; Minnow Fisher Ultra v2.3
#NoEnv
SendMode Input

global spotTimer := 0

F1::
Loop {
    ; Find fishing spot
    PixelSearch, spotX, spotY, 200, 200, 600, 400, 0x00FFFF
    if (!ErrorLevel) {
        Click, %spotX%, %spotY%
    }
    
    spotTimer++
    
    ; Spot moves every 15 seconds
    if (spotTimer >= 15) {
        spotTimer := 0
        Sleep, 500
        ; Re-find spot
    }
    
    Sleep, 1000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
    },
    {
      id: "53",
      name: "Anglerfish Banker",
      description: "Anglerfish fishing with banking at Port Piscarilius.",
      category: "fishing",
      author: "AnglerPro",
      executionCount: 3456,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      code: `; Anglerfish Banker v2.7
#NoEnv
SendMode Input

F1::
Loop {
    ; Fish anglerfish
    Loop, 28 {
        Click, 400, 300
        Random, wait, 3000, 5000
        Sleep, %wait%
    }
    
    ; Bank
    Click, 520, 250 ; Run to bank
    Sleep, 8000
    Click, 392, 285 ; Bank
    Sleep, 1000
    Click, 450, 430 ; Deposit all
    Sleep, 500
    Send, {Esc}
    
    ; Return to spot
    Click, 350, 400
    Sleep, 8000
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: "54",
      name: "Dark Crab Fisher",
      description: "Dark crab fishing in Wilderness Resource Area with PKer detection.",
      category: "fishing",
      author: "WildyFisher",
      executionCount: 987,
      isFavorite: 0,
      lastExecutedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      code: `; Dark Crab Fisher v1.5
#NoEnv
SendMode Input

F1::
Loop {
    ; Fish dark crabs
    Click, 400, 300
    Sleep, 4000
    
    ; Check for white dots (PKers)
    PixelSearch, pkerX, pkerY, 550, 50, 650, 150, 0xFFFFFF
    if (!ErrorLevel) {
        ; Emergency teleport
        Click, 620, 430 ; Teleport tab
        MsgBox, PKer detected! Teleported to safety.
        break
    }
    
    ; Note crabs with Piles
    if (Mod(A_Index, 7) == 0) {
        Click, 660, 290 ; Dark crab
        Click, 450, 350 ; Piles
    }
}
return

F2::Pause
F3::ExitApp`,
      createdAt: new Date(Date.now() - 86 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
    },
    {
      id: "55",
      name: "Chambers of Xeric Helper",
      description: "CoX raid helper with room navigation and boss mechanics.",
      category: "combat",
      author: "RaidMaster",
      executionCount: 2345,
      isFavorite: 1,
      lastExecutedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      code: `; Chambers of Xeric Helper v3.5
#NoEnv
SendMode Input

; Olm head movements
F1::
MsgBox, Middle -> West -> Middle -> East -> Repeat
return

; Olm prayers
F2::Send, {F5}  ; Protect from Missiles
F3::Send, {F6}  ; Protect from Magic

; 4:1 method
F4::
Loop {
    Click, 400, 300 ; Attack
    Sleep, 600
    Click, 450, 320 ; Move
    Sleep, 600
    Click, 400, 300 ; Attack
    Sleep, 600
    Click, 380, 340 ; Move
    Sleep, 600
}
return

F5::Pause
F6::ExitApp`,
      createdAt: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ];

  try {
    // Clear existing scripts first
    await db.delete(scripts);
    console.log("Cleared existing scripts");

    // Insert all scripts
    for (const script of sampleScripts) {
      await db.insert(scripts).values(script);
    }
    console.log(`Successfully inserted ${sampleScripts.length} scripts`);

    // Add sample news articles
    const sampleNews = [
      {
        id: "news1",
        title: "New AutoHotkey Scripts Added!",
        content: "We've just added 50+ new scripts to help you master Old School RuneScape. Check out our latest additions in all skill categories including combat, skilling, and minigames. These scripts are designed to enhance your gameplay experience while maintaining safety and efficiency.",
        summary: "Over 50 new AutoHotkey scripts added for OSRS players",
        source: "community",
        category: "update",
        imageUrl: "/osrs-news-1.jpg",
        publishedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: "news2", 
        title: "Wintertodt Script Updated",
        content: "The popular Wintertodt Helper script has been updated to v3.9 with improved fletching and healing mechanics. The new version includes better HP detection, automatic food eating, and more efficient brazier feeding patterns.",
        summary: "Wintertodt Helper script updated to v3.9 with improvements",
        source: "update page",
        category: "patch",
        imageUrl: "/osrs-news-2.jpg",
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }
    ];

    await db.delete(newsArticles);
    for (const article of sampleNews) {
      await db.insert(newsArticles).values(article);
    }
    console.log(`Successfully inserted ${sampleNews.length} news articles`);

    // Add system stats
    const stats = {
      id: "stats1",
      cpuUsage: 43, // integer percentage
      gpuUsage: 65, // integer percentage
      ramUsage: 68, // integer percentage
      fps: 50,
      timestamp: new Date(),
    };

    await db.delete(systemStats);
    await db.insert(systemStats).values(stats);
    console.log("Successfully inserted system stats");

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("Seeding completed successfully");
  process.exit(0);
}).catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});