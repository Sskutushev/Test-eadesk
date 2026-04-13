'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUi } from '@/lib/ui-context';
import { copy } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

type ObsTab = {
  id: 'grafana' | 'explore' | 'prometheus' | 'metrics' | 'sentry';
  label: string;
  url: string;
  hint: string;
  autoLoad?: boolean;
};

export function ObsTabs() {
  const { language } = useUi();
  const text = copy[language];
  const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3002';
  const exploreState = encodeURIComponent(
    JSON.stringify({
      datasource: { type: 'loki', uid: 'loki' },
      queries: [{ refId: 'A', expr: '{app="signal-lab"}' }],
      range: { from: 'now-1h', to: 'now' },
      mode: 'Logs',
    }),
  );

  const tabs: ObsTab[] = [
    {
      id: 'grafana',
      label: text.observability.tabs.grafana,
      url: `${grafanaUrl}/d/signal-lab?orgId=1&refresh=5s`,
      hint: text.observability.hints.grafana,
      autoLoad: true,
    },
    {
      id: 'explore',
      label: text.observability.tabs.explore,
      url: `${grafanaUrl}/explore?orgId=1&left=${exploreState}`,
      hint: text.observability.hints.explore,
    },
    {
      id: 'prometheus',
      label: text.observability.tabs.prometheus,
      url: 'http://localhost:9090/graph?g0.expr=scenario_runs_total&g0.tab=1',
      hint: text.observability.hints.prometheus,
      autoLoad: true,
    },
    {
      id: 'metrics',
      label: text.observability.tabs.metrics,
      url: 'http://localhost:3001/metrics',
      hint: text.observability.hints.metrics,
      autoLoad: true,
    },
    {
      id: 'sentry',
      label: text.observability.tabs.sentry,
      url: process.env.NEXT_PUBLIC_SENTRY_URL || '',
      hint: text.observability.hints.sentry,
      autoLoad: true,
    },
  ];

  const [active, setActive] = useState<ObsTab['id']>('grafana');
  const [loadedTabs, setLoadedTabs] = useState<Set<ObsTab['id']>>(
    () => new Set(['grafana', 'metrics', 'prometheus']),
  );
  const [loadingTab, setLoadingTab] = useState<ObsTab['id'] | null>(null);
  const current = tabs.find((tab) => tab.id === active) || tabs[0];
  const isLoaded = loadedTabs.has(current.id);
  const sentryConfigured = Boolean(process.env.NEXT_PUBLIC_SENTRY_URL);
  const canOpen = current.id === 'sentry' ? sentryConfigured : Boolean(current.url);

  return (
    <Card className="w-full max-w-[350px] mx-auto overflow-hidden sm:max-w-none sm:mx-0">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{text.observability.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{text.observability.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActive(tab.id);
                if (tab.autoLoad) {
                  setLoadedTabs((prev) => new Set(prev).add(tab.id));
                  setLoadingTab(tab.id);
                }
              }}
              className={`rounded-full border px-3 py-1 text-sm transition-all ${
                active === tab.id
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{current.hint}</span>
          {canOpen ? (
            <Button asChild variant="outline" size="sm">
              <a href={current.url} target="_blank" rel="noopener noreferrer">
                {text.observability.open}
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              {text.observability.open}
            </Button>
          )}
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background">
          {current.id === 'sentry' ? (
            <div className="flex h-[520px] flex-col items-start justify-center gap-4 p-8 text-sm text-muted-foreground">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {text.observability.sentryPlaceholderTitle}
                </p>
                <p className="mt-2 max-w-xl">{text.observability.sentryPlaceholderBody}</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4 text-xs text-foreground">
                <p className="font-semibold">Test endpoint</p>
                <p className="mt-1">GET http://localhost:3001/api/sentry-debug</p>
              </div>
              <pre className="w-full rounded-lg border bg-muted/40 p-4 text-xs text-foreground">
{`{
  "event": "system_error",
  "scenario": "system_error",
  "message": "Simulated system error: database connection timeout",
  "tags": {
    "scenario": "system_error"
  }
}`}
              </pre>
            </div>
          ) : !isLoaded ? (
            <div className="flex h-[520px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <span>{text.observability.load}</span>
              <Button
                size="sm"
                onClick={() => {
                  setLoadedTabs((prev) => new Set(prev).add(current.id));
                  setLoadingTab(current.id);
                }}
              >
                {text.observability.load}
              </Button>
            </div>
          ) : (
            <>
              {/* Embedded panels keep the review flow in one workspace. */}
              <iframe
                title={current.label}
                src={current.url}
                className="h-[520px] w-full"
                loading="lazy"
                onLoad={() => setLoadingTab(null)}
              />
              {loadingTab === current.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm text-muted-foreground">
                  {text.observability.loading}
                </div>
              )}
            </>
          )}
          <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/20" />
        </div>
        <p className="text-xs text-muted-foreground">{text.observability.blocked}</p>
      </CardContent>
    </Card>
  );
}
