import {Component, inject, signal, computed} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe, DatePipe, UpperCasePipe} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MockDataService} from '../../services/mock-data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    UpperCasePipe,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private mockData = inject(MockDataService);

  books = this.mockData.books;
  orders = this.mockData.orders;

  bookColumns: string[] = ['id', 'title', 'author', 'price', 'stock', 'actions'];
  orderColumns: string[] = ['id', 'orderDate', 'userId', 'total', 'status', 'actions'];

  showAddForm = signal(false);
  newBook = {
    title: '',
    author: '',
    price: 0,
  };

  totalSales = computed(() => this.orders().reduce((acc, order) => acc + order.total, 0));

  addBook() {
    // Mock implementation
    alert('Book added successfully (Mock)!');
    this.showAddForm.set(false);
  }
}
