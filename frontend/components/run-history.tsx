'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { useUi } from '@/lib/ui-context';
import { copy } from '@/lib/i18n';

type ScenarioRun = {
  id: string;
  type: string;
  status: string;
  durationMs: number;
  errorMsg: string | null;
  createdAt: string;
};

export function RunHistory() {
  const { language } = useUi();
  const text = copy[language];
  const { data, isLoading, isError } = useQuery<ScenarioRun[]>({
    queryKey: ['runs'],
    queryFn: () => fetch('/api/scenarios').then((r) => r.json()),
    refetchInterval: 3000,
  });

  if (isLoading) {
    return <p className="text-muted-foreground">{text.history.loading}</p>;
  }

  if (isError) {
    return <p className="text-red-600">{text.history.error}</p>;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{text.history.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{text.history.empty}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[420px] w-full max-w-[350px] mx-auto sm:max-w-none sm:mx-0">
      <CardHeader className="flex items-start justify-between gap-2 md:flex-row">
        <div>
          <CardTitle>{text.history.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {text.history.subtitle}
          </p>
        </div>
        <Tooltip label="History is capped at the last 50 runs to keep the UI responsive.">
          <span className="rounded-full border px-2 py-1 text-xs text-muted-foreground">Info</span>
        </Tooltip>
      </CardHeader>
      <CardContent className="flex h-[300px] flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{text.history.type}</TableHead>
              <TableHead>{text.history.status}</TableHead>
              <TableHead>{text.history.duration}</TableHead>
              <TableHead>{text.history.time}</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="mt-1 flex-1 overflow-y-auto rounded-md">
          <Table>
            <TableBody>
              {data.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-mono text-sm">{run.type}</TableCell>
                  <TableCell>
                    <Badge variant={run.status === 'success' ? 'default' : 'destructive'}>
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{run.durationMs}ms</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(run.createdAt).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
