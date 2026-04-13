'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dusk';
type Language = 'en' | 'ru';

type UiContextValue = {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
};

const UiContext = createContext<UiContextValue | null>(null);

const THEME_KEY = 'signal-lab.theme';
const LANG_KEY = 'signal-lab.lang';

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const savedLang = window.localStorage.getItem(LANG_KEY) as Language | null;

    if (savedTheme) setThemeState(savedTheme);
    if (savedLang) setLanguageState(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANG_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      theme,
      language,
      setTheme: setThemeState,
      setLanguage: setLanguageState,
      toggleTheme: () => setThemeState((prev) => (prev === 'light' ? 'dusk' : 'light')),
      toggleLanguage: () => setLanguageState((prev) => (prev === 'en' ? 'ru' : 'en')),
    }),
    [theme, language]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) {
    throw new Error('useUi must be used within UiProvider');
  }
  return ctx;
}
