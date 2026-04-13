'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip } from '@/components/ui/tooltip';
import { useUi } from '@/lib/ui-context';
import { copy } from '@/lib/i18n';

const schema = z.object({
  type: z.enum(['success', 'slow_query', 'system_error']),
});

type FormValues = z.infer<typeof schema>;

export function ScenarioForm() {
  const { language } = useUi();
  const text = copy[language];
  const queryClient = useQueryClient();
  const { handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'success' },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Request failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
    },
  });

  const scenarioLabels: Record<FormValues['type'], string> = {
    success: text.scenario.success,
    slow_query: text.scenario.slow,
    system_error: text.scenario.error,
  };

  return (
    <Card className="w-full max-w-[350px] mx-auto sm:max-w-none sm:mx-0">
      <CardHeader className="flex items-start justify-between gap-2 md:flex-row">
        <div>
          <CardTitle>{text.scenario.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{text.scenario.helper}</p>
        </div>
        <Tooltip label={text.scenario.tooltip}>
          <span className="rounded-full border px-2 py-1 text-xs text-muted-foreground">Info</span>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="flex flex-col gap-3 md:flex-row"
        >
          <Select
            defaultValue="success"
            onValueChange={(value) => setValue('type', value as FormValues['type'])}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(scenarioLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? text.scenario.running : text.scenario.run}
          </Button>
        </form>
        {mutation.isSuccess && (
          <p className="mt-2 text-sm text-emerald-700">
            {text.scenario.ok} {mutation.data.durationMs}ms
          </p>
        )}
        {mutation.isError && (
          <p className="mt-2 text-sm text-red-600">{text.scenario.failed}</p>
        )}
      </CardContent>
    </Card>
  );
}
