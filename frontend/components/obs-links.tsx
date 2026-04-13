import Image from 'next/image';
import { useUi } from '@/lib/ui-context';
import { copy } from '@/lib/i18n';
import { Segmented } from '@/components/ui/segmented';

export function ObsLinks() {
  const { language, setLanguage, theme, setTheme } = useUi();
  const text = copy[language];
  const sentryConfigured = Boolean(process.env.NEXT_PUBLIC_SENTRY_URL);

  return (
    <div className="flex w-full max-w-[350px] mx-auto flex-col gap-4 rounded-xl border bg-card/70 p-4 shadow-sm sm:max-w-none sm:mx-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/favicon.ico"
          alt="Signal Lab logo"
          width={40}
          height={40}
          className="h-10 w-10 rounded-xl border bg-background/70 p-1"
        />
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{text.brand}</p>
          <p className="text-sm text-muted-foreground">
            {text.subhead}
          </p>
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{text.sentry.label}</p>
          <div
            className={`rounded-full border px-3 py-1 text-xs ${
              sentryConfigured ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {sentryConfigured ? text.sentry.configured : text.sentry.missing}
          </div>
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{text.toggles.theme}</p>
          <Segmented
            value={theme}
            onChange={(value) => setTheme(value as 'light' | 'dusk')}
            options={[
              { value: 'light', label: text.toggles.light },
              { value: 'dusk', label: text.toggles.dusk },
            ]}
            size="sm"
          />
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{text.toggles.language}</p>
          <Segmented
            value={language}
            onChange={(value) => setLanguage(value as 'en' | 'ru')}
            options={[
              { value: 'en', label: text.toggles.en },
              { value: 'ru', label: text.toggles.ru },
            ]}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
