export class RefreshToken {
  constructor(
    public readonly id: number,
    public userId: number,
    public tokenHash: string,
    public expiresAt: Date,
    public revoked: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
  // NOTA: El campo tokenHash es solo estructura de datos para esta pista,
  // sin lógica de seguridad real. El hashing real es responsabilidad de una fase Auth futura.

  update(data: Partial<Omit<RefreshToken, 'id' | 'createdAt' | 'updatedAt'>>) {
    Object.assign(this, data);
  }
}
