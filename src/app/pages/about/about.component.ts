import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule, DividerModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  company: any = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getCompanyData().subscribe((data) => {
      this.company = data;
    });
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const last  = parts[parts.length - 1]?.[0] ?? '';
    return (first + (parts.length > 1 ? last : '')).toUpperCase();
  }
}
