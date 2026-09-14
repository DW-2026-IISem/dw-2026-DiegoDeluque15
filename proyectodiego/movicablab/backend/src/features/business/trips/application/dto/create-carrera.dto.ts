import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min, IsOptional, IsString } from 'class-validator';

export class CreateCarreraDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  pasajeroId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  turnoId: number;
  
  @ApiProperty({ example: 'Observaciones opcionales', required: false })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
