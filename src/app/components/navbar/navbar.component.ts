import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  scrolled = false;
  mobileMenuOpen = false;

  navLinks = [
    { label: 'Início',      path: '/' },
    { label: 'Produtos',    path: '/produtos' },
    { label: 'Quem Somos',  path: '/quem-somos' },
    { label: 'Produção',    path: '/producao' },
    { label: 'História',    path: '/historia' },
    { label: 'Dashboard',   path: '/dashboard' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 40;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
