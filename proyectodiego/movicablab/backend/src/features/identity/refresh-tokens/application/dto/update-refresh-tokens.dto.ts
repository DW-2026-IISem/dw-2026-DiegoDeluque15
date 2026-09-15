import { PartialType } from '@nestjs/mapped-types';
import { CreateRefreshTokenDto } from './create-refresh-tokens.dto';

export class UpdateRefreshTokenDto extends PartialType(CreateRefreshTokenDto) {}
