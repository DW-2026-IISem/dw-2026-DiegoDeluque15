import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class ListTurnosQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Filtrar por conductor_id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  conductorId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Filtrar por vehiculo_id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehiculoId?: number;

  @ApiPropertyOptional({ example: true, description: 'Filtrar por is_active' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
