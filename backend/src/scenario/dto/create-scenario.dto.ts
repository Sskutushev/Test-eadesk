import { IsEnum } from 'class-validator';
import { ScenarioType } from '@prisma/client';

export class CreateScenarioDto {
  @IsEnum(ScenarioType)
  type!: ScenarioType;
}
