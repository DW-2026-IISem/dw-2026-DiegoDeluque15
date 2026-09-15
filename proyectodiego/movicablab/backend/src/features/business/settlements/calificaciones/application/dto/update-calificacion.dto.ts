import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCalificacionDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  puntaje?: number;

  @IsString()
  @IsOptional()
  comentario?: string;
}
