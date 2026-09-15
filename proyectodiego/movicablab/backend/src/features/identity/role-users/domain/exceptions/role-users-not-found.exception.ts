export class RoleUserNotFoundException extends Error {
  constructor(id: number) {
    super(`RoleUser con ID ${id} no encontrado`);
    this.name = 'RoleUserNotFoundException';
  }
}
