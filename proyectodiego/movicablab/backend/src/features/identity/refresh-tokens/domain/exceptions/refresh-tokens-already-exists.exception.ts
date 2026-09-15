export class RefreshTokenAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RefreshTokenAlreadyExistsException';
  }
}
