import { Component, computed, inject, input, output } from '@angular/core';
import { PanelMenu } from 'primeng/panelmenu';
import type { MenuItem } from 'primeng/api';
import { SessionStore } from '../../core/auth/session.store';
import { hasPermission } from '../../core/utils/has-permission';

/** Mapa entre un ítem del menú y el permiso mínimo que lo habilita. */
interface NavItem extends MenuItem {
  /** Permiso requerido: "MÉTODO /ruta". Si está ausente el ítem siempre se muestra. */
  requiredPermission?: string;
  items?: NavItem[];
}

/** Catálogo de ítems de operación con sus permisos asociados. */
const OPERATION_ITEMS: NavItem[] = [
  { label: 'Dashboard',        icon: 'pi pi-fw pi-th-large',    routerLink: '/dashboard' },
  { label: 'Pasajeros',        icon: 'pi pi-fw pi-users',        routerLink: '/passengers',    requiredPermission: 'GET /api/pasajeros' },
  { label: 'Vehículos',        icon: 'pi pi-fw pi-car',          routerLink: '/vehicles',      requiredPermission: 'GET /api/vehiculos' },
  { label: 'Empresas',         icon: 'pi pi-fw pi-building',     routerLink: '/companies',     requiredPermission: 'GET /api/empresas' },
  { label: 'Tipos de Vehículo',icon: 'pi pi-fw pi-tags',         routerLink: '/vehicle-types', requiredPermission: 'GET /api/tipos-vehiculo' },
  { label: 'Conductores',      icon: 'pi pi-fw pi-id-card',      routerLink: '/drivers',       requiredPermission: 'GET /api/conductores' },
  { label: 'Turnos',           icon: 'pi pi-fw pi-clock',        routerLink: '/shifts',        requiredPermission: 'GET /api/turnos' },
  { label: 'Tarifas',          icon: 'pi pi-fw pi-dollar',       routerLink: '/fares',         requiredPermission: 'GET /api/tarifas' },
  { label: 'Carreras',         icon: 'pi pi-fw pi-compass',      routerLink: '/trips',         requiredPermission: 'GET /api/carreras' },
  { label: 'Pagos',            icon: 'pi pi-fw pi-wallet',       routerLink: '/payments',      requiredPermission: 'GET /api/pagos' },
  { label: 'Calificaciones',   icon: 'pi pi-fw pi-star',         routerLink: '/ratings',       requiredPermission: 'GET /api/calificaciones' },
  { label: 'Liquidaciones',    icon: 'pi pi-fw pi-calculator',   routerLink: '/settlements',   requiredPermission: 'GET /api/liquidaciones' },
  { label: 'Prototipo',        icon: 'pi pi-fw pi-wrench',       routerLink: '/construir' },
];

/** Catálogo de administración del sistema y control de acceso. */
const ADMIN_ITEMS: NavItem[] = [
  { label: 'Seguridad y RBAC', icon: 'pi pi-fw pi-shield', routerLink: '/admin/rbac', requiredPermission: 'GET /api/usuarios' },
];

@Component({
  selector: 'app-aside',
  imports: [PanelMenu],
  styleUrl: './aside.css',
  templateUrl: './aside.html',
})
export class Aside {
  private readonly session = inject(SessionStore);

  readonly items = input<MenuItem[]>([]);
  navigated = output<void>();

  /** Ítems del menú filtrados según los permisos efectivos del usuario. */
  readonly filteredItems = computed<MenuItem[]>(() => {
    const permissions = this.session.permissions();

    const allowedOperation = OPERATION_ITEMS.filter((item) => {
      if (!item.requiredPermission) return true;
      const [method, ...pathParts] = item.requiredPermission.split(' ');
      return hasPermission(permissions, method, pathParts.join(' '));
    });

    const allowedAdmin = ADMIN_ITEMS.filter((item) => {
      if (!item.requiredPermission) return true;
      const [method, ...pathParts] = item.requiredPermission.split(' ');
      return hasPermission(permissions, method, pathParts.join(' '));
    });

    const menu: MenuItem[] = [
      {
        label: 'Operación',
        icon: 'pi pi-fw pi-compass',
        expanded: true,
        items: allowedOperation,
      },
    ];

    if (allowedAdmin.length > 0) {
      menu.push({
        label: 'Administración',
        icon: 'pi pi-fw pi-cog',
        expanded: true,
        items: allowedAdmin,
      });
    }

    return menu;
  });

  onNavigate() {
    this.navigated.emit();
  }
}
