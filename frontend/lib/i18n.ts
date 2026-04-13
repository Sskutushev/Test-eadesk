type Copy = {
  brand: string;
  headline: string;
  subhead: string;
  toggles: {
    theme: string;
    language: string;
    light: string;
    dusk: string;
    en: string;
    ru: string;
  };
    scenario: {
      title: string;
      helper: string;
      tooltip: string;
      success: string;
      slow: string;
      error: string;
      run: string;
      running: string;
      ok: string;
      failed: string;
    };
  quickChecks: {
    title: string;
    subtitle: string;
    items: string[];
  };
  history: {
    title: string;
    subtitle: string;
    empty: string;
    loading: string;
    error: string;
    type: string;
    status: string;
    duration: string;
    time: string;
  };
  insights: {
    title: string;
    subtitle: string;
    items: string[];
  };
  observability: {
    title: string;
    subtitle: string;
    tabs: {
      grafana: string;
      explore: string;
      prometheus: string;
      metrics: string;
      sentry: string;
    };
    hints: {
      grafana: string;
      explore: string;
      prometheus: string;
      metrics: string;
      sentry: string;
    };
    open: string;
    blocked: string;
    load: string;
    loading: string;
    sentryPlaceholderTitle: string;
    sentryPlaceholderBody: string;
  };
  sentry: {
    label: string;
    configured: string;
    missing: string;
  };
};

export const copy: Record<'en' | 'ru', Copy> = {
  en: {
    brand: 'Signal Lab',
    headline: 'Observability control room for scenarios, signals, and evidence.',
    subhead:
      'Run controlled incidents, verify dashboards, and capture evidence for SLOs, audits, and product decisions.',
    toggles: {
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dusk: 'Dusk',
      en: 'EN',
      ru: 'RU',
    },
    scenario: {
      title: 'Run a scenario',
      helper: 'Generate signals that mirror real incidents and performance spikes.',
      tooltip: 'Scenarios are deterministic and emit metrics, logs, and errors for observability validation.',
      success: 'Success - fast OK response',
      slow: 'Slow Query - 5s delay',
      error: 'System Error - simulated failure',
      run: 'Run',
      running: 'Running...',
      ok: 'Scenario completed in',
      failed: 'Scenario failed. Check logs.',
    },
    quickChecks: {
      title: 'Executive checklist',
      subtitle: 'Align technical signals with product and stakeholder outcomes.',
      items: [
        'Trigger a scenario and confirm a clean status path.',
        'Validate Grafana panels for metrics and logs.',
        'Confirm /metrics and /health endpoints are green.',
      ],
    },
    history: {
      title: 'Run history',
      subtitle: 'Reliability evidence for product and incident reporting.',
      empty: 'No runs yet. Trigger a scenario above.',
      loading: 'Loading history...',
      error: 'Failed to load history.',
      type: 'Type',
      status: 'Status',
      duration: 'Duration',
      time: 'Time',
    },
    insights: {
      title: 'Business signals',
      subtitle: 'Translate observability into actionable business insights.',
      items: [
        'Error rate reflects customer impact risk in real time.',
        'Latency spikes show where user experience degrades.',
        'Logs provide evidence for incident narratives and RCA.',
      ],
    },
    observability: {
      title: 'Observability surfaces',
      subtitle: 'Stay in one workspace. Switch tabs for each tool.',
      tabs: {
        grafana: 'Grafana Dashboard',
        explore: 'Loki Explore',
        prometheus: 'Prometheus',
        metrics: 'Raw Metrics',
        sentry: 'Sentry',
      },
      hints: {
        grafana: 'Watch scenario panels update as you run tests.',
        explore: 'Search logs by scenario tag and level.',
        prometheus: 'Validate counters and histograms quickly.',
        metrics: 'Raw /metrics endpoint for audits and debugging.',
        sentry: 'Sentry becomes active once a DSN is provided.',
      },
      open: 'Open in new tab',
      blocked: 'If the panel is blank, open in a new tab (iframe blocked by the service).',
      load: 'Load panel',
      loading: 'Loading panel...',
      sentryPlaceholderTitle: 'Sentry embed unavailable',
      sentryPlaceholderBody:
        'Sentry blocks iframe embedding. Open in a new tab to review real issues. Use /api/sentry-debug to generate a test error.',
    },
    sentry: {
      label: 'Sentry',
      configured: 'connected',
      missing: 'not configured',
    },
  },
  ru: {
    brand: 'Signal Lab',
    headline: 'Observability-пульт для сценариев, сигналов и доказательств.',
    subhead:
      'Запускай контролируемые инциденты, проверяй дашборды и собирай факты для SLO, аудита и решений продукта.',
    toggles: {
      theme: 'Тема',
      language: 'Язык',
      light: 'Светлая',
      dusk: 'Сумерки',
      en: 'EN',
      ru: 'RU',
    },
    scenario: {
      title: 'Запуск сценария',
      helper: 'Генерируй сигналы, похожие на реальные инциденты и деградации.',
      tooltip: 'Сценарии детерминированы и пишут метрики, логи и ошибки для проверки observability.',
      success: 'Success - быстрый OK ответ',
      slow: 'Slow Query - задержка 5s',
      error: 'System Error - симуляция ошибки',
      run: 'Запустить',
      running: 'Выполняется...',
      ok: 'Сценарий выполнен за',
      failed: 'Сценарий завершился ошибкой. Проверь логи.',
    },
    quickChecks: {
      title: 'Проверка для бизнеса',
      subtitle: 'Связь технических сигналов с решениями продукта и бизнеса.',
      items: [
        'Запусти сценарий и убедись, что статус корректный.',
        'Проверь панели Grafana для метрик и логов.',
        'Убедись, что /metrics и /health зелёные.',
      ],
    },
    history: {
      title: 'История запусков',
      subtitle: 'Доказательная база для продукта и инцидентов.',
      empty: 'Запусков пока нет. Запусти сценарий выше.',
      loading: 'Загрузка истории...',
      error: 'Ошибка загрузки истории.',
      type: 'Тип',
      status: 'Статус',
      duration: 'Длительность',
      time: 'Время',
    },
    insights: {
      title: 'Бизнес-сигналы',
      subtitle: 'Перевод observability в понятные бизнес-инсайты.',
      items: [
        'Error rate показывает риск влияния на клиентов.',
        'Пики latency отражают деградацию UX.',
        'Логи дают основу для RCA и отчётов.',
      ],
    },
    observability: {
      title: 'Observability слои',
      subtitle: 'Всё на одной странице. Переключай вкладки инструментов.',
      tabs: {
        grafana: 'Grafana Дашборд',
        explore: 'Loki Explore',
        prometheus: 'Prometheus',
        metrics: 'Raw Metrics',
        sentry: 'Sentry',
      },
      hints: {
        grafana: 'Смотри, как панели обновляются после запусков.',
        explore: 'Ищи логи по тегам сценария и уровню.',
        prometheus: 'Быстрая проверка счётчиков и гистограмм.',
        metrics: 'Raw /metrics для отладки и аудита.',
        sentry: 'Sentry активируется после задания DSN.',
      },
      open: 'Открыть в новой вкладке',
      blocked: 'Если панель пустая, открой в новой вкладке (iframe заблокирован сервисом).',
      load: 'Загрузить панель',
      loading: 'Загрузка панели...',
      sentryPlaceholderTitle: 'Sentry не встраивается',
      sentryPlaceholderBody:
        'Sentry блокирует iframe. Открой в новой вкладке для проверки. Используй /api/sentry-debug для тестовой ошибки.',
    },
    sentry: {
      label: 'Sentry',
      configured: 'подключен',
      missing: 'не настроен',
    },
  },
};
