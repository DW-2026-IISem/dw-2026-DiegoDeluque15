export class User {
  constructor(
    public readonly id: number,
    public email: string,
    public passwordHash: string,
    public isActive: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
  // NOTA: El campo passwordHash es solo estructura de datos para esta pista,
  // sin lógica de seguridad real. El hashing real es responsabilidad de una fase Auth futura.

  update(data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
    Object.assign(this, data);
  }
}
