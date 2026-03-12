import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  private mockData = inject(MockDataService);
  private route = inject(ActivatedRoute);

  books = this.mockData.books;
  categories = this.mockData.categories;
  pagination = this.mockData.pagination;

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

  onPageChange(page: number) {
    this.mockData.fetchBooks(
      page,
      this.pagination().limit,
      this.searchTerm(),
      this.selectedCategory()
    );
  }

  addToCart(book: Book) {
    this.mockData.addToCart(book);
    alert(`${book.title} added to cart!`);
  }
}
