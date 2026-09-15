import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsInt, IsEmail, IsDateString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;
  @IsString()
  @IsNotEmpty()
  tokenHash: string;
  // NOTA: Este campo es solo estructura de datos para esta pista, sin lógica de seguridad real.
  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
  @IsBoolean()
  @IsOptional()
  revoked: boolean;
}
