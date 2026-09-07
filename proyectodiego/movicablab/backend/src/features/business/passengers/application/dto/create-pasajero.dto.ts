import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO de entrada para crear un Pasajero.
 * class-validator revisa la FORMA del dato antes de que llegue al dominio.
 * La regla de negocio real (mínimo 2 caracteres) también vive en la entidad,
 * pero validarla aquí da un error 400 claro antes de tocar la base de datos.
 */
export class CreatePasajeroDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
