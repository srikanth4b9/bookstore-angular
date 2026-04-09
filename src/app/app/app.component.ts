import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Store} from '@ngrx/store';

import {NavbarComponent} from '../components/navbar/navbar.component';
import {BooksActions} from '../store/books/books.actions';
import {CategoriesActions} from '../store/categories/categories.actions';
import {OrdersActions} from '../store/orders/orders.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private store = inject(Store);

  constructor() {
    this.store.dispatch(BooksActions.loadBooks({page: 1, limit: 12}));
    this.store.dispatch(CategoriesActions.loadCategories());
    this.store.dispatch(OrdersActions.loadOrders());
  }
}
