import {Component, inject, computed, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';

import {Book} from '../../models/models';
import {selectSelectedBookDetail, selectBooksLoading} from '../../store/books/books.selectors';
import {selectCartItems} from '../../store/cart/cart.selectors';
import {BooksActions} from '../../store/books/books.actions';
import {CartActions} from '../../store/cart/cart.actions';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  book = this.store.selectSignal(selectSelectedBookDetail);
  isLoading = this.store.selectSignal(selectBooksLoading);

  private cartItems = this.store.selectSignal(selectCartItems);
  private cartItem = computed(() => {
    const b = this.book();
    if (!b) return undefined;
    return this.cartItems().find((i) => i.bookId === b.id);
  });
  cartQuantity = computed(() => this.cartItem()?.quantity ?? 0);

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params['id'];
      this.store.dispatch(BooksActions.loadBook({id}));
    });
  }

  addToCart(book: Book) {
    this.store.dispatch(CartActions.addToCart({book}));
  }

  incrementQuantity() {
    const item = this.cartItem();
    if (item) {
      this.store.dispatch(
        CartActions.updateQuantity({itemId: item.id, quantity: item.quantity + 1}),
      );
    }
  }

  decrementQuantity() {
    const item = this.cartItem();
    if (item) {
      this.store.dispatch(
        CartActions.updateQuantity({itemId: item.id, quantity: item.quantity - 1}),
      );
    }
  }

  ngOnDestroy() {
    this.store.dispatch(BooksActions.clearSelectedBook());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
