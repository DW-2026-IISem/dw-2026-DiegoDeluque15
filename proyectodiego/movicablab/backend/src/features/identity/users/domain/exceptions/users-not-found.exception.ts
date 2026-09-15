export class UserNotFoundException extends Error {
  constructor(id: number) {
    super(`User con ID ${id} no encontrado`);
    this.name = 'UserNotFoundException';
  }
}
