import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CarreraEstado } from '../../domain/entities/carrera.entity';

export class ChangeEstadoCarreraDto {
  @ApiProperty({ example: 'aceptada' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['aceptada', 'en_curso', 'cerrada', 'cancelada'])
  estado: CarreraEstado;
}
