import { User } from '../entities/users.entity';
export interface IUserRepository {
  create(entity: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, entity: User): Promise<User>;
  delete(id: number): Promise<void>;
  findByEmail(email: string): Promise<User | null>;

}
