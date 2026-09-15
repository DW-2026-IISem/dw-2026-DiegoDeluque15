import { IsIn, IsString } from 'class-validator';

export class UpdateLiquidacionEstadoDto {
  @IsString()
  @IsIn(['pagada'])
  estado: string;
}
