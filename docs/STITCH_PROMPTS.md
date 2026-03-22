# Google Stitch UI Prompt'ları

> Her prompt'u ayrı ayrı Stitch'e yapıştırarak farklı ekranları üretebilirsin.

---

## Prompt 1: Ana Oyun Ekranı (Main Game Screen)

```
Design a dark-themed, cyberpunk-inspired DevOps crisis simulator game interface for a web application called "DevOps Simulator: Outage Crisis".

The screen layout should be a full-screen dashboard with these sections:

TOP BAR:
- Left: Game logo "OUTAGE CRISIS" with a red blinking alert icon
- Center: Current mission name "Mission: Payment Service Down"
- Right: Score counter "Score: 2,450" and a countdown timer "07:23" with red pulsing glow

LEFT PANEL - System Status (20% width):
- Title: "SYSTEM STATUS" with a monitor icon
- Four horizontal progress bars with labels and percentages:
  - CPU: 82% (orange, nearly full)
  - Memory: 64% (yellow)
  - Disk: 94% (red, critical)
  - Network: 38% (green, healthy)
- Below bars: "Pods: 12/15 Running" and "Nodes: 3/3 Ready" with small status dots
- Use neon glow effects on the bars

RIGHT PANEL - Alerts Feed (25% width):
- Title: "ALERTS" with a bell icon
- Scrollable list of alert cards:
  - CRITICAL (red badge): "payment-svc CrashLoopBackOff - 5m ago"
  - WARNING (yellow badge): "Disk /var/lib usage at 94%"
  - INFO (blue badge): "HPA scaling triggered for api-gw"
- Each alert card has a subtle border-left color matching severity
- Newest alerts at the top with a fade-in animation feel

CENTER - Terminal (55% width, main area):
- A realistic terminal emulator with dark background (#0d1117)
- Green/white monospace text (font: JetBrains Mono or Fira Code)
- Terminal prompt showing: "root@bank-ops:~$"
- Sample output showing a kubectl get pods table with columns: NAME, READY, STATUS, RESTARTS, AGE
- One pod in red "CrashLoopBackOff" status, others in green "Running"
- Blinking cursor at the bottom input line
- Terminal should have a subtle scanline overlay effect for retro feel

BOTTOM BAR - Mission Info:
- Left: Mission objective text "🎯 Restore payment-svc within SLA deadline"
- Center: SLA meter showing "Overall SLA: 78.2% | Target: 99.9%" with a progress bar
- Right: "👥 1,247 customers affected" with a warning icon

DESIGN STYLE:
- Dark mode with #0a0e17 background
- Neon accent colors: cyan (#00f5ff) for borders, red (#ff3b3b) for critical alerts, green (#00ff88) for healthy status, amber (#ffaa00) for warnings
- Glassmorphism panels with subtle transparency and blur
- Grid-based layout with thin cyan border lines between sections
- Typography: Sans-serif headers (Inter/Outfit), monospace for terminal
- Subtle grid pattern overlay on background
- The overall feel should be like a military command center or NASA mission control
```

---

## Prompt 2: Ana Menü Ekranı (Main Menu)

```
Design a cinematic main menu screen for a web game called "DevOps Simulator: Outage Crisis".

BACKGROUND:
- Dark server room environment with subtle blue/cyan ambient lighting
- Rows of server racks fading into darkness with blinking LED lights (green and red dots)
- Subtle particle effects or floating data streams in the background
- Dark overlay gradient from bottom

CENTER CONTENT:
- Large game title "DEVOPS SIMULATOR" in bold futuristic font with metallic/chrome text effect
- Subtitle "OUTAGE CRISIS" below in smaller text with red neon glow
- A thin horizontal line separator with a pulse animation

MENU BUTTONS (stacked vertically, centered):
- "🎮 New Game" - Primary button with cyan border and glow
- "📋 Select Scenario" - Secondary button
- "🏆 Leaderboard" - Secondary button
- "⚙️ Settings" - Secondary button
- "📖 How to Play" - Secondary button
- Buttons should have hover glow effect, sharp corners, semi-transparent dark background

BOTTOM:
- Version text "v1.0 | Faz 1" in small grey text
- "Powered by Home Lab" subtle text

DESIGN STYLE:
- Ultra-dark theme (#080c14 background)
- Cyberpunk/military tech aesthetic
- Neon cyan (#00f5ff) as primary accent color
- Red (#ff3b3b) as danger/crisis accent
- Glassmorphism on menu buttons
- The atmosphere should feel tense and urgent, like you're about to enter a crisis situation
```

---

## Prompt 3: Senaryo Seçim Ekranı (Scenario Selection)

```
Design a scenario selection screen for a DevOps crisis simulator game.

LAYOUT:
- Dark themed, consistent with a military/tech command center aesthetic
- Top: "SELECT SCENARIO" title with a back arrow button

SCENARIO CARDS (grid layout, 2 columns):
Each card represents a crisis scenario with:
- Difficulty badge in top-right corner:
  - Green "EASY" for levels 1-2
  - Yellow "MEDIUM" for levels 3-5
  - Red "HARD" for levels 6-8
  - Purple "EXPERT" for levels 9-10
- Scenario icon (relevant to the crisis type)
- Title: e.g., "Pod CrashLoopBackOff", "PVC Disk Full", "Cascading Service Failure"
- Short description (1 line)
- Stats row: "⏱️ 10 min | ⭐ Best: 2,450 | 🏆 3 stars"
- Lock icon overlay on locked scenarios (greyed out)
- Star rating (0-3 stars) below each card showing best performance

VISIBLE SCENARIO CARDS:
1. "Pod CrashLoopBackOff" - EASY - Unlocked - 3 stars earned
2. "PVC Disk Full" - EASY - Unlocked - 2 stars earned
3. "Service Mesh Failure" - MEDIUM - Unlocked - 0 stars (not yet played)
4. "Database Replication Lag" - MEDIUM - Locked
5. "Ingress Controller Down" - MEDIUM - Locked
6. "Full Node Failure" - HARD - Locked

DESIGN:
- Cards have subtle border glow matching difficulty color
- Hover effect: card lifts slightly with enhanced glow
- Dark glassmorphism card backgrounds
- Accent colors: cyan borders, difficulty-colored badges
- Background: same dark server room atmosphere
```

---

## Prompt 4: Skor / Sonuç Ekranı (Score Screen)

```
Design a mission complete score screen for a DevOps crisis simulator game.

LAYOUT - Centered modal/overlay on darkened game background:

TOP:
- Large "🎉 MISSION COMPLETE!" text with golden glow effect
- Or "💀 MISSION FAILED" with red glow (design the success version)

MISSION SUMMARY CARD (centered, large):
- Scenario name: "Payment Service Recovery"
- Difficulty: "⭐ Easy" badge
- Time taken: "03:42 / 10:00" with a circular progress ring
- Star rating: 3 large stars (filled golden stars)

SCORE BREAKDOWN (list with animated counters):
- "✅ Correct Commands: +60 pts" (green)
- "⚡ Speed Bonus: +25 pts" (cyan)  
- "🔍 Root Cause Analysis: +40 pts" (purple)
- "💥 Damage Penalty: -20 pts" (red)
- Horizontal divider line
- "TOTAL: 105 pts" (large, golden, glowing)

PERFORMANCE GRADE:
- Large letter grade "A" or "S" with metallic effect
- Rank title: "Senior SRE" based on performance

BOTTOM BUTTONS (horizontal row):
- "🔄 Retry" - outlined button
- "➡️ Next Scenario" - primary cyan button with glow
- "🏠 Main Menu" - text button

DESIGN:
- Dark overlay background with blur
- Card has glassmorphism effect with dark background
- Golden/amber accents for success elements
- Smooth fade-in animation feel for score items
- Confetti or particle effect suggestion at the top
```

---

## Prompt 5: SLA Dashboard Detay (Opsiyonel - Oyun İçi Popup)

```
Design a detailed SLA monitoring dashboard popup/overlay for a DevOps crisis simulator game.

This appears when the player clicks on the SLA meter during gameplay.

LAYOUT - Floating panel overlay:

HEADER:
- "🏦 BANKING CORE SYSTEMS - SLA MONITOR" in bold
- Real-time clock showing current in-game time

SERVICE STATUS TABLE:
| Service | Status | Uptime | Response Time | SLA Target |
Each row with:
- Service name with colored status dot (green/yellow/red)
- Payment Service: 83% uptime (amber warning) - 340ms response - Target: 99.9%
- Auth Service: 100% uptime (green) - 45ms response - Target: 99.5%
- Core Banking: 58% uptime (red critical) - timeout - Target: 99.9%
- Mobile API: 75% uptime (amber) - 890ms response - Target: 99.0%

MINI CHARTS (2x2 grid below table):
- Request Rate (line chart style representation)
- Error Rate (area chart, red when high)
- Response Time (line chart with threshold line)
- Active Users (declining bar chart)

BOTTOM:
- Overall SLA: 78.2% with large circular gauge
- "⚠️ SLA Breach in 00:04:12" with red pulsing text
- Customer impact counter: "1,247 affected"

DESIGN:
- Glassmorphism floating panel
- Dark theme consistent with main game
- Data visualization with neon colors
- Red pulsing animations for critical metrics
- Close button (X) in top-right corner
```

---

## 💡 Stitch Kullanım İpuçları

1. **Her prompt'u tek tek dene** - Stitch'e her seferinde bir prompt yapıştır
2. **İterasyon yap** - Beğenmediğin kısımları "Make the terminal bigger" gibi follow-up prompt'larla düzelt
3. **Export et** - Beğendiğin tasarımı PNG/SVG olarak kaydet, implementasyonda referans olarak kullan
4. **Renk paleti tutarlılığı** - Tüm ekranlarda aynı renkleri kullan:
   - Background: `#0a0e17`
   - Cyan accent: `#00f5ff`
   - Red critical: `#ff3b3b`
   - Green healthy: `#00ff88`
   - Amber warning: `#ffaa00`
   - Text: `#e0e0e0`
