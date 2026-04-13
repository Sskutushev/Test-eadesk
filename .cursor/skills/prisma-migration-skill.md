---
name: prisma-migration-skill
description: Use when making changes to database schema (tables, fields, enums)
---

# Prisma Migration Skill

## Workflow

### Local development
```bash
cd backend
npx prisma migrate dev --name <change_name>
npx prisma generate
npm run start:dev
```

### Reset database (if migrations conflict)
```bash
docker compose down -v
docker compose up -d postgres
cd backend
npx prisma migrate dev
docker compose up -d
```

### Production (Docker)
The Dockerfile runs `npx prisma migrate deploy` before app start.

## Common errors

### "There is already a migration with that name"
Rename the migration or delete the folder under prisma/migrations/

### "Column X does not exist"
Run `npx prisma generate` after schema changes

### "Migration failed"
Validate schema: `npx prisma validate`
