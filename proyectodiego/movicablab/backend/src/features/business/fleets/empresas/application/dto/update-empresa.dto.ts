import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * NIT es inmutable tras creación: si el cliente envía `nit` en el body,
 * se ignora silenciosamente en UpdateEmpresaUseCase.
 */
export class UpdateEmpresaDto {
  @ApiPropertyOptional({ example: 'Transportes del Norte S.A.S.', minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  razonSocial?: string;

  @ApiPropertyOptional({
    example: '+57 300 123 4567',
    description: 'Email o teléfono del contacto principal',
  })
  @IsOptional()
  @IsString()
  contactoPrincipal?: string;
}
