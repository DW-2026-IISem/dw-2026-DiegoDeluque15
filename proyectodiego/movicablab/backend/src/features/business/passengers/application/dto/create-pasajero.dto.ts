import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePasajeroDto {
  @ApiProperty({ example: 'Ana García', minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @ApiPropertyOptional({ example: 'Cliente frecuente zona norte' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
