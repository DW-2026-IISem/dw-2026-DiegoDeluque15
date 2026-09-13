import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateVehiculoDto {
  @ApiPropertyOptional({ example: 'Taxi 101 actualizado', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Renovado en 2026' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
