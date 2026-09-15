import { IsInt, IsPositive, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLiquidacionDto {
  @IsInt()
  @IsPositive()
  conductorId: number;

  @IsDateString()
  fechaDesde: string;

  @IsDateString()
  fechaHasta: string;
}
