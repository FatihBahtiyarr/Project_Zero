# Incident Zero — DevOps Crisis Simulator

> Master Kubernetes incident response through realistic, hands-on crisis simulations.

## 🎮 About

Incident Zero is a browser-based DevOps training simulator where you step into the role of an SRE managing a bank's Kubernetes infrastructure. Resolve realistic outages using actual `kubectl` commands while racing against the clock to maintain SLA targets.

## 🚀 Quick Start

```bash
# Serve locally (any static file server works)
npx serve . -p 3000

# Open in browser
open http://localhost:3000
```

## ✨ Features

| Feature | Community (Free) | Enterprise |
|---------|:-:|:-:|
| Core game engine | ✅ | ✅ |
| Community scenarios | ✅ | ✅ |
| Scoring & ranking | ✅ | ✅ |
| Custom org scenarios | ❌ | ✅ |
| Infrastructure integration | ❌ | ✅ |
| AI-powered responses (Ollama) | ❌ | ✅ |
| Admin panel & reporting | ❌ | ✅ |
| Private deployment | ❌ | ✅ |

## 🎯 Available Scenarios

### Community Edition
1. **Pod CrashLoopBackOff** (Easy) — Fix an OOMKilled payment service
2. **PVC Disk Full** (Easy) — Clear disk pressure on a node

### Coming Soon
- Service Mesh Failure (Medium)
- Database Replication Lag (Medium)
- Ingress Controller Down (Medium)
- Full Node Failure (Hard)

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **Fonts:** Space Grotesk, Inter, JetBrains Mono
- **Icons:** Material Symbols
- **AI (Phase 2):** Ollama (Llama 3 / Mistral) via local API

## 📁 Project Structure

```
Incident-Zero/
├── index.html              # SPA entry point (5 screens)
├── css/styles.css           # Design system & effects
├── js/
│   ├── scenarios.js         # Scenario definitions
│   ├── engine.js            # Game engine (timer, scoring, terminal)
│   └── app.js               # Router & event bindings
├── docs/
│   ├── GAME_CONCEPT.md      # Full game concept document
│   └── ROADMAP.md           # Development roadmap
└── enterprise/
    └── README.md            # Enterprise integration guide
```

## 📄 License

© 2026 Incident Zero. All rights reserved.
