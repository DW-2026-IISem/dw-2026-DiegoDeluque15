export class ResourceRole {
  constructor(
    public readonly id: number,
    public resourceId: number,
    public roleId: number,
    public isActive: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  update(data: Partial<Omit<ResourceRole, 'id' | 'createdAt' | 'updatedAt'>>) {
    Object.assign(this, data);
  }
}
