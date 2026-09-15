import { Resource } from '../entities/resources.entity';
export interface IResourceRepository {
  create(entity: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource>;
  findById(id: number): Promise<Resource | null>;
  findAll(): Promise<Resource[]>;
  update(id: number, entity: Resource): Promise<Resource>;
  delete(id: number): Promise<void>;
  findByNombre(nombre: string): Promise<Resource | null>;

}
