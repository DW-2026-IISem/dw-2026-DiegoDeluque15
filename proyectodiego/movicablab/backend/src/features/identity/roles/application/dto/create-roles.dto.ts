import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsInt, IsEmail, IsDateString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
