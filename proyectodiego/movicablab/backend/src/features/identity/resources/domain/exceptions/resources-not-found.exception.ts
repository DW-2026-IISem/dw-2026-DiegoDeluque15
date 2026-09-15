export class ResourceNotFoundException extends Error {
  constructor(id: number) {
    super(`Resource con ID ${id} no encontrado`);
    this.name = 'ResourceNotFoundException';
  }
}
