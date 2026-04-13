# Signal Lab — Submission Checklist

Заполни этот файл перед сдачей. Он поможет интервьюеру быстро проверить решение.

## Репозиторий
URL: https://github.com/Sskutushev/Test-eadesk.git
Ветка: main
Время работы (приблизительно): 7 часов

## Запуск
# Команда запуска:
docker compose up -d --build

# Команда проверки:
npm run verify:release
./tests/smoke/smoke-test.sh
./tests/integration/test-observability-pipeline.sh

# Команда остановки:
docker compose down

Предусловия: Docker Desktop 24+, Docker Compose v2, Node.js 20+, npm 10+

## Стек — подтверждение использования
Технология | Используется? | Где посмотреть
---|---|---
Next.js (App Router) | ☑ | frontend/app/page.tsx
shadcn/ui | ☑ | frontend/components/ui/*.tsx
Tailwind CSS | ☑ | frontend/app/globals.css
TanStack Query | ☑ | frontend/app/providers.tsx
React Hook Form | ☑ | frontend/components/scenario-form.tsx
NestJS | ☑ | backend/src/main.ts
PostgreSQL | ☑ | docker-compose.yml
Prisma | ☑ | backend/prisma/schema.prisma
Sentry | ☑ | backend/src/instrument.ts
Prometheus | ☑ | backend/src/observability/prometheus.service.ts
Grafana | ☑ | docker/grafana/dashboards/signal-lab.json
Loki | ☑ | backend/src/observability/logger.service.ts

## Observability Verification
Опиши, как интервьюер может проверить каждый сигнал:

Сигнал | Как воспроизвести | Где посмотреть результат
---|---|---
Prometheus metric | Запустить `system_error` через UI или `POST /api/scenarios` | http://localhost:3001/metrics (метрики `scenario_runs_total`, `scenario_errors_total`, `scenario_duration_seconds`)
Grafana dashboard | Открыть дашборд и запустить любой сценарий | http://localhost:3002/d/signal-lab (панели ошибок, длительности, логов)
Loki log | Запустить `slow_query` или `system_error`, открыть Explore | http://localhost:3002/explore (запрос `{app="signal-lab",scenario="system_error"}`)
Sentry exception | Указать `SENTRY_DSN` в `.env`, запустить `system_error` | Sentry Issues (tag `scenario=system_error`)

## Cursor AI Layer

### Custom Skills
# | Skill name | Назначение
---|---|---
1 | observability-skill | Добавление сценариев и проверка observability pipeline
2 | prisma-migration-skill | Правила миграций Prisma
3 | docker-debug-skill | Отладка контейнеров и сетевых проблем
4 | orchestrator-skill | Декомпозиция задач, контекст-экономия

### Commands
# | Command | Что делает
---|---|---
1 | dev-start.sh | Запуск окружения и миграций
2 | run-test-scenario.sh | Запуск сценария и быстрый чек сигналов
3 | reset-db.sh | Полный сброс БД и запуск сервисов

### Hooks
# | Hook | Какую проблему решает
---|---|---
1 | pre-commit-observability-check.sh | Гарантии метрик/логов/миграций
2 | post-merge-infrastructure-update.sh | Авто-обновление инфры после merge

### Rules
# | Rule file | Что фиксирует
---|---|---
1 | stack-constraints.md | Фиксация обязательного стека
2 | conventions.md | Конвенции кода и ошибок
3 | observability-guardrails.md | Обязательные требования по observability

### Marketplace Skills
# | Skill | Зачем подключён
---|---|---
1 | superpowers/brainstorming | Сократический разбор требований
2 | superpowers/subagent-driven-development | Декомпозиция задач и параллельность
3 | superpowers/systematic-debugging | Отладка observability
4 | superpowers/writing-plans | Планирование фаз
5 | superpowers/using-git-worktrees | Параллельная работа по сервисам
6 | superpowers/requesting-code-review | Pre-review чеклист

Что закрыли custom skills, чего нет в marketplace:
Custom skills покрывают конкретные сценарии проекта (observability, Prisma, Docker, orchestrator) и сокращают контекст.

## Orchestrator
Путь к skill: .cursor/skills/orchestrator-skill.md
Путь к context file (пример): .cursor/orchestrator/context.json
Сколько фаз: 4
Какие задачи для fast model: атомарные правки в 1 файле, добавление enum, правки UI
Поддерживает resume: да

## Скриншоты / видео
UI приложения — `docs/proof/ui-app.jpg`
Grafana dashboard с данными — `docs/proof/ui-grafana-dashboard.jpg`
Loki logs — `docs/proof/loki-logs.jpg`
Sentry error — `docs/proof/sentry-issue.jpg`

## Что можно усилить при +4 часах
- Добавить CI-кэш npm и ускорение Docker build (buildkit cache mounts)
- Добавить алертинг в Grafana/Sentry с примерами правил
- Добавить load-тесты (k6) и стресс-профили по сценариям
- Добавить экспорт скриншотов/видео для быстрой проверки
- Добавить labels `scenario` в Loki-логи для быстрых фильтров в Explore
- Добавить rate limiting и ретраи на API вызовы сценариев
- Сделать отдельный Grafana dashboard для бизнес-SLO метрик
- Добавить e2e smoke через контейнеры (Playwright в Docker)
- Добавить health check для Grafana provisioning и метрик

## Вопросы для защиты (подготовься)
- Почему именно такая декомпозиция skills?
- Какие задачи подходят для малой модели и почему?
- Какие marketplace skills подключил, а какие заменил custom — и почему?
- Какие hooks реально снижают ошибки в повседневной работе?
- Как orchestrator экономит контекст по сравнению с одним большим промптом?
