export class ResourceRoleAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceRoleAlreadyExistsException';
  }
}
