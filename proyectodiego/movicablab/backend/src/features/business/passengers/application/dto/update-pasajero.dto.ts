import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePasajeroDto {
  @ApiPropertyOptional({ example: 'Ana García López', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Actualización de contacto' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
