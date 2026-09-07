/**
 * Entidad de dominio Pasajero.
 * No depende de NestJS, Sequelize ni HTTP: es una clase de negocio pura.
 * Las invariantes (reglas que SIEMPRE deben cumplirse) viven aquí, no en el controlador.
 */
export class Pasajero {
  constructor(
    public readonly id: number | null,
    public nombre: string,
    public descripcion: string | null,
    public isActive: boolean,
    public readonly createdAt: Date | null,
    public updatedAt: Date | null,
  ) {
    this.validarNombre(nombre);
  }

  /**
   * Invariante: el nombre es obligatorio y debe tener al menos 2 caracteres.
   * Se valida en el constructor para que sea imposible crear un Pasajero inválido.
   */
  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length < 2) {
      throw new Error('El nombre del pasajero debe tener al menos 2 caracteres');
    }
  }

  /**
   * Regla de negocio: desactivar (soft delete) en vez de borrar físicamente.
   */
  desactivar(): void {
    this.isActive = false;
  }

  actualizarDatos(nombre: string, descripcion: string | null): void {
    this.validarNombre(nombre);
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}
