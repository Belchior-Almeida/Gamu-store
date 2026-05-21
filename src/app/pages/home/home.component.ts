import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DataService } from '../../services/data.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, TagModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  stats = [
    { value: '200+',  label: 'Famílias beneficiadas' },
    { value: '8',     label: 'Superfrutas amazônicas' },
    { value: '5.000', label: 'Hectares protegidos' },
    { value: '3',     label: 'Países exportadores' },
  ];

  highlights = [
    {
      icon: 'pi pi-leaf',
      title: 'Sustentável',
      text: 'Colheita responsável que preserva a floresta para as próximas gerações.',
    },
    {
      icon: 'pi pi-users',
      title: 'Justo',
      text: 'Comércio justo com comunidades ribeirinhas e indígenas da Amazônia.',
    },
    {
      icon: 'pi pi-verified',
      title: 'Certificado',
      text: 'Orgânico Brasil, Fair Trade e Rainforest Alliance. Qualidade comprovada.',
    },
    {
      icon: 'pi pi-heart',
      title: 'Nutritivo',
      text: 'Superalimentos com concentrações únicas de vitaminas e antioxidantes.',
    },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe((products) => {
      this.featuredProducts = products.filter((p) => p.featured);
    });
  }
}
