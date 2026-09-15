import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resources.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
