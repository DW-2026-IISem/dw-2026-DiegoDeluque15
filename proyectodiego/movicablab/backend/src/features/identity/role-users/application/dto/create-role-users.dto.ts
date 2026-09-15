import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsInt, IsEmail, IsDateString } from 'class-validator';

export class CreateRoleUserDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;
  @IsInt()
  @IsNotEmpty()
  roleId: number;
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
