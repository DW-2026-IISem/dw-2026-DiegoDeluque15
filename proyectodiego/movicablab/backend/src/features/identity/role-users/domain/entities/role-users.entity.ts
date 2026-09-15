export class RoleUser {
  constructor(
    public readonly id: number,
    public userId: number,
    public roleId: number,
    public isActive: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  update(data: Partial<Omit<RoleUser, 'id' | 'createdAt' | 'updatedAt'>>) {
    Object.assign(this, data);
  }
}
