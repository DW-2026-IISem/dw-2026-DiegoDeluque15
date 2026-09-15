import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePagoEstadoDto {
  @IsString()
  @IsNotEmpty()
  estado: string;
}
