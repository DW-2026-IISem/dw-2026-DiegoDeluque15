import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTurnoDto {
  @ApiPropertyOptional({ example: 'Turno Tarde', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Turno de 2pm a 10pm' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
