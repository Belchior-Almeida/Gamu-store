import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TimelineModule, CardModule],
  templateUrl: './production.component.html',
  styleUrl: './production.component.scss',
})
export class ProductionComponent implements OnInit {
  production: any = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getCompanyData().subscribe((data) => {
      this.production = data.production;
    });
  }
}
