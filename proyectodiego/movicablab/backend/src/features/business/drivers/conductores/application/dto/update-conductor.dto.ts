import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateConductorDto {
  @ApiPropertyOptional({ example: 'Juan Perez Actualizado', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Nueva descripcion' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 2, description: 'Nuevo ID de empresa' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empresaId?: number;
}
