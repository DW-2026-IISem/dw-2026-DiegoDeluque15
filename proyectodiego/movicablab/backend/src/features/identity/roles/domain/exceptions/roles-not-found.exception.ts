export class RoleNotFoundException extends Error {
  constructor(id: number) {
    super(`Role con ID ${id} no encontrado`);
    this.name = 'RoleNotFoundException';
  }
}
