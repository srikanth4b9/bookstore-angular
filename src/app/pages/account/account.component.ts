import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  private mockData = inject(MockDataService);
  user = this.mockData.currentUser;
  orders = this.mockData.orders;
}
