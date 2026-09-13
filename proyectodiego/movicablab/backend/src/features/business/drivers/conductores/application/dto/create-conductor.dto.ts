import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateConductorDto {
  @ApiProperty({ example: 'Juan Perez', minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @ApiPropertyOptional({ example: 'Conductor experimentado' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID de la empresa (opcional)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empresaId?: number;
}
