import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private mockData = inject(MockDataService);

  activeTab = signal('books');
  books = this.mockData.books;
  orders = this.mockData.orders;

  showAddForm = signal(false);
  newBook = {
    title: '',
    author: '',
    price: 0
  };

  totalSales = () => this.orders().reduce((acc, order) => acc + order.total, 0);

  addBook() {
    // Mock implementation
    alert('Book added successfully (Mock)!');
    this.showAddForm.set(false);
  }
}
