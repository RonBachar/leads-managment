import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '../shared/constants/app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToLeads() {
    this.router.navigate([APP_CONSTANTS.ROUTES.LEADS]);
  }

  goToClients() {
    this.router.navigate([APP_CONSTANTS.ROUTES.CLIENTS]);
  }
}
