# Enterprise Integration Guide

> This directory will contain Enterprise Edition modules and integration tooling.

## Planned Capabilities

### 1. Custom Scenario Injection
Enterprise customers will be able to define custom scenarios in JSON format and load them dynamically. The scenario schema follows the same structure as community scenarios with additional fields:

```json
{
  "id": "custom-scenario-1",
  "title": "Custom DB Failover",
  "edition": "enterprise",
  "orgId": "denizbank",
  "commands": { ... },
  "scoring": { ... }
}
```

### 2. Infrastructure Integration
- Connect to real Kubernetes clusters (read-only)
- Mirror actual pod/node state into scenarios
- Import real alert patterns from Prometheus/Grafana

### 3. Deployment Options
- Docker Compose (self-hosted)
- Air-gapped installation (no internet required)
- Reverse proxy compatible (nginx, traefik)

### 4. API Endpoints (Planned)
```
POST /api/scenarios          — Upload custom scenario
GET  /api/scenarios          — List available scenarios
POST /api/sessions           — Start training session
GET  /api/reports/:userId    — Performance reports
```

## Status: 🔜 Coming Soon
