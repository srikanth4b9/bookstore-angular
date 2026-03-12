import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MockDataService } from '../../services/mock-data.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  private mockData = inject(MockDataService);
  private route = inject(ActivatedRoute);

  books = this.mockData.books;
  categories = this.mockData.categories;
  pagination = this.mockData.pagination;
  isLoading = this.mockData.isLoading;

  searchTerm = signal('');
  selectedCategory = signal('');
  sortBy = signal('createdAt');
  sortOrder = signal('desc');

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });

    // Reactive fetch on state change
    effect(() => {
      this.mockData.fetchBooks(
        this.pagination().page,
        this.pagination().limit,
        this.searchTerm(),
        this.selectedCategory()
      );
    }, { allowSignalWrites: true });
  }

  onPageChange(event: PageEvent) {
    this.mockData.fetchBooks(
      event.pageIndex + 1,
      event.pageSize,
      this.searchTerm(),
      this.selectedCategory()
    );
  }

  addToCart(book: Book) {
    this.mockData.addToCart(book);
  }
}
