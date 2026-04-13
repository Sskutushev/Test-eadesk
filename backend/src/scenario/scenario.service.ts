import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrometheusService } from '../observability/prometheus.service';
import { AppLogger } from '../observability/logger.service';
import * as Sentry from '@sentry/node';
import { ScenarioType } from '@prisma/client';

@Injectable()
export class ScenarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prometheus: PrometheusService,
    private readonly logger: AppLogger,
  ) {}

  async runScenario(type: ScenarioType) {
    const startTime = Date.now();
    let status: 'success' | 'error' = 'success';
    let errorMsg: string | null = null;
    let createError: Error | null = null;

    try {
      this.logger.log(`Starting scenario: ${type}`, 'ScenarioService', { scenario: type });

      switch (type) {
        case ScenarioType.success:
          await this.runSuccess();
          break;
        case ScenarioType.slow_query:
          await this.runSlowQuery();
          break;
        case ScenarioType.system_error:
          await this.runSystemError();
          break;
        default:
          throw new Error(`Unknown scenario type: ${type}`);
      }
    } catch (err) {
      const error = err as Error;
      status = 'error';
      errorMsg = error?.message ?? String(err);

      this.logger.error(
        `Scenario ${type} failed: ${errorMsg}`,
        error?.stack,
        'ScenarioService',
        { scenario: type },
      );

      Sentry.captureException(error, {
        tags: { scenario: type },
        extra: { durationMs: Date.now() - startTime },
      });

      this.prometheus.scenarioErrorsTotal.labels(type).inc();
    } finally {
      // Metrics are recorded regardless of outcome to keep counters consistent.
      const durationMs = Date.now() - startTime;
      const durationSec = durationMs / 1000;

      this.prometheus.scenarioRunsTotal.labels(type, status).inc();
      this.prometheus.scenarioDuration.labels(type).observe(durationSec);
    }

    const durationMs = Date.now() - startTime;

    try {
      return await this.prisma.scenarioRun.create({
        data: { type, status, durationMs, errorMsg },
      });
    } catch (dbErr) {
      const error = dbErr as Error;
      createError = error;
      this.logger.error(
        `Scenario ${type} failed to persist: ${error?.message ?? 'unknown error'}`,
        error?.stack,
        'ScenarioService',
        { scenario: type, phase: 'persist' },
      );
      Sentry.captureException(error, {
        tags: { scenario: type, phase: 'persist' },
        extra: { durationMs, status },
      });
    }

    if (createError) {
      throw createError;
    }

    throw new Error('Unexpected state: scenario run not persisted');
  }

  private getDelayMs(baseMs: number) {
    const multiplier = Number(process.env.SCENARIO_DELAY_MULTIPLIER || '1');
    if (!Number.isFinite(multiplier) || multiplier <= 0) {
      return baseMs;
    }
    return Math.floor(baseMs * multiplier);
  }

  private async runSuccess() {
    const delay = this.getDelayMs(100 + Math.random() * 100);
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.logger.log('Success scenario completed', 'ScenarioService', { scenario: 'success' });
  }

  private async runSlowQuery() {
    const delay = this.getDelayMs(5000);
    this.logger.warn('Slow query scenario started', 'ScenarioService', { scenario: 'slow_query' });
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.logger.warn(`Slow query took ${delay}ms`, 'ScenarioService', { scenario: 'slow_query' });
  }

  private async runSystemError() {
    this.logger.error(
      'System error scenario triggered',
      undefined,
      'ScenarioService',
      { scenario: 'system_error' },
    );
    throw new Error('Simulated system error: database connection timeout');
  }

  async getHistory() {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
