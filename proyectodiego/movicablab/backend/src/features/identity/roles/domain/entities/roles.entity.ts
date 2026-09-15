export class Role {
  constructor(
    public readonly id: number,
    public nombre: string,
    public isActive: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  update(data: Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>) {
    Object.assign(this, data);
  }
}
