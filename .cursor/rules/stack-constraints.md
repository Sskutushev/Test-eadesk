# Stack Constraints - Signal Lab

## Required stack (do not replace without explicit justification)

### Frontend
- Framework: Next.js 14+ (App Router)
- UI: shadcn/ui components
- Styling: Tailwind CSS v3+
- State/Fetching: TanStack Query v5
- Forms: React Hook Form + Zod
- Language: TypeScript strict mode

### Backend
- Framework: NestJS
- ORM: Prisma
- Database: PostgreSQL 16+
- Language: TypeScript strict mode

### Observability
- Metrics: prom-client -> Prometheus -> Grafana
- Logs: Winston + winston-loki -> Loki -> Grafana
- Errors: @sentry/node (backend) + @sentry/nextjs (frontend if used)
- Health: @nestjs/terminus

### Infrastructure
- Orchestration: Docker Compose (single command starts everything)
- DB image: postgres:16-alpine
- Node: node:20-alpine

## Forbidden
- Express.js instead of NestJS
- MongoDB/MySQL/SQLite instead of PostgreSQL
- Custom logger instead of Winston
- fetch() directly instead of TanStack Query on the client
- CSS modules/styled-components instead of Tailwind
- any type in TypeScript without explicit justification
