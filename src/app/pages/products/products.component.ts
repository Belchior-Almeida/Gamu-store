import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DataService } from '../../services/data.service';
import { Product, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectButtonModule,
    InputTextModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory: string | null = null;
  viewMode = 'grid';

  viewOptions = [
    { icon: 'pi pi-th-large', value: 'grid' },
    { icon: 'pi pi-list',     value: 'table' },
  ];

  categories: ProductCategory[] = [
    { label: 'Todos', value: null },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
      this.buildCategories(products);
    });
  }

  private buildCategories(products: Product[]) {
    const unique = [...new Set(products.map((p) => p.category))];
    this.categories = [
      { label: 'Todos', value: null },
      ...unique.map((c) => ({ label: c, value: c })),
    ];
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term));
      const matchesCategory =
        !this.selectedCategory || p.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange() { this.applyFilters(); }
  onCategoryChange() { this.applyFilters(); }
}
