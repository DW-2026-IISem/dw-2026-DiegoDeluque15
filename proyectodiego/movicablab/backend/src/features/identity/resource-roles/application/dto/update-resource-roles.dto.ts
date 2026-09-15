import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceRoleDto } from './create-resource-roles.dto';

export class UpdateResourceRoleDto extends PartialType(CreateResourceRoleDto) {}
