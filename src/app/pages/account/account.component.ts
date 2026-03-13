import {Component, inject} from '@angular/core';
import {CurrencyPipe, DatePipe, UpperCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MockDataService} from '../../services/mock-data.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    UpperCasePipe,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  private mockData = inject(MockDataService);
  user = this.mockData.currentUser;
  orders = this.mockData.orders;
}
