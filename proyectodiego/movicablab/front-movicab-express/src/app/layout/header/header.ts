import { Component, output } from '@angular/core';
import { Button } from 'primeng/button';
@Component({
  imports: [Button],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  title = 'MoviCab';
  menuRequested = output<void>();
  openMenu() {
    this.menuRequested.emit();
  }
}