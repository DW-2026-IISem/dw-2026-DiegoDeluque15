import { Injectable } from '@nestjs/common';
import { CalificacionModel } from '../models/calificacion.model';
import { ICalificacionRepository } from '../../../domain/interfaces/calificacion-repository.interface';
import { CalificacionProps } from '../../../domain/entities/calificacion.entity';

@Injectable()
export class SequelizeCalificacionRepository implements ICalificacionRepository {
  async save(calificacion: CalificacionProps): Promise<CalificacionProps> {
    const created = await CalificacionModel.create(calificacion as any);
    return created.toJSON() as CalificacionProps;
  }

  async findById(id: number): Promise<CalificacionProps | null> {
    const calificacion = await CalificacionModel.findOne({ where: { id, isActive: true } });
    return calificacion ? calificacion.toJSON() as CalificacionProps : null;
  }

  async findByCarreraId(carreraId: number): Promise<CalificacionProps | null> {
    const calificacion = await CalificacionModel.findOne({ where: { carreraId, isActive: true } });
    return calificacion ? calificacion.toJSON() as CalificacionProps : null;
  }

  async findAll(): Promise<CalificacionProps[]> {
    const calificaciones = await CalificacionModel.findAll({ where: { isActive: true } });
    return calificaciones.map((c) => c.toJSON() as CalificacionProps);
  }

  async update(id: number, data: Partial<CalificacionProps>): Promise<CalificacionProps | null> {
    const [affectedCount] = await CalificacionModel.update(data, { where: { id, isActive: true } });
    if (affectedCount === 0) return null;
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [affectedCount] = await CalificacionModel.update({ isActive: false }, { where: { id, isActive: true } });
    return affectedCount > 0;
  }
}
