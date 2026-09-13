import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateTurnoDto {
  @ApiProperty({ example: 'Turno Mañana', minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @ApiPropertyOptional({ example: 'Turno de 6am a 2pm' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 1, description: 'ID del conductor (obligatorio)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  conductorId: number;

  @ApiProperty({ example: 1, description: 'ID del vehículo (obligatorio)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehiculoId: number;
}
