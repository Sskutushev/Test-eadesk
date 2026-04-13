import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioService } from '../src/scenario/scenario.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrometheusService } from '../src/observability/prometheus.service';
import { AppLogger } from '../src/observability/logger.service';
import { ScenarioType } from '@prisma/client';

describe('ScenarioService', () => {
  let service: ScenarioService;
  let prismaService: jest.Mocked<PrismaService>;
  let prometheusService: jest.Mocked<PrometheusService>;

  const mockCounter = { labels: jest.fn().mockReturnThis(), inc: jest.fn() };
  const mockHistogram = { labels: jest.fn().mockReturnThis(), observe: jest.fn() };

  beforeEach(async () => {
    process.env.SCENARIO_DELAY_MULTIPLIER = '0.01';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenarioService,
        {
          provide: PrismaService,
          useValue: {
            scenarioRun: {
              create: jest.fn().mockResolvedValue({
                id: 'test-id',
                type: 'success',
                status: 'success',
                durationMs: 100,
                createdAt: new Date(),
              }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        {
          provide: PrometheusService,
          useValue: {
            scenarioRunsTotal: mockCounter,
            scenarioErrorsTotal: mockCounter,
            scenarioDuration: mockHistogram,
          },
        },
        {
          provide: AppLogger,
          useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ScenarioService>(ScenarioService);
    prismaService = module.get(PrismaService);
    prometheusService = module.get(PrometheusService);
  });

  describe('runScenario', () => {
    it('success scenario persists a success run', async () => {
      await service.runScenario(ScenarioType.success);

      expect(prismaService.scenarioRun.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'success' }) })
      );
    });

    it('increments Prometheus counter for success scenario', async () => {
      await service.runScenario(ScenarioType.success);

      expect(prometheusService.scenarioRunsTotal.labels).toHaveBeenCalledWith('success', 'success');
      expect(mockCounter.inc).toHaveBeenCalled();
    });

    it('system_error scenario persists an error run', async () => {
      prismaService.scenarioRun.create = jest.fn().mockResolvedValue({
        id: 'err-id',
        type: 'system_error',
        status: 'error',
        durationMs: 10,
        errorMsg: 'Simulated system error',
      });

      await service.runScenario(ScenarioType.system_error);

      expect(prismaService.scenarioRun.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'error', type: 'system_error' })
        })
      );
    });

    it('slow_query scenario waits at least 30ms in tests', async () => {
      const start = Date.now();
      await service.runScenario(ScenarioType.slow_query);
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThan(30);
    });

    it('measures duration for all scenarios', async () => {
      await service.runScenario(ScenarioType.success);

      expect(prometheusService.scenarioDuration.labels).toHaveBeenCalledWith('success');
      expect(mockHistogram.observe).toHaveBeenCalled();
    });
  });

  describe('getHistory', () => {
    it('returns recent runs from the database', async () => {
      await service.getHistory();

      expect(prismaService.scenarioRun.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' }, take: 50 })
      );
    });
  });
});
