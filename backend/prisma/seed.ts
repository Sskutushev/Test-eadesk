import { PrismaClient, ScenarioType, RunStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.scenarioRun.createMany({
    data: [
      {
        type: ScenarioType.success,
        status: RunStatus.success,
        durationMs: 120,
      },
      {
        type: ScenarioType.slow_query,
        status: RunStatus.success,
        durationMs: 5000,
      },
      {
        type: ScenarioType.system_error,
        status: RunStatus.error,
        durationMs: 20,
        errorMsg: 'Simulated system error: database connection timeout',
      },
    ],
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
