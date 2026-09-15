import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsInt, IsEmail, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  passwordHash: string;
  // NOTA: Este campo es solo estructura de datos para esta pista, sin lógica de seguridad real.
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
