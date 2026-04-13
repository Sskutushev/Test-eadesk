import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class PrometheusService implements OnModuleInit {
  private readonly registry = new Registry();
  scenarioRunsTotal!: Counter<string>;
  scenarioErrorsTotal!: Counter<string>;
  scenarioDuration!: Histogram<string>;

  onModuleInit() {
    // Dedicated registry avoids metric collisions in multi-module setups.
    this.registry.setDefaultLabels({
      app: 'signal-lab',
      env: process.env.NODE_ENV || 'development',
    });

    collectDefaultMetrics({ register: this.registry });

    // Scenario metrics are the primary evaluation signals.
    this.scenarioRunsTotal = new Counter({
      name: 'scenario_runs_total',
      help: 'Total number of scenario runs',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });

    this.scenarioErrorsTotal = new Counter({
      name: 'scenario_errors_total',
      help: 'Total number of scenario errors',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.scenarioDuration = new Histogram({
      name: 'scenario_duration_seconds',
      help: 'Scenario execution duration in seconds',
      labelNames: ['type'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
