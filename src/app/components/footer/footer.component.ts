import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, DividerModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  navLinks = [
    { label: 'Início',     path: '/' },
    { label: 'Produtos',   path: '/produtos' },
    { label: 'Quem Somos', path: '/quem-somos' },
    { label: 'Produção',   path: '/producao' },
    { label: 'História',   path: '/historia' },
  ];
}
