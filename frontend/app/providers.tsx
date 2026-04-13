'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/lib/query-client';
import { UiProvider } from '@/lib/ui-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={client}>
      <UiProvider>{children}</UiProvider>
    </QueryClientProvider>
  );
}
