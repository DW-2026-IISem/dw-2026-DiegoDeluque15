import { DomainException } from '../../../../../../common/exceptions/domain.exception';

export interface EmpresaProps {
  id: number;
  nit: string;
  razonSocial: string;
  contactoPrincipal: string | null;
  isActive: boolean;
}

export interface EmpresaCreateProps {
  nit: string;
  razonSocial: string;
  contactoPrincipal?: string | null;
}

export interface EmpresaUpdateProps {
  razonSocial?: string;
  contactoPrincipal?: string | null;
}

export class Empresa {
  readonly id: number;
  readonly nit: string;
  razonSocial: string;
  contactoPrincipal: string | null;
  isActive: boolean;

  constructor(props: EmpresaProps) {
    this.id = props.id;
    this.nit = props.nit;
    this.razonSocial = props.razonSocial;
    this.contactoPrincipal = props.contactoPrincipal;
    this.isActive = props.isActive;
  }

  static create(props: EmpresaCreateProps): EmpresaCreateProps {
    Empresa.validateNit(props.nit);
    Empresa.validateRazonSocial(props.razonSocial);

    if (props.contactoPrincipal) {
      Empresa.validateContactoPrincipal(props.contactoPrincipal);
    }

    return {
      nit: props.nit.trim(),
      razonSocial: props.razonSocial.trim(),
      contactoPrincipal: props.contactoPrincipal ?? null,
    };
  }

  /**
   * NIT es inmutable tras creación: UpdateEmpresaUseCase nunca llama
   * a un setter de NIT. Si el DTO envía nit, se ignora silenciosamente.
   */
  update(props: EmpresaUpdateProps): void {
    if (props.razonSocial !== undefined) {
      Empresa.validateRazonSocial(props.razonSocial);
      this.razonSocial = props.razonSocial.trim();
    }

    if (props.contactoPrincipal !== undefined) {
      if (props.contactoPrincipal !== null) {
        Empresa.validateContactoPrincipal(props.contactoPrincipal);
      }
      this.contactoPrincipal = props.contactoPrincipal;
    }

  }

  deactivate(): void {
    this.isActive = false;
  }

  private static validateNit(nit: string): void {
    if (!nit || nit.trim().length === 0) {
      throw new DomainException('El NIT no puede estar vacío');
    }
  }

  private static validateRazonSocial(razonSocial: string): void {
    if (!razonSocial || razonSocial.trim().length < 2) {
      throw new DomainException('La razón social debe tener al menos 2 caracteres');
    }
  }

  /**
   * contactoPrincipal puede ser un email (contiene @) o un teléfono
   * (solo dígitos, espacios, +, - con mínimo 7 dígitos).
   */
  private static validateContactoPrincipal(contacto: string): void {
    const trimmed = contacto.trim();
    if (!trimmed) {
      throw new DomainException('El contacto principal no puede estar vacío si se proporciona');
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isPhone = /^[+\-\d\s()]{7,20}$/.test(trimmed);

    if (!isEmail && !isPhone) {
      throw new DomainException(
        'El contacto principal debe ser un email válido o un número telefónico (7-20 caracteres)',
      );
    }
  }
}
