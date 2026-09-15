export class RoleUserAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoleUserAlreadyExistsException';
  }
}
