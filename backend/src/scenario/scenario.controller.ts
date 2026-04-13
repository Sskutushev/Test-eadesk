import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import * as Sentry from '@sentry/nestjs';

@Controller('api/scenarios')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Post()
  async runScenario(@Body() dto: CreateScenarioDto) {
    return this.scenarioService.runScenario(dto.type);
  }

  @Get()
  async getHistory() {
    return this.scenarioService.getHistory();
  }
}

@Controller('api/sentry-debug')
export class SentryDebugController {
  @Get()
  triggerError() {
    const error = new Error('My first Sentry error!');
    Sentry.captureException(error);
    throw error;
  }
}
