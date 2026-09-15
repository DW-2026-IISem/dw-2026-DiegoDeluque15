import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePagoDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  referenciaId: number;

  @IsString()
  @IsNotEmpty()
  metodo: string;
}
