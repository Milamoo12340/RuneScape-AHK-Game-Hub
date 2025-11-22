# OSRS Gaming Hub - Design Guidelines

## Design Approach: Gaming Experience Reference

**Primary References**: Discord, GeForce Experience, Steam, Epic Games Launcher, Riot Client
**Core Principle**: Immersive gaming command center with OSRS-themed visual identity

## Typography System

**Font Stack**:
- Primary: 'Inter' or 'Rajdhani' (gaming-appropriate, modern)
- Accent/Headers: 'Orbitron' or 'Exo 2' (tech/gaming aesthetic)
- Code: 'JetBrains Mono' (for AutoHotkey script display)

**Hierarchy**:
- Hero/Main Headers: 2xl-4xl, bold/black weight, uppercase tracking
- Section Headers: xl-2xl, semibold, normal case
- Body Text: base-lg, medium weight, increased line-height (1.6)
- Stats/Numbers: lg-xl, bold, tabular numerals
- Code Snippets: sm-base, monospace

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing: p-2, gap-2 (within cards)
- Standard spacing: p-4, m-6, gap-4 (between elements)
- Section spacing: p-8, py-12, gap-8 (major sections)
- Page margins: p-6 to p-16 (responsive)

**Grid Structure**:
- Sidebar navigation: Fixed 64-80 width on desktop, collapsible on mobile
- Main content area: Flexible, max-w-7xl container
- Dashboard widgets: 2-4 column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Script library: 3-column masonry/grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

## Component Library

### Navigation
- **Sidebar**: Fixed dark panel with glassmorphism overlay, vertical icon navigation with labels, active state with gradient border-left accent
- **Top Bar**: Transparent with blur backdrop, contains search, notifications, user profile
- **Quick Actions**: Floating action buttons for common tasks (new script, launch game)

### Dashboard Widgets
- **Stat Cards**: Glassmorphic containers showing CPU/GPU/FPS with animated progress bars and gradient backgrounds
- **News Feed**: Card-based vertical scroll with thumbnail images, headlines, timestamps
- **Script Activity**: Timeline-style recent scripts with execution status indicators
- **System Monitor**: Real-time graphs with glowing accent lines and grid overlays

### Script Library
- **Script Cards**: Medium-height cards with script icon/category badge, title, description snippet, action buttons, hover elevation
- **Script Viewer**: Full-screen modal with syntax-highlighted code, tabbed interface (code, settings, stats)
- **Category Filters**: Horizontal pill navigation with active state glow

### AI Script Generator
- **Chat Interface**: Discord-like message bubbles, AI responses in contrasting containers
- **Template Selector**: Grid of OSRS activity cards (fishing, combat, agility) with preview images
- **Code Output**: Expandable panel with copy/download/save actions

### Game Launcher
- **Hero Section**: Large OSRS banner image with glassmorphic overlay, prominent "Launch Game" button with pulsing glow effect
- **Quick Launch Bar**: Horizontal row of circular game/tool icons with labels

### Notifications
- **Toast System**: Top-right slide-in notifications with category icons, gradient borders
- **Event Cards**: Featured notifications for major OSRS updates with full-width imagery

## Visual Treatment

**Glassmorphism Effects**:
- Background: backdrop-blur-xl with rgba overlays (dark with 60-80% opacity)
- Borders: 1px solid rgba(255,255,255,0.1)
- Card shadows: Multi-layer soft shadows with glow on hover

**Gradient Accents**:
- Primary gradient: Teal-to-purple diagonal (OSRS magic aesthetic)
- Secondary: Gold-to-orange (OSRS treasure/rare items)
- Apply to buttons, progress bars, borders, active states

**Elevation Hierarchy**:
- Base layer: Full-page dark background
- Layer 1: Sidebar and main containers (subtle elevation)
- Layer 2: Cards and widgets (medium elevation with border glow)
- Layer 3: Modals and dropdowns (strong elevation with heavy blur)

## Images

**Hero Banner**: Full-width OSRS landscape scene (Grand Exchange, Lumbridge, or Varrock) with gradient overlay darkening bottom 50%, 400-500px height

**Category Icons**: OSRS skill icons for script categories (fishing rod, sword, pickaxe, etc.)

**News Thumbnails**: OSRS update/event imagery from wiki, 16:9 ratio, 300x169px per card

**Background Ambience**: Subtle animated OSRS-themed particle effects or flowing energy patterns in sidebar/unused spaces

**Script Previews**: Auto-generated thumbnails showing script category iconography

## Interaction Patterns

**Hover States**: Subtle scale (1.02), glow intensification, border brightening
**Active States**: Gradient shift, pressed depth effect
**Loading States**: Skeleton screens with shimmer gradient animation
**Transitions**: 200-300ms ease-out for most interactions, 500ms for major state changes

## Accessibility

- Maintain WCAG AA contrast ratios despite dark theme (use lighter text variants)
- Keyboard navigation with visible focus rings (gradient-based)
- ARIA labels for all interactive gaming-specific elements
- Icon-only buttons include tooltips