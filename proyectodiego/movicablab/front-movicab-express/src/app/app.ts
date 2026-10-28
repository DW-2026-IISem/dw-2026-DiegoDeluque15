import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { Header } from './layout/header/header';
import { Aside } from './layout/aside/aside';
import { Footer } from './layout/footer/footer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Aside, Footer, Drawer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  drawerOpen = signal(false);
  openDrawer() { this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }
}