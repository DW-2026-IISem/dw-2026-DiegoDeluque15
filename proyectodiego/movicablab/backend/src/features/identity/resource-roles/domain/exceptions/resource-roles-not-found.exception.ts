export class ResourceRoleNotFoundException extends Error {
  constructor(id: number) {
    super(`ResourceRole con ID ${id} no encontrado`);
    this.name = 'ResourceRoleNotFoundException';
  }
}
