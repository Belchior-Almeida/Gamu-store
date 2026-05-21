import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { AccordionModule } from 'primeng/accordion';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TimelineModule, AccordionModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  history: any = null;
  amazonianFruits: any = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getCompanyData().subscribe((data) => {
      this.history = data.history;
      this.amazonianFruits = data.history.amazonianFruits;
    });
  }
}
