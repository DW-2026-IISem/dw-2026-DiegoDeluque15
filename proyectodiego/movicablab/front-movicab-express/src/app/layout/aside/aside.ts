import { Component, output } from '@angular/core';
import { PanelMenu } from 'primeng/panelmenu';
import type { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-aside',
  imports: [PanelMenu],
  styleUrl: './aside.css',
  templateUrl: './aside.html',
})
export class Aside {
  navigated = output<void>();
  items: MenuItem[] = [
    {
      label: 'Operación',
      icon: 'pi pi-fw pi-car',
      items: [
        { label: 'Construir', icon: 'pi pi-fw pi-wrench', routerLink: '/construir' },
      ],
    },
  ];
  onNavigate() {
    this.navigated.emit();
  }
}