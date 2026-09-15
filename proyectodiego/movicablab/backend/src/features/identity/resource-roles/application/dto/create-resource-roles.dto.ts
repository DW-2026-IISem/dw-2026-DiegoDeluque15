import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsInt, IsEmail, IsDateString } from 'class-validator';

export class CreateResourceRoleDto {
  @IsInt()
  @IsNotEmpty()
  resourceId: number;
  @IsInt()
  @IsNotEmpty()
  roleId: number;
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
