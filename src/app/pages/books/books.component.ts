import {Component, inject, signal, effect, OnDestroy, untracked} from '@angular/core';
import {RouterLink, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe, SlicePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {Store} from '@ngrx/store';
import {Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';

import {Book} from '../../models/models';
import {
  selectAllBooks,
  selectBooksPagination,
  selectBooksLoading,
} from '../../store/books/books.selectors';
import {selectAllCategories} from '../../store/categories/categories.selectors';
import {selectCartBookMap} from '../../store/cart/cart.selectors';
import {BooksActions} from '../../store/books/books.actions';
import {CartActions} from '../../store/cart/cart.actions';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    SlicePipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  books = this.store.selectSignal(selectAllBooks);
  categories = this.store.selectSignal(selectAllCategories);
  pagination = this.store.selectSignal(selectBooksPagination);
  isLoading = this.store.selectSignal(selectBooksLoading);

  searchTerm = signal('');
  selectedCategory = signal('');
  sortBy = signal('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');
  viewMode = signal<'grid' | 'list'>('grid');
  addedBooks = signal<Set<string>>(new Set());
  cartBookMap = this.store.selectSignal(selectCartBookMap);

  constructor() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });

    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm.set(term);
      });

    effect(() => {
      this.selectedCategory();
      this.sortBy();
      this.sortOrder();
      this.searchTerm();

      const currentLimit = untracked(() => this.pagination().limit);
      this.store.dispatch(
        BooksActions.loadBooks({
          page: 1,
          limit: currentLimit,
          search: this.searchTerm() || undefined,
          category: this.selectedCategory() || undefined,
          sortBy: this.sortBy(),
          sortOrder: this.sortOrder(),
        }),
      );
    });
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onFilterChange() {
    // The main logic is in the effect
  }

  onPageChange(event: PageEvent) {
    this.store.dispatch(
      BooksActions.loadBooks({
        page: event.pageIndex + 1,
        limit: event.pageSize,
        search: this.searchTerm() || undefined,
        category: this.selectedCategory() || undefined,
        sortBy: this.sortBy(),
        sortOrder: this.sortOrder(),
      }),
    );
  }

  addToCart(book: Book) {
    this.store.dispatch(CartActions.addToCart({book}));
    this.addedBooks.update((set) => {
      const newSet = new Set(set);
      newSet.add(book.id);
      return newSet;
    });

    setTimeout(() => {
      this.addedBooks.update((set) => {
        const newSet = new Set(set);
        newSet.delete(book.id);
        return newSet;
      });
    }, 2000);
  }

  incrementQuantity(bookId: string) {
    const entry = this.cartBookMap().get(bookId);
    if (entry) {
      this.store.dispatch(
        CartActions.updateQuantity({itemId: entry.cartItemId, quantity: entry.quantity + 1}),
      );
    }
  }

  decrementQuantity(bookId: string) {
    const entry = this.cartBookMap().get(bookId);
    if (entry) {
      this.store.dispatch(
        CartActions.updateQuantity({itemId: entry.cartItemId, quantity: entry.quantity - 1}),
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
