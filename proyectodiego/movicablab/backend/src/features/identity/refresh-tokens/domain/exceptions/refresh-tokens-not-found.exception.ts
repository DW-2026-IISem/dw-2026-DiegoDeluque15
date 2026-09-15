export class RefreshTokenNotFoundException extends Error {
  constructor(id: number) {
    super(`RefreshToken con ID ${id} no encontrado`);
    this.name = 'RefreshTokenNotFoundException';
  }
}
