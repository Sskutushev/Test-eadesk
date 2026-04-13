---
name: docker-debug-skill
description: Use when containers fail to start, services are unhealthy, or networking issues occur
---

# Docker Debug Skill

## Diagnostics

### Step 1: Container status
```bash
docker compose ps
```

### Step 2: Service logs
```bash
docker compose logs backend --tail=50
docker compose logs postgres --tail=20
docker compose logs loki --tail=20
```

### Step 3: Health checks
```bash
curl http://localhost:3001/health
curl http://localhost:9090/-/healthy
curl http://localhost:3100/ready
```

### Step 4: Networking
```bash
docker compose exec backend wget -qO- http://postgres:5432
docker compose exec backend wget -qO- http://loki:3100/ready
```

## Common fixes

### Backend fails with DB connection error
```bash
docker compose ps postgres
docker compose restart postgres
```

### Prometheus not scraping backend
```bash
open http://localhost:9090/targets
```

### Loki not ingesting logs
```bash
docker compose exec loki cat /etc/loki/local-config.yaml
docker compose restart loki
```

### Nuclear reset
```bash
docker compose down -v
docker system prune -f
docker compose up -d --build
```
