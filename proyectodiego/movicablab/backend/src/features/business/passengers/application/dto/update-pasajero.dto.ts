import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO de entrada para actualizar un Pasajero.
 * Todos los campos son opcionales: el cliente solo envía lo que quiere cambiar.
 */
export class UpdatePasajeroDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
