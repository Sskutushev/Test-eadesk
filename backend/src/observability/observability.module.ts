import { Module } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';
import { AppLogger } from './logger.service';
import { MetricsController } from './metrics.controller';
import { OnModuleInit } from '@nestjs/common';

@Module({
  providers: [PrometheusService, AppLogger],
  controllers: [MetricsController],
  exports: [PrometheusService, AppLogger],
})
export class ObservabilityModule implements OnModuleInit {
  constructor(private readonly logger: AppLogger) {}

  onModuleInit() {
    this.logger.log('Observability module initialized', 'ObservabilityModule');
  }
}
