import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateVehiculoDto {
  @ApiProperty({ example: 'Taxi 101', minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @ApiPropertyOptional({ example: 'Sedán blanco, placa ABC-123' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 1, description: 'ID de la empresa propietaria (obligatorio)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empresaId: number;
}
