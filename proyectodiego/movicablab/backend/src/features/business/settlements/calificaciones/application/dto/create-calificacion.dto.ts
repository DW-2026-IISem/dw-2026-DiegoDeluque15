import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCalificacionDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  carreraId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  puntaje: number;

  @IsString()
  @IsOptional()
  comentario?: string;
}
