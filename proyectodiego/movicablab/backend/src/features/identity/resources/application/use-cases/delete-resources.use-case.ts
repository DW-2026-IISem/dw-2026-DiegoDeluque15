import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../domain/interfaces/resources.repository.interface';

@Injectable()
export class DeleteResourceUseCase {
  constructor(@Inject('IResourceRepository') private readonly repository: IResourceRepository) {}

  async execute(id: number) {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Resource no encontrado');
    await this.repository.delete(id);
  }
}
