'use client';

import { ScenarioForm } from '@/components/scenario-form';
import { RunHistory } from '@/components/run-history';
import { ObsLinks } from '@/components/obs-links';
import { ObsTabs } from '@/components/obs-tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUi } from '@/lib/ui-context';
import { copy } from '@/lib/i18n';

export default function Home() {
  const { language } = useUi();
  const text = copy[language];

  return (
    <main className="mx-auto w-full max-w-[350px] px-0 py-8 space-y-8 sm:max-w-2xl sm:px-6 lg:max-w-6xl">
      <section className="grid gap-6 justify-items-center lg:justify-items-stretch lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">{text.brand}</p>
          <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
            {text.headline}
          </h1>
          <p className="text-muted-foreground max-w-2xl">{text.subhead}</p>
        </div>
        <ObsLinks />
      </section>

      <div className="grid gap-6 justify-items-center lg:justify-items-stretch lg:grid-cols-[1.1fr_0.9fr]">
        <ScenarioForm />
        <Card className="w-full max-w-[350px] mx-auto sm:max-w-none sm:mx-0">
          <CardHeader>
            <CardTitle>{text.quickChecks.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{text.quickChecks.subtitle}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {text.quickChecks.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <ObsTabs />

      <div className="grid gap-6 justify-items-center lg:justify-items-stretch lg:grid-cols-[1.1fr_0.9fr]">
        <RunHistory />
        <Card className="h-[420px] w-full max-w-[350px] mx-auto sm:max-w-none sm:mx-0">
          <CardHeader>
            <CardTitle>{text.insights.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{text.insights.subtitle}</p>
          </CardHeader>
          <CardContent className="flex h-[300px] flex-col">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {text.insights.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
