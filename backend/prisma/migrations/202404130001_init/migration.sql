-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('success', 'slow_query', 'system_error');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('success', 'error');

-- CreateTable
CREATE TABLE "scenario_runs" (
  "id" TEXT NOT NULL,
  "type" "ScenarioType" NOT NULL,
  "status" "RunStatus" NOT NULL,
  "durationMs" INTEGER NOT NULL,
  "errorMsg" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "scenario_runs_pkey" PRIMARY KEY ("id")
);
