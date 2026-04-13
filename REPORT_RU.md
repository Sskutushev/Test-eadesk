# Отчет по тестовому заданию Signal Lab

## Цель задания
Построить observability playground и AI-слой для Cursor так, чтобы новый чат мог работать с репозиторием без ручных пояснений. Проверяются три зоны: инженерия, AI-архитектура и экономия контекста.

## Что реализовано

### Инженерия и стек
- **Frontend**: Next.js (App Router), shadcn/ui, Tailwind CSS, TanStack Query, React Hook Form.
- **Backend**: NestJS + Prisma + PostgreSQL.
- **Observability**: Prometheus, Grafana, Loki, Sentry.
- **Infra**: Docker Compose поднимает все сервисы одной командой.
- **DX**: Swagger `/docs`, единые скрипты проверки, smoke и интеграционные тесты.

### Архитектура (high-level)
1. UI отправляет запрос в `POST /api/scenarios` (Next.js proxy).
2. Backend выполняет сценарий.
3. Prisma сохраняет запуск в PostgreSQL.
4. Метрики отдаются через `/metrics` и скрейпятся Prometheus.
5. Логи пишутся в Loki через Winston (есть fallback отправка).
6. Ошибки `system_error` отправляются в Sentry.

### Модель данных
Prisma модель `ScenarioRun`:
- `id` (uuid), `type` (enum), `status` (enum), `durationMs`, `errorMsg`, `createdAt`.
- Таблица `scenario_runs`.

### Сценарии
- `success`: быстрый OK-ответ, INFO лог.
- `slow_query`: задержка 5s (учитывает `SCENARIO_DELAY_MULTIPLIER`), WARN логи.
- `system_error`: симуляция ошибки, ERROR лог, Sentry exception.

### Метрики (Prometheus)
Файл: `backend/src/observability/prometheus.service.ts`
- `scenario_runs_total{type,status}`
- `scenario_errors_total{type}`
- `scenario_duration_seconds{type}` (Histogram, buckets: 0.1, 0.5, 1, 2, 5, 10)
Default labels: `app="signal-lab"`, `env=<NODE_ENV>`.

### Логи (Loki)
Файл: `backend/src/observability/logger.service.ts`
- Winston + winston-loki transport.
- Labels: `app`, `env`, `service=backend`, `level`, `context`, `source`.
- При `LOKI_FALLBACK=true` включается fallback отправка в Loki (label `source=fallback`).

### Ошибки (Sentry)
Файл: `backend/src/instrument.ts`
- Отправка ошибок для `system_error`.
- Теги: `scenario=<type>`, доп. контекст по длительности.
- Debug эндпоинт: `GET /api/sentry-debug`.

### Grafana
Файлы: `docker/grafana/dashboards/signal-lab.json`, `docker/grafana/provisioning/*`
- Автопровиженинг дашборда и datasources (Prometheus/Loki).
- Дашборд показывает метрики и логи сценариев.

### UX и интерфейс
- Главная страница: бренд-блок, форма запуска, чеклист, observability tabs, история запусков, бизнес‑инсайты.
- Вкладки observability (Grafana/Explore/Prometheus/metrics/Sentry) встроены через iframe.
- Темы: Light/Dusk. Языки: EN/RU.
- Lazy‑loading панелей observability.
- Адаптивная верстка: мобильный контейнер 350px, блоки на всю ширину.

### Cursor AI Layer
- Rules: `stack-constraints`, `conventions`, `observability-guardrails`.
- Skills: `observability-skill`, `prisma-migration-skill`, `docker-debug-skill`, `orchestrator-skill`.
- Commands: `dev-start.sh`, `run-test-scenario.sh`, `reset-db.sh`.
- Hooks: `pre-commit-observability-check.sh`, `post-merge-infrastructure-update.sh`.
- Marketplace skills: 6 штук с обоснованием в `.cursor/marketplace.json`.

## Инфраструктура и сервисы

### Docker Compose
Сервисы и порты:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Grafana: `http://localhost:3002` (admin/admin)
- Prometheus: `http://localhost:9090`
- Loki: `http://localhost:3100`
- PostgreSQL: `localhost:5432`

### Переменные окружения
- Root `.env.example`: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_URL`.
- Backend `.env.example`: `DATABASE_URL`, `SENTRY_DSN`, `LOKI_HOST`, `NODE_ENV`, `SCENARIO_DELAY_MULTIPLIER`.
- Frontend `.env.example`: `BACKEND_URL`, `NEXT_PUBLIC_*` URLs.

## Проверка и запуск

### Быстрый старт
```bash
cp .env.example .env
docker compose up -d --build
```

### Автопроверки
```bash
./tests/smoke/smoke-test.sh
./tests/integration/test-observability-pipeline.sh
```

### Проверка наблюдаемости (ручной walkthrough)
1. Открыть UI: `http://localhost:3000`.
2. Запустить `System Error`.
3. Проверить метрики: `http://localhost:3001/metrics`.
4. Проверить Grafana: `http://localhost:3002/d/signal-lab`.
5. Проверить Loki Explore: `http://localhost:3002/explore` (запрос `{app="signal-lab"}`).
6. Проверить Prometheus: `http://localhost:9090` (query `scenario_errors_total`).
7. Если задан `SENTRY_DSN` — убедиться, что ошибка попала в Sentry.
8. Проверить debug-эндпоинт: `GET http://localhost:3001/api/sentry-debug`.

### Качество и DX
```bash
npm run verify:release
```
Скрипт запускает проверки backend/frontend: typecheck, lint, test, build.

### E2E и бенчмарки
- E2E: `frontend/tests/ui.spec.ts` (Playwright).
- Бенчмарки: `tests/bench/startup-benchmark.sh`, `tests/bench/healthcheck-benchmark.sh`.

## Ограничения и известные нюансы
- Sentry требует реальный DSN для end-to-end проверки.
- Некоторые сервисы могут блокировать iframe, для этого есть кнопка «Open in new tab».
- Первый build может быть дольше из-за скачивания npm‑пакетов.

## Что можно усилить при +4 часах
- Добавить CI-кэш npm и ускорение Docker build (buildkit cache mounts).
- Добавить алертинг в Grafana/Sentry с примерами правил.
- Добавить нагрузочные тесты (k6) и стресс‑профили по сценариям.
- Добавить экспорт скриншотов/видео для быстрой проверки.

## Почему решение закрывает рубрику
- Стек соблюден полностью.
- Observability реализована через метрики, логи и ошибки.
- AI‑слой детализирован и полезен в новом чате.
- Orchestrator‑skill описан и готов к декомпозиции задач.
- Документация и DX позволяют проверить за 15 минут.

## Вопросы для защиты (подготовься)

### Почему именно такая декомпозиция skills?
- Разделение отражает реальные потоки работ: observability, Prisma/схема, Docker/infra и оркестрация. Это снижает когнитивную нагрузку и дает понятные входы для нового чата.
- Каждая skill закреплена за зоной ответственности: observability — сигналы/панели/проверки; prisma — миграции и порядок; docker-debug — здоровье контейнеров и сеть; orchestrator — крупные задачи, где нужен план и параллельность.
- Такой состав минимизирует пересечения: ошибки в логах не смешиваются с миграциями, а orchestration остается надстройкой для сложных задач.

### Какие задачи подходят для малой модели и почему?
- Атомарные правки в одном файле: текстовые правки, обновление простых компонентов, корректировка Tailwind классов (`frontend/components/obs-links.tsx`).
- Узкие, локальные задачи в 1–2 файлах: обновить labels в логгере, добавить поле в DTO, правка таблицы в UI.
- Эти задачи ограничены контекстом, имеют низкий риск и легко проверяются локально (typecheck/lint/preview), поэтому fast model дает лучший cost/time.

### Какие marketplace skills подключил, а какие заменил custom — и почему?
- Marketplace: brainstorming, subagent-driven-development, systematic-debugging, writing-plans, using-git-worktrees, requesting-code-review.
- Они закрывают универсальные практики (планирование, декомпозиция, отладка), которые не требуют проекта-специфики.
- Custom skills заменяют то, что завязано на архитектуру Signal Lab: observability pipeline, Prisma миграции, Docker сети/healthcheck, orchestrator с этапами и быстрыми проверками. Это дает строгие, повторяемые инструкции в контексте конкретного репо.

### Какие hooks реально снижают ошибки в повседневной работе?
- `pre-commit-observability-check.sh`: предотвращает регрессии наблюдаемости (проверка ключевых сигналов), не дает забыть метрики/логи после правок сценариев.
- `post-merge-infrastructure-update.sh`: синхронизирует локальную инфру после merge (обновление compose и сервисов), предотвращает несоответствие окружений.

### Как orchestrator экономит контекст по сравнению с одним большим промптом?
- Делит задачу на атомарные подзадачи с минимальным контекстом (по 1–3 файла), что снижает токены и риск ошибок.
- Каждая подзадача получает только релевантные фрагменты, что ускоряет работу и повышает точность.
- Результаты агрегируются в общий план и единый отчет, вместо “широкого” промпта, который размывает фокус.
- Предусмотрена модель селекции (fast для локальных правок, default для архитектурных), что сокращает стоимость без потери качества.
