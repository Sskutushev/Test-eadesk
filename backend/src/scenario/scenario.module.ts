import { Module } from '@nestjs/common';
import { ScenarioController, SentryDebugController } from './scenario.controller';
import { ScenarioService } from './scenario.service';
import { ObservabilityModule } from '../observability/observability.module';

@Module({
  imports: [ObservabilityModule],
  controllers: [ScenarioController, SentryDebugController],
  providers: [ScenarioService],
})
export class ScenarioModule {}
