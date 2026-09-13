import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEmpresaDto {
  @ApiProperty({ example: '900123456-7', description: 'NIT único de la empresa' })
  @IsString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty({ example: 'Transportes del Norte S.A.S.', minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  razonSocial: string;

  @ApiPropertyOptional({
    example: 'contacto@transportesnorte.com',
    description: 'Email o teléfono del contacto principal',
  })
  @IsOptional()
  @IsString()
  contactoPrincipal?: string;
}
