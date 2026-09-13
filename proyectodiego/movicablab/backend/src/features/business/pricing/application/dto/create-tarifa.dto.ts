import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTarifaDto {
  @ApiProperty({ example: 'Tarifa Base 2026' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'base_km' })
  @IsString()
  @IsNotEmpty()
  reglaCalculo: string;

  @ApiProperty({ example: 5000, description: 'Debe ser mayor que 0' })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'El valor_base debe ser mayor que 0' })
  valorBase: number;

  @ApiProperty({ example: '2026-01-01T00:00:00Z' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  vigenciaDesde: Date;

  @ApiProperty({ example: '2026-12-31T23:59:59Z' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  vigenciaHasta: Date;
}
