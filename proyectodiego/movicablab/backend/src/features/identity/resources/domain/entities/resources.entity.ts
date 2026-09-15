export class Resource {
  constructor(
    public readonly id: number,
    public nombre: string,
    public isActive: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  update(data: Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>>) {
    Object.assign(this, data);
  }
}
