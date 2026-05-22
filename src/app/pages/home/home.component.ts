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
    { value: '4',      label: 'Sabores únicos'        },
    { value: '100%',   label: 'Natural e amazônico'   },
    { value: '5g',     label: 'Por goma (base sapoti)'},
    { value: 'R$19,90',label: 'Pack de 5 unidades'    },
  ];

  highlights = [
    {
      icon: 'pi pi-leaf',
      title: 'Biodegradável',
      text: 'Embalagem em papel manteiga e kraft — sem plástico, sem alumínio, 100% compostável.',
    },
    {
      icon: 'pi pi-bolt',
      title: 'Energizante',
      text: '40 mg de cafeína natural por goma via guaraná em pó. Alerta e foco sem estimulantes artificiais.',
    },
    {
      icon: 'pi pi-heart',
      title: 'Vitamina C',
      text: 'Camu-camu liofilizado fornece 13,75 mg de Vitamina C por goma — a fruta mais rica do mundo.',
    },
    {
      icon: 'pi pi-verified',
      title: 'Sem açúcar',
      text: 'Base de sapoti 100% natural, sem adoçantes artificiais, sem corantes, sem conservantes.',
    },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe((products) => {
      this.featuredProducts = products.filter((p) => p.featured);
    });
  }
}
