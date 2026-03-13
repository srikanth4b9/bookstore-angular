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
import {MockDataService} from '../../services/mock-data.service';
import {Book} from '../../models/models';
import {Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';

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
  private mockData = inject(MockDataService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  books = this.mockData.books;
  categories = this.mockData.categories;
  pagination = this.mockData.pagination;
  isLoading = this.mockData.isLoading;

  searchTerm = signal('');
  selectedCategory = signal('');
  sortBy = signal('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');
  viewMode = signal<'grid' | 'list'>('grid');

  constructor() {
    // Initial category from query params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });

    // Handle debounced search
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm.set(term);
      });

    // Reactive fetch for category and sort changes
    effect(
      () => {
        // Signals that trigger a refetch
        this.selectedCategory();
        this.sortBy();
        this.sortOrder();
        this.searchTerm();

        // We use untracked to avoid subscribing to pagination()
        // so updates to pagination don't trigger this effect recursively
        const currentLimit = untracked(() => this.pagination().limit);
        this.mockData.fetchBooks(
          1,
          currentLimit,
          this.searchTerm(),
          this.selectedCategory(),
          this.sortBy(),
          this.sortOrder(),
        );
      },
      {allowSignalWrites: true},
    );
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onFilterChange() {
    this.resetAndFetch();
  }

  private resetAndFetch() {
    // This is just a helper, the main logic is in the effect
  }

  onPageChange(event: PageEvent) {
    this.mockData.fetchBooks(
      event.pageIndex + 1,
      event.pageSize,
      this.searchTerm(),
      this.selectedCategory(),
      this.sortBy(),
      this.sortOrder(),
    );
  }

  addToCart(book: Book) {
    this.mockData.addToCart(book);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
