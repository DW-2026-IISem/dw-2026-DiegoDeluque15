import { Role } from '../entities/roles.entity';
export interface IRoleRepository {
  create(entity: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: number, entity: Role): Promise<Role>;
  delete(id: number): Promise<void>;
  findByNombre(nombre: string): Promise<Role | null>;

}
