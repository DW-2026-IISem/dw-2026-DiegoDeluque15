import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTarifaDto {
  @ApiPropertyOptional({ example: 'Tarifa Base 2026 Modificada' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: 'base_km_v2' })
  @IsOptional()
  @IsString()
  reglaCalculo?: string;

  @ApiPropertyOptional({ example: 6000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'El valor_base debe ser mayor que 0' })
  valorBase?: number;

  @ApiPropertyOptional({ example: '2026-02-01T00:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  vigenciaDesde?: Date;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  vigenciaHasta?: Date;
}
