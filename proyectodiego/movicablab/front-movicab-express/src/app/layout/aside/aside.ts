import { Component, input, output } from '@angular/core';
import { PanelMenu } from 'primeng/panelmenu';
import type { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-aside',
  imports: [PanelMenu],
  styleUrl: './aside.css',
  templateUrl: './aside.html',
})
export class Aside {
  readonly items = input<MenuItem[]>([
    {
      label: 'Operación',
      icon: 'pi pi-fw pi-compass',
      expanded: true,
      items: [
        { label: 'Pasajeros', icon: 'pi pi-fw pi-users', routerLink: '/passengers' },
        { label: 'Vehículos', icon: 'pi pi-fw pi-car', routerLink: '/vehicles' },
        { label: 'Empresas', icon: 'pi pi-fw pi-building', routerLink: '/companies' },
        { label: 'Tipos de Vehículo', icon: 'pi pi-fw pi-tags', routerLink: '/vehicle-types' },
        { label: 'Prototipo', icon: 'pi pi-fw pi-wrench', routerLink: '/construir' },
      ],
    },
  ]);
  navigated = output<void>();

  onNavigate() {
    this.navigated.emit();
  }
}