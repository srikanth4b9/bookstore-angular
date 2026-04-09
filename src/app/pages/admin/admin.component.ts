import {Component, inject, signal} from '@angular/core';
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
import {Store} from '@ngrx/store';

import {selectAllBooks} from '../../store/books/books.selectors';
import {selectAllOrders, selectTotalSales} from '../../store/orders/orders.selectors';
import {BooksActions} from '../../store/books/books.actions';

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
  private store = inject(Store);

  books = this.store.selectSignal(selectAllBooks);
  orders = this.store.selectSignal(selectAllOrders);

  bookColumns: string[] = ['id', 'title', 'author', 'price', 'stock', 'actions'];
  orderColumns: string[] = ['id', 'orderDate', 'userId', 'total', 'status', 'actions'];

  showAddForm = signal(false);
  newBook = {
    title: '',
    author: '',
    price: 0,
  };

  totalSales = this.store.selectSignal(selectTotalSales);

  addBook() {
    this.store.dispatch(BooksActions.addBook({book: this.newBook}));
    this.showAddForm.set(false);
  }
}
